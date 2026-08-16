import { randomUUID } from "node:crypto";

const STATUSES = new Set(["new","reviewing","contacted","documents_pending","shortlisted","application_started","admitted","closed","not_qualified"]);
const attempts = new Map();
function clean(value,max=2000){return typeof value==="string"?value.trim().slice(0,max):""}
function allow(ip){const now=Date.now();const recent=(attempts.get(ip)||[]).filter(t=>now-t<3600000);if(recent.length>=8)return false;recent.push(now);attempts.set(ip,recent);return true}
function validEmail(v){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)&&v.length<=254}
function serverHeaders(key){const h={apikey:key,"Content-Type":"application/json"};if(!key.startsWith("sb_secret_"))h.Authorization=`Bearer ${key}`;return h}
async function currentStaff(req,url,key){
  const authorization=clean(req.headers.authorization,5000);if(!authorization.startsWith("Bearer "))return null;
  const userResponse=await fetch(`${url}/auth/v1/user`,{headers:{apikey:key,Authorization:authorization}});if(!userResponse.ok)return null;
  const user=await userResponse.json();
  const roleResponse=await fetch(`${url}/rest/v1/staff_roles?id=eq.${encodeURIComponent(user.id)}&select=role&limit=1`,{headers:serverHeaders(key)});if(!roleResponse.ok)return null;
  const roles=await roleResponse.json();if(!roles[0]||!["admin","staff"].includes(roles[0].role))return null;
  return {user,role:roles[0].role};
}

export default async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  res.setHeader("X-Content-Type-Options","nosniff");
  if(!["POST","GET","PATCH"].includes(req.method)){res.setHeader("Allow","POST, GET, PATCH");return res.status(405).json({error:"Method not allowed."})}

  const url=clean(process.env.SUPABASE_URL,500).replace(/\/$/,"");
  const key=clean(process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY,5000);
  if(!url||!key)return res.status(503).json({error:"College inspection storage is not configured."});
  const headers=serverHeaders(key);

  if(req.method==="GET"){
    const staff=await currentStaff(req,url,key);if(!staff)return res.status(401).json({error:"Staff authorization required."});
    const response=await fetch(`${url}/rest/v1/college_inspections?select=*&order=created_at.desc&limit=500`,{headers});
    const data=await response.json().catch(()=>null);
    if(!response.ok){console.error("College inspections GET",response.status,data);return res.status(502).json({error:"Could not load college inspections."})}
    return res.status(200).json({records:data||[]});
  }

  if(req.method==="PATCH"){
    const staff=await currentStaff(req,url,key);if(!staff)return res.status(401).json({error:"Staff authorization required."});
    const id=clean(req.body?.id,60);if(!/^[0-9a-f-]{36}$/i.test(id))return res.status(400).json({error:"Invalid record ID."});
    const update={updated_at:new Date().toISOString()};
    const status=clean(req.body?.status,40);if(status){if(!STATUSES.has(status))return res.status(400).json({error:"Invalid status."});update.status=status}
    if("staff_notes" in (req.body||{}))update.staff_notes=clean(req.body.staff_notes,5000)||null;
    if("assigned_to" in (req.body||{}))update.assigned_to=clean(req.body.assigned_to,200)||null;
    if("follow_up_date" in (req.body||{}))update.follow_up_date=clean(req.body.follow_up_date,20)||null;
    const response=await fetch(`${url}/rest/v1/college_inspections?id=eq.${encodeURIComponent(id)}&select=*`,{method:"PATCH",headers:{...headers,Prefer:"return=representation"},body:JSON.stringify(update)});
    const data=await response.json().catch(()=>null);
    if(!response.ok){console.error("College inspections PATCH",response.status,data);return res.status(502).json({error:"Could not update the record."})}
    return res.status(200).json({record:data?.[0]||null});
  }

  const ip=String(req.headers["x-forwarded-for"]||req.socket?.remoteAddress||"unknown").split(",")[0].trim();
  if(!allow(ip))return res.status(429).json({error:"Too many submissions. Please try again later."});
  const body=req.body&&typeof req.body==="object"?req.body:{};
  if(clean(body.website_confirm,200))return res.status(201).json({reference:`EDU-${randomUUID().slice(0,8).toUpperCase()}`});
  if(body.consent!==true)return res.status(400).json({error:"Consent is required."});

  const fields={};for(const [name,value] of Object.entries(body.data||{}).slice(0,100)){
    if(!/^[a-z][a-z0-9_]{0,60}$/i.test(name))continue;
    if(Array.isArray(value))fields[name]=value.map(v=>clean(v,200)).filter(Boolean).slice(0,40);
    else fields[name]=clean(value,name.includes("details")||name.includes("goals")||name.includes("notes")?3000:700);
  }
  const required=["student_name","email","phone","whatsapp","date_of_birth","current_qualification","institution_name","passing_year","academic_score","desired_level","preferred_course","preferred_destination","preferred_intake","study_mode","annual_budget"];
  for(const field of required)if(!fields[field])return res.status(400).json({error:`Please complete: ${field.replaceAll("_"," ")}.`});
  if(!validEmail(fields.email))return res.status(400).json({error:"Enter a valid email address."});
  for(const field of ["phone","whatsapp"])if(String(fields[field]).replace(/\D/g,"").length<7)return res.status(400).json({error:`Enter a valid ${field.replaceAll("_"," ")}.`});
  const categories=Array.isArray(fields.course_categories)?[...new Set(fields.course_categories)].slice(0,30):[];
  if(!categories.length)return res.status(400).json({error:"Select at least one course category."});

  const record={
    student_name:fields.student_name,email:fields.email.toLowerCase(),phone:fields.phone,whatsapp:fields.whatsapp,
    parent_name:fields.parent_name||"",parent_phone:fields.parent_phone||"",city:fields.city||"",state:fields.state||"",pincode:fields.pincode||"",
    current_qualification:fields.current_qualification,desired_level:fields.desired_level,preferred_course:fields.preferred_course,
    course_categories:categories,preferred_destination:fields.preferred_destination,preferred_intake:fields.preferred_intake,
    annual_budget:fields.annual_budget,loan_interest:fields.loan_interest||"",expected_loan_amount:fields.expected_loan_amount||null,
    consent:true,status:"new",source:"eduex_public_form",form_data:fields,user_agent:clean(req.headers["user-agent"],500)
  };
  const response=await fetch(`${url}/rest/v1/college_inspections`,{method:"POST",headers:{...headers,Prefer:"return=representation"},body:JSON.stringify(record)});
  const data=await response.json().catch(()=>null);
  if(!response.ok){console.error("College inspection insert",response.status,data);const missing=response.status===404||/PGRST20|college_inspections|schema cache/i.test(JSON.stringify(data));return res.status(502).json({error:missing?"College inspection table is missing. Run supabase/college_inspections.sql.":"Could not save the consultation request."})}
  const id=data?.[0]?.id||randomUUID();return res.status(201).json({reference:`EDU-${id.slice(0,8).toUpperCase()}`});
}

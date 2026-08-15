const TYPES = new Set(["company", "influencer", "other"]);
const SERVICES = new Set(['Creative & Communication','Search Engine Marketing (SEO, AEO & GEO)','Full-Funnel Digital Marketing','Website & Web App Development','Mobile Application Development','Ad Management','UGC Content Creation','Social Media Marketing','Influencer Marketing','Online Reputation Management','Content Marketing & Video Production','Branding & Design','Performance Marketing','Lead Generation','Marketing Automation & CRM','Analytics, Attribution & Reporting']);
const REQUIRED = {
  company:["full_name","email","phone","location","preferred_contact","company_name","job_title","industry","business_model","company_size","headquarters","markets","products_services","target_audience","company_goal","company_challenge"],
  influencer:["full_name","email","phone","location","preferred_contact","creator_name","username","niche","audience_size","audience_details","content_languages","content_formats","creator_goal","creator_challenge"],
  other:["full_name","email","phone","location","preferred_contact","occupation","work_category","work_description","location_markets","work_goal","work_challenge","extra_details"],
};
function clean(v,max=2000){return typeof v==="string"?v.trim().slice(0,max):""}
function isCompleteProfile(profile){
  if(!profile?.completed_at||!TYPES.has(profile.profile_type)||!profile.profile_data)return false;
  const data=profile.profile_data;
  if(!REQUIRED[profile.profile_type].every(field=>Boolean(data[field])))return false;
  if(!Array.isArray(data.services_needed)||!data.services_needed.length)return false;
  if(profile.profile_type==="influencer"&&(!Array.isArray(data.platforms)||!data.platforms.length))return false;
  return true;
}
function serverHeaders(key){const h={apikey:key,"Content-Type":"application/json"};if(!key.startsWith("sb_secret_"))h.Authorization=`Bearer ${key}`;return h}
async function authenticate(req,url,key){
  const auth=clean(req.headers.authorization,5000);if(!auth.startsWith("Bearer "))return null;
  const response=await fetch(`${url}/auth/v1/user`,{headers:{apikey:key,Authorization:auth}});
  if(!response.ok)return null;return response.json();
}
export default async function handler(req,res){
  res.setHeader("Cache-Control","no-store");
  if(!["GET","POST"].includes(req.method)){res.setHeader("Allow","GET, POST");return res.status(405).json({error:"Method not allowed."})}
  const url=clean(process.env.SUPABASE_URL,500).replace(/\/$/,"");
  const key=clean(process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY,5000);
  if(!url||!key)return res.status(503).json({error:"Profile storage is not configured."});
  try{
    const user=await authenticate(req,url,key);if(!user?.id)return res.status(401).json({error:"Please sign in again."});
    const headers=serverHeaders(key);
    if(req.method==="GET"){
      const response=await fetch(`${url}/rest/v1/user_work_profiles?user_id=eq.${encodeURIComponent(user.id)}&select=profile_type,profile_data,completed_at,updated_at&limit=1`,{headers});
      if(!response.ok){const text=await response.text();console.error("Profile GET failed",response.status,text);return res.status(502).json({error:"Could not load work profile."})}
      const rows=await response.json();const profile=rows[0]||null;return res.status(200).json({profile:isCompleteProfile(profile)?profile:null});
    }
    const type=clean(req.body?.profile_type,30).toLowerCase();if(!TYPES.has(type))return res.status(400).json({error:"Choose Company, Influencer or Other."});
    const raw=req.body?.profile_data&&typeof req.body.profile_data==="object"&&!Array.isArray(req.body.profile_data)?req.body.profile_data:{};
    const data={};
    for(const [name,value] of Object.entries(raw).slice(0,80)){
      if(!/^[a-z][a-z0-9_]{0,49}$/i.test(name))continue;
      if(Array.isArray(value))data[name]=value.map(v=>clean(v,150)).filter(Boolean).slice(0,30);
      else data[name]=clean(value,name.includes("description")||name.includes("details")||name.includes("goal")||name.includes("challenge")?2000:500);
    }
    data.email=clean(user.email,254).toLowerCase();
    for(const field of REQUIRED[type])if(!data[field])return res.status(400).json({error:`Please complete: ${field.replaceAll("_"," ")}.`});
    if(type==="influencer"&&(!Array.isArray(data.platforms)||!data.platforms.length))return res.status(400).json({error:"Select at least one platform."});
    data.services_needed=Array.isArray(data.services_needed)?[...new Set(data.services_needed.filter(s=>SERVICES.has(s)))]:[];
    if(!data.services_needed.length)return res.status(400).json({error:"Select at least one service."});
    if(clean(data.phone).replace(/\D/g,"").length<7)return res.status(400).json({error:"Enter a valid phone or WhatsApp number."});
    const record={user_id:user.id,profile_type:type,profile_data:data,completed_at:new Date().toISOString(),updated_at:new Date().toISOString()};
    const response=await fetch(`${url}/rest/v1/user_work_profiles?on_conflict=user_id`,{method:"POST",headers:{...headers,Prefer:"resolution=merge-duplicates,return=representation"},body:JSON.stringify(record)});
    const result=await response.json().catch(()=>null);
    if(!response.ok){console.error("Profile save failed",response.status,result);return res.status(502).json({error:"Could not save work profile. Run the user profile SQL migration."})}
    return res.status(200).json({profile:Array.isArray(result)?result[0]:record});
  }catch(error){console.error("User profile endpoint",error);return res.status(502).json({error:"Profile service is temporarily unavailable."})}
}

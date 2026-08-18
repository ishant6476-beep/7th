(() => {
  "use strict";
  const STATUS = ["new","reviewing","contacted","documents_pending","shortlisted","application_started","admitted","closed","not_qualified"];
  const label = value => String(value || "").replaceAll("_", " ").replace(/\b\w/g, c => c.toUpperCase());
  const el = (tag, cls, text) => { const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n; };
  function session(){try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i)||"";if(k.startsWith("sb-")&&k.endsWith("-auth-token")){const p=JSON.parse(localStorage.getItem(k));const s=p?.currentSession||p?.session||p;if(s?.access_token&&s?.user)return s}}}catch{}return null}
  let mounted=false,records=[];
  async function request(method="GET",body){const s=session();if(!s)throw new Error("Staff session not found. Sign in again.");const r=await fetch("/api/college-inspections",{method,headers:{"Content-Type":"application/json",Authorization:`Bearer ${s.access_token}`},body:body?JSON.stringify(body):undefined});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"College CRM request failed.");return d}
  function pair(name,value){const d=el("div","edu-detail-pair");d.append(el("span","",name),el("strong","",value||"Not provided"));return d}
  function render(panel,query="",status="all"){
    const list=panel.querySelector(".edu-crm-list");list.innerHTML="";
    const filtered=records.filter(r=>{const hay=`${r.student_name} ${r.email} ${r.phone} ${r.preferred_course} ${r.city} ${r.state}`.toLowerCase();return(!query||hay.includes(query.toLowerCase()))&&(status==="all"||r.status===status)});
    panel.querySelector(".edu-record-count").textContent=`${filtered.length} inspection${filtered.length===1?"":"s"}`;
    if(!filtered.length){const empty=el("div","edu-empty");empty.append(el("h3","","No college inspections found"),el("p","","New EduEx consultation submissions will appear here."));list.append(empty);return}
    filtered.forEach(record=>{
      const article=el("article","edu-crm-record");
      const summary=el("button","edu-record-summary");summary.type="button";
      const student=el("div");student.append(el("strong","",record.student_name),el("small","",`${record.email} · ${record.phone}`));
      const course=el("div");course.append(el("strong","",record.preferred_course),el("small","",`${record.desired_level} · ${record.preferred_destination}`));
      const location=el("div");location.append(el("strong","",record.current_qualification||"Academic profile"),el("small","",new Date(record.created_at).toLocaleString("en-IN")));
      summary.append(student,course,location,el("span",`edu-status ${record.status}`,label(record.status)),el("b","","⌄"));
      const detail=el("div","edu-record-detail");detail.hidden=true;
      const grid=el("div","edu-detail-grid");
      const f=record.form_data||{};
      [["WhatsApp",record.whatsapp],["Qualification",record.current_qualification],["Institution",f.institution_name],["Academic score",f.academic_score],["Course categories",(record.course_categories||[]).join(", ")],["Preferred course",record.preferred_course],["Destination",record.preferred_destination],["Preferred intake",record.preferred_intake],["Annual budget",record.annual_budget],["Study mode",f.study_mode],["College type",f.college_type],["Hostel",f.hostel_required]].forEach(([k,v])=>grid.append(pair(k,v)));
      const all=el("details","edu-json");all.append(el("summary","","View all submitted details"));const pre=el("pre","",JSON.stringify(f,null,2));all.append(pre);
      const edit=el("div","edu-record-edit");
      const statusLabel=el("label");statusLabel.append(el("span","","Status"));const select=el("select");STATUS.forEach(x=>{const o=el("option","",label(x));o.value=x;o.selected=x===record.status;select.append(o)});statusLabel.append(select);
      const assigned=el("label");assigned.append(el("span","","Assigned to"));const assignedInput=el("input");assignedInput.value=record.assigned_to||"";assigned.append(assignedInput);
      const follow=el("label");follow.append(el("span","","Follow-up date"));const followInput=el("input");followInput.type="date";followInput.value=record.follow_up_date||"";follow.append(followInput);
      const notes=el("label","wide");notes.append(el("span","","Staff notes"));const notesInput=el("textarea");notesInput.rows=3;notesInput.value=record.staff_notes||"";notes.append(notesInput);
      const save=el("button","edu-save","Save inspection");save.type="button";const message=el("small","edu-save-message");
      save.addEventListener("click",async()=>{save.disabled=true;save.textContent="Saving…";message.textContent="";try{const d=await request("PATCH",{id:record.id,status:select.value,assigned_to:assignedInput.value,follow_up_date:followInput.value,staff_notes:notesInput.value});if(d.record){records=records.map(x=>x.id===record.id?d.record:x);message.textContent="Saved";message.className="edu-save-message success"}}catch(e){message.textContent=e.message;message.className="edu-save-message error"}finally{save.disabled=false;save.textContent="Save inspection"}});
      edit.append(statusLabel,assigned,follow,notes,save,message);detail.append(grid,all,edit);article.append(summary,detail);summary.addEventListener("click",()=>{detail.hidden=!detail.hidden;article.classList.toggle("open",!detail.hidden)});list.append(article);
    });
  }
  async function mount(){
    if(mounted&&!document.querySelector(".edu-crm-panel"))mounted=false;
    if(location.pathname!=="/admin"||mounted)return;const shell=document.querySelector(".crm-shell"),tabs=shell?.querySelector(".crm-tabs");if(!shell||!tabs)return;
    mounted=true;const tab=el("button","edu-crm-tab","College Inspections");tab.type="button";const badge=el("span","","0");tab.append(badge);tabs.append(tab);
    const panel=el("section","edu-crm-panel");panel.hidden=true;
    const top=el("div","edu-crm-top");const title=el("div");title.append(el("small","","Prime Polo EduEx"),el("h2","","College Inspections"),el("p","edu-record-count","Loading records…"));const refresh=el("button","edu-refresh","Refresh");refresh.type="button";top.append(title,refresh);
    const toolbar=el("div","edu-crm-toolbar");const search=el("input");search.placeholder="Search student, course, phone or city";const filter=el("select");const all=el("option","","All statuses");all.value="all";filter.append(all);STATUS.forEach(x=>{const o=el("option","",label(x));o.value=x;filter.append(o)});toolbar.append(search,filter);
    const notice=el("div","edu-crm-notice");const list=el("div","edu-crm-list");panel.append(top,toolbar,notice,list);tabs.insertAdjacentElement("afterend",panel);
    const load=async()=>{notice.textContent="Loading college inspections…";notice.className="edu-crm-notice";try{const data=await request();records=data.records||[];badge.textContent=String(records.filter(x=>x.status==="new").length);notice.textContent="";render(panel,search.value,filter.value)}catch(e){notice.textContent=e.message;notice.className="edu-crm-notice error"}};
    tab.addEventListener("click",()=>{shell.classList.remove("site-editor-active");document.querySelector('.site-editor-panel')?.setAttribute('hidden','');shell.classList.add("edu-crm-active");tabs.querySelectorAll("button").forEach(b=>b.classList.toggle("active",b===tab));panel.hidden=false;load()});
    [...tabs.querySelectorAll("button")].filter(b=>b!==tab).forEach(b=>b.addEventListener("click",()=>{shell.classList.remove("edu-crm-active");panel.hidden=true;tab.classList.remove("active")}));
    search.addEventListener("input",()=>render(panel,search.value,filter.value));filter.addEventListener("change",()=>render(panel,search.value,filter.value));refresh.addEventListener("click",load);
  }
  setInterval(mount,600);mount();
})();

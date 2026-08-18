(() => {
  "use strict";
  const CALL="+917903946440", WA="https://wa.me/917992278315?text=Hello%20Prime%20Polo%2C%20I%20would%20like%20to%20discuss%20a%20project%20scope.";
  function upgrade(){
    const results=document.querySelector('.results');
    if(results){const h=results.querySelector('.section-heading h2'),p=results.querySelector('.section-heading p');if(h)h.textContent='Capability at a glance';if(p)p.textContent='A factual view of the service breadth, professional experience and delivery structure available to a Prime Polo engagement.'}
    const main=document.querySelector('main');if(!main)return;
    const solutions=document.querySelector('.solutions');
    if(solutions&&!document.querySelector('.ds-client-trust')){
      const trust=document.createElement('section');trust.className='section ds-client-trust';trust.innerHTML=`<div class="container-elite"><div class="section-heading"><span class="section-tag">Working Standards</span><h2>Clarity before activity.</h2><p>A client should know what is being delivered, who owns each decision and how progress will be reviewed before work begins.</p></div><div class="ds-trust-grid">${[
        ['01','Written scope','Objectives, deliverables, exclusions, responsibilities and success measures are documented before kickoff.'],
        ['02','Milestone plan','The engagement is divided into reviewable stages with dates, dependencies and approval points.'],
        ['03','Transparent access','Clients retain appropriate access to platforms, dashboards, approved assets and working outputs.'],
        ['04','Secure handling','Forms and account data use Supabase-backed storage, role controls and private server routes where required.'],
        ['05','Reporting rhythm','The proposal defines what will be reported, how often it will be reviewed and which decisions the data supports.'],
        ['06','Named accountability','Every engagement has a clear primary contact, escalation path and record of agreed changes.']
      ].map(([n,t,c])=>`<article class="ds-trust-card"><small>${n}</small><h3>${t}</h3><p>${c}</p></article>`).join('')}</div></div>`;main.insertBefore(trust,solutions)}
    const contact=document.querySelector('.contact');
    if(contact&&!document.querySelector('.ds-engagement-readiness')){
      const section=document.createElement('section');section.className='section ds-engagement-readiness';section.innerHTML=`<div class="container-elite"><div class="ds-readiness-shell"><div><span class="section-tag">Before the Advance</span><h2>Know exactly what happens next.</h2><p>Prime Polo can provide a written engagement summary before payment so commercial and delivery expectations are aligned.</p><div class="ds-readiness-actions"><a href="#contact">Request a written scope →</a><a href="tel:${CALL}">Call the founder</a><a href="${WA}" target="_blank" rel="noopener">Discuss on WhatsApp</a></div><div class="ds-proof-note">Portfolio concepts are labelled as demonstration work. Verified client references, credentials or legal documents should be shared only with permission and on request.</div></div><div class="ds-readiness-list">${[
        ['01','Objective and current constraint','What needs to move, what is currently blocking it and what evidence is available.'],
        ['02','Deliverables and exclusions','The exact output, revision boundaries and work that is outside the agreed scope.'],
        ['03','Timeline and dependencies','Milestones, client inputs, approval windows and expected start date.'],
        ['04','Commercial structure','Professional fee, taxes where applicable, media or third-party costs and payment schedule.'],
        ['05','Access and ownership','Required accounts, security expectations, ownership and post-project handover.'],
        ['06','Review and communication','Primary contacts, meeting rhythm, reporting format and escalation route.']
      ].map(([n,t,c])=>`<div><span>${n}</span><strong>${t}</strong><p>${c}</p></div>`).join('')}</div></div></div>`;main.insertBefore(section,contact)}
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upgrade,{once:true});else upgrade();let n=0;const timer=setInterval(()=>{upgrade();if(++n>20||document.querySelector('.ds-engagement-readiness'))clearInterval(timer)},250);
})();

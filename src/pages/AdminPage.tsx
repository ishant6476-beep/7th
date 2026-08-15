import type { Session } from "@supabase/supabase-js";
import { BarChart3, Check, ChevronDown, CircleUserRound, Download, Inbox, LogOut, Mail, MessageSquareText, RefreshCw, Search, ShieldCheck, UsersRound } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageIntro, PrimaryButton } from "../components/ui";
import { isSupabaseConfigured, type ChatRecord, type LeadRecord, type LeadStatus, supabase, supabaseConfigStatus } from "../lib/supabase";

const statuses: LeadStatus[] = ["new", "contacted", "qualified", "proposal", "won", "lost"];

function StaffLogin({ onLogin }: { onLogin: (session: Session) => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setError("");
    const form = new FormData(event.currentTarget);
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email: String(form.get("email") || "").trim(), password: String(form.get("password") || "") });
    if (authError) setError(authError.message); else if (data.session) onLogin(data.session);
    setLoading(false);
  };
  if (!isSupabaseConfigured) return <div className="admin-login glass-elite"><span><ShieldCheck /></span><h2>Supabase connection required</h2><p>The staff CRM activates once the public project URL and anon key are set at build time.</p><code className="config-code">{supabaseConfigStatus}</code></div>;
  return <form className="admin-login glass-elite" onSubmit={submit}><span><ShieldCheck /></span><small>Restricted Workspace</small><h2>Staff sign in</h2><p>Access is granted only to authenticated users listed in the protected staff_roles table.</p><label><span>Email</span><div><Mail /><input name="email" type="email" required placeholder="staff@primepolomarketing.in" /></div></label><label><span>Password</span><div><CircleUserRound /><input name="password" type="password" required placeholder="Your secure password" /></div></label>{error && <div className="auth-notice error">{error}</div>}<PrimaryButton type="submit" disabled={loading}>{loading ? "Verifying Staff Role..." : "Enter Secure CRM"}</PrimaryButton></form>;
}

function LeadRow({ lead, onSaved }: { lead: LeadRecord; onSaved: (lead: LeadRecord) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const [followUp, setFollowUp] = useState(lead.follow_up_date?.slice(0, 10) || "");
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    const { data } = await supabase.from("leads").update({ status, notes: notes.trim() || null, follow_up_date: followUp || null }).eq("id", lead.id).select().single();
    if (data) onSaved(data as LeadRecord);
    setSaving(false);
  };
  return <article className={`lead-row ${expanded ? "expanded" : ""}`}><button className="lead-summary" onClick={() => setExpanded((value) => !value)}><span className={`status-dot ${lead.status}`} /><div><strong>{lead.name}</strong><small>{lead.company || "Independent"}</small></div><span>{lead.service || "General inquiry"}</span><span>{new Date(lead.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span><b className={`status-badge ${lead.status}`}>{lead.status}</b><ChevronDown /></button>{expanded && <div className="lead-details"><div className="lead-contact"><a href={`mailto:${lead.email}`}><Mail />{lead.email}</a><span>{lead.phone || "No phone"}</span><span>{lead.budget || "Budget not supplied"}</span></div><div className="lead-message"><small>Project brief</small><p>{lead.message}</p></div><div className="lead-edit-grid"><label><span>Status</span><select value={status} onChange={(event) => setStatus(event.target.value as LeadStatus)}>{statuses.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label><span>Follow-up date</span><input type="date" value={followUp} onChange={(event) => setFollowUp(event.target.value)} /></label><label className="lead-notes"><span>Staff notes</span><textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add internal context..." /></label></div><button className="save-lead" onClick={() => void save()} disabled={saving}>{saving ? <RefreshCw /> : <Check />}{saving ? "Saving..." : "Save Lead"}</button></div>}</article>;
}

function Analytics({ leads }: { leads: LeadRecord[] }) {
  const values = statuses.map((status) => ({ status, count: leads.filter((lead) => lead.status === status).length }));
  const max = Math.max(1, ...values.map((item) => item.count));
  const won = values.find((item) => item.status === "won")?.count || 0;
  const conversion = leads.length ? Math.round((won / leads.length) * 100) : 0;
  return <div className="admin-analytics"><div className="admin-kpis"><div><Inbox /><span>Total leads<strong>{leads.length}</strong></span></div><div><UsersRound /><span>Qualified<strong>{values.find((item) => item.status === "qualified")?.count || 0}</strong></span></div><div><Check /><span>Won<strong>{won}</strong></span></div><div><BarChart3 /><span>Win rate<strong>{conversion}%</strong></span></div></div><section className="analytics-chart glass-elite"><div><small>Pipeline Distribution</small><h3>Leads by status</h3></div><div className="status-bars">{values.map((item) => <div key={item.status}><span>{item.status}<b>{item.count}</b></span><i><em style={{ width: `${(item.count / max) * 100}%` }} /></i></div>)}</div></section></div>;
}

function StaffCRM({ session, staffRole, onLogout }: { session: Session; staffRole: string; onLogout: () => void }) {
  const [tab, setTab] = useState<"leads" | "chat" | "analytics">("leads");
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [chats, setChats] = useState<ChatRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const load = async () => {
    setLoading(true);
    const [leadResponse, chatResponse] = await Promise.all([
      supabase.from("leads").select("*").order("created_at", { ascending: false }),
      supabase.from("chat_logs").select("*").order("created_at", { ascending: false }),
    ]);
    setLeads((leadResponse.data || []) as LeadRecord[]); setChats((chatResponse.data || []) as ChatRecord[]); setLoading(false);
  };
  useEffect(() => { void load(); }, []);
  const filtered = useMemo(() => leads.filter((lead) => `${lead.name} ${lead.email} ${lead.company || ""} ${lead.service || ""}`.toLowerCase().includes(query.toLowerCase())), [leads, query]);
  const updateLead = (updated: LeadRecord) => setLeads((items) => items.map((item) => item.id === updated.id ? updated : item));
  const downloadCsv = () => {
    const rows = [["Name", "Email", "Phone", "Company", "Service", "Budget", "Status", "Created"], ...filtered.map((lead) => [lead.name, lead.email, lead.phone || "", lead.company || "", lead.service || "", lead.budget || "", lead.status, lead.created_at])];
    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const link = document.createElement("a"); link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); link.download = "prime-polo-leads.csv"; link.click(); URL.revokeObjectURL(link.href);
  };
  return <div className="crm-shell"><div className="crm-top"><div><span className="live-dot" />Secure staff session<h2>Growth Operations</h2><p>{session.user.email} <b>{staffRole}</b></p></div><div><button onClick={() => void load()}><RefreshCw />Refresh</button><button onClick={onLogout}><LogOut />Logout</button></div></div><nav className="crm-tabs">{([ ["leads", "Leads", Inbox], ["chat", "Chat Logs", MessageSquareText], ["analytics", "Analytics", BarChart3] ] as const).map(([value, label, Icon]) => <button key={value} className={tab === value ? "active" : ""} onClick={() => setTab(value)}><Icon />{label}{value !== "analytics" && <span>{value === "leads" ? leads.length : chats.length}</span>}</button>)}</nav>{loading ? <div className="account-loading"><RefreshCw />Syncing protected records...</div> : tab === "leads" ? <div className="leads-view"><div className="crm-toolbar"><label><Search /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search leads, companies or services" /></label><button onClick={downloadCsv}><Download />Export CSV</button></div><div className="lead-table-head"><span>Contact</span><span>Interest</span><span>Created</span><span>Status</span><i /></div><div className="lead-list">{filtered.length ? filtered.map((lead) => <LeadRow key={lead.id} lead={lead} onSaved={updateLead} />) : <div className="empty-admin"><Inbox /><h3>No leads found</h3><p>New contact submissions will arrive here in real time after refresh.</p></div>}</div></div> : tab === "chat" ? <div className="chat-log-list">{chats.length ? chats.map((chat) => <article key={chat.id} className="glass-elite"><div><MessageSquareText /><span>Conversation log<small>{new Date(chat.created_at).toLocaleString("en-IN")}</small></span></div><dl><dt>Visitor</dt><dd>{chat.user_message}</dd><dt>Prime Intelligence</dt><dd>{chat.bot_reply}</dd></dl></article>) : <div className="empty-admin"><MessageSquareText /><h3>No chat logs yet</h3><p>AI assistant exchanges will appear here.</p></div>}</div> : <Analytics leads={leads} />}</div>;
}

export function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [staffRole, setStaffRole] = useState("");
  const [checking, setChecking] = useState(true);
  const [rejected, setRejected] = useState(false);
  const verify = async (candidate: Session) => {
    setChecking(true); setRejected(false);
    const { data, error } = await supabase.from("staff_roles").select("role").eq("id", candidate.user.id).maybeSingle();
    if (error || !data) { setRejected(true); setSession(null); await supabase.auth.signOut(); }
    else { setSession(candidate); setStaffRole(data.role); }
    setChecking(false);
  };
  useEffect(() => { void supabase.auth.getSession().then(({ data }) => data.session ? verify(data.session) : setChecking(false)); }, []);
  const logout = async () => { await supabase.auth.signOut(); setSession(null); setStaffRole(""); };
  return <main className="admin-page"><PageIntro tag="Staff Operations" title="Prime Polo CRM" copy="Protected lead intelligence, conversation history and pipeline visibility for authorized staff." /><section className="section admin-content"><div className="container-elite">{checking ? <div className="account-loading"><RefreshCw />Verifying protected staff role...</div> : session ? <StaffCRM session={session} staffRole={staffRole} onLogout={() => void logout()} /> : <>{rejected && <div className="staff-rejected"><ShieldCheck /><span><strong>Staff authorization required</strong><small>This account is valid but is not listed in the protected staff_roles table.</small></span></div>}<StaffLogin onLogin={(next) => void verify(next)} /></>}</div></section></main>;
}
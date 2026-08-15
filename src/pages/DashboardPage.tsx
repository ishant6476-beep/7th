import type { Session } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import { Apple, ArrowLeft, Building2, Check, Eye, EyeOff, Fingerprint, Globe2, LockKeyhole, LogOut, Mail, PackageOpen, RefreshCw, ShieldCheck, Sparkles, Trash2, UserRound, UsersRound } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { PageIntro, PrimaryButton } from "../components/ui";
import { takeAuthIntent } from "../lib/router";
import { isSupabaseConfigured, type ProfileRecord, supabase, supabaseConfigStatus } from "../lib/supabase";

type AuthMode = "login" | "signup" | "forgot" | "pending" | "reset";
type UserRole = ProfileRecord["role"];

const roles: Array<{ value: UserRole; label: string; icon: typeof Building2 }> = [
  { value: "company", label: "Company", icon: Building2 },
  { value: "influencer", label: "Influencer", icon: UsersRound },
  { value: "freelancer", label: "Freelancer", icon: Sparkles },
  { value: "other", label: "Other", icon: Globe2 },
];

function AuthPanel({ onAuthenticated }: { onAuthenticated: (session: Session) => void }) {
  const [mode, setMode] = useState<AuthMode>(() => {
    try {
      return new URLSearchParams(window.location.search).has("reset") ? "reset" : takeAuthIntent();
    } catch {
      return takeAuthIntent();
    }
  });
  const [role, setRole] = useState<UserRole>("company");
  const [pendingEmail, setPendingEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<{ type: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") setMode("reset");
      if (session && event !== "PASSWORD_RECOVERY" && mode !== "reset") onAuthenticated(session);
    });
    return () => data.subscription.unsubscribe();
  }, [mode, onAuthenticated]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setLoading(true); setNotice(null);
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    try {
      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) onAuthenticated(data.session);
      } else if (mode === "signup") {
        const name = String(form.get("name") || "").trim();
        if (password.length < 8) throw new Error("Use at least 8 characters for your password.");
        const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/dashboard`, data: { name, role } } });
        if (error) throw error;
        if (data.session) onAuthenticated(data.session);
        else { setPendingEmail(email); setMode("pending"); }
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/dashboard?reset=1` });
        if (error) throw error;
        setNotice({ type: "success", text: "Recovery link sent. Check your inbox and spam folder." });
      } else if (mode === "reset") {
        if (password.length < 8) throw new Error("Use at least 8 characters for your new password.");
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setNotice({ type: "success", text: "Password updated. Your account is ready." });
        window.history.replaceState({}, "", "/dashboard");
        const { data } = await supabase.auth.getSession();
        if (data.session) window.setTimeout(() => onAuthenticated(data.session!), 700);
      }
    } catch (error) {
      const message = error && typeof error === "object" && "message" in error ? String((error as { message?: string }).message) : error instanceof Error ? error.message : "Authentication failed. Please try again.";
      setNotice({ type: "error", text: message });
    } finally { setLoading(false); }
  };

  const oauth = async () => {
    setLoading(true); setNotice(null);
    const { error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${window.location.origin}/dashboard` } });
    if (error) { setNotice({ type: "error", text: error.message }); setLoading(false); }
  };

  const resend = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: pendingEmail, options: { emailRedirectTo: `${window.location.origin}/dashboard` } });
    setNotice(error ? { type: "error", text: error.message } : { type: "success", text: "A fresh confirmation link is on its way." });
    setLoading(false);
  };

  if (!isSupabaseConfigured) return <div className="auth-shell glass-elite auth-config"><ShieldCheck /><h2>Connect your secure account system</h2><p>Accounts activate as soon as the Supabase credentials are present at build time.</p><code>{supabaseConfigStatus}</code><p className="config-hint">Add the value to <b>.env.local</b> locally, or to Vercel <b>Settings → Environment Variables</b>, then redeploy. Vite inlines these at build time, so a redeploy is required.</p></div>;

  if (mode === "pending") return <div className="auth-shell glass-elite pending-panel"><span><Mail /></span><small>One more step</small><h2>Confirm your email</h2><p>We sent a secure confirmation link to <strong>{pendingEmail}</strong>. Open it to activate your Prime Polo account.</p>{notice && <div className={`auth-notice ${notice.type}`}>{notice.text}</div>}<PrimaryButton onClick={() => void resend()} disabled={loading}>{loading ? "Sending..." : "Resend Confirmation"}</PrimaryButton><button className="text-button" onClick={() => setMode("login")}>Back to login</button></div>;

  return (
    <div className="auth-shell glass-elite">
      <div className="auth-heading"><span><Fingerprint /></span><small>Private Client Portal</small><h2>{mode === "signup" ? "Create your account" : mode === "forgot" ? "Recover access" : mode === "reset" ? "Set a new password" : "Welcome back"}</h2><p>{mode === "signup" ? "A direct line to your Prime Polo engagement." : mode === "forgot" ? "We will email a secure recovery link." : mode === "reset" ? "Choose a strong password for your account." : "Sign in to your growth workspace."}</p></div>
      {(mode === "login" || mode === "signup") && <div className="oauth-grid"><button onClick={() => void oauth()} disabled={loading}><svg viewBox="0 0 24 24"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.4 13.9A6 6 0 0 1 6.1 12c0-.7.1-1.3.3-1.9V7.5H3.1A10 10 0 0 0 2 12c0 1.6.4 3.1 1.1 4.5l3.3-2.6Z"/><path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3.1 7.5l3.3 2.6C7.2 7.8 9.4 6 12 6Z"/></svg>Continue with Google</button><button disabled title="Coming soon"><Apple />Continue with Apple <small>Coming soon</small></button></div>}
      {(mode === "login" || mode === "signup") && <div className="auth-divider"><span />or use email<span /></div>}
      <form className="auth-form" onSubmit={submit}>
        {mode === "signup" && <label><span>Your name</span><div><UserRound /><input name="name" placeholder="Full name" required maxLength={120} /></div></label>}
        {mode !== "reset" && <label><span>Email address</span><div><Mail /><input name="email" type="email" placeholder="you@company.com" required autoComplete="email" /></div></label>}
        {mode !== "forgot" && <label><span>{mode === "reset" ? "New password" : "Password"}</span><div><LockKeyhole /><input name="password" type={showPassword ? "text" : "password"} placeholder="Minimum 8 characters" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"} /><button type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff /> : <Eye />}</button></div></label>}
        {mode === "signup" && <fieldset><legend>I am joining as</legend><div className="role-grid">{roles.map(({ value, label, icon: Icon }) => <button type="button" key={value} className={role === value ? "active" : ""} onClick={() => setRole(value)}><Icon />{label}{role === value && <Check />}</button>)}</div></fieldset>}
        {mode === "login" && <button type="button" className="forgot-link" onClick={() => setMode("forgot")}>Forgot password?</button>}
        {notice && <div className={`auth-notice ${notice.type}`}>{notice.text}</div>}
        <PrimaryButton type="submit" disabled={loading}>{loading ? "Securing..." : mode === "signup" ? "Create Account" : mode === "forgot" ? "Send Recovery Link" : mode === "reset" ? "Update Password" : "Sign In Securely"}</PrimaryButton>
      </form>
      <div className="auth-switch">{mode === "login" ? <>New to Prime Polo? <button onClick={() => setMode("signup")}>Create an account</button></> : mode === "signup" ? <>Already have an account? <button onClick={() => setMode("login")}>Sign in</button></> : <button onClick={() => setMode("login")}><ArrowLeft />Back to login</button>}</div>
    </div>
  );
}

function AccountPanel({ session, onLogout }: { session: Session; onLogout: () => void }) {
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
      if (data) setProfile(data as ProfileRecord);
      else {
        const fallback: ProfileRecord = { id: session.user.id, name: session.user.user_metadata.name || session.user.email?.split("@")[0] || "Client", email: session.user.email || null, phone: null, company: null, avatar_url: session.user.user_metadata.avatar_url || null, role: session.user.user_metadata.role || "other", created_at: new Date().toISOString() };
        await supabase.from("profiles").upsert(fallback);
        setProfile(fallback);
      }
      setLoading(false);
    };
    void load();
  }, [session]);

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!profile) return; setLoading(true);
    const form = new FormData(event.currentTarget);
    const updates = { name: String(form.get("name") || "").trim(), phone: String(form.get("phone") || "").trim() || null, company: String(form.get("company") || "").trim() || null };
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", session.user.id).select().single();
    if (error) setNotice(error.message); else { setProfile(data as ProfileRecord); setNotice("Profile updated securely."); setEditing(false); }
    setLoading(false);
  };

  const deleteAccount = async () => {
    if (!window.confirm("Permanently delete your Prime Polo account and profile? This cannot be undone.")) return;
    const { error } = await supabase.rpc("delete_own_account");
    if (error) setNotice(`Deletion could not be completed: ${error.message}`); else { await supabase.auth.signOut(); onLogout(); }
  };

  if (loading && !profile) return <div className="account-loading"><RefreshCw />Loading your workspace...</div>;
  if (!profile) return null;
  const provider = session.user.app_metadata.provider === "google" ? "Google OAuth" : "Email & Password";
  const initials = profile.name?.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "PP";
  return (
    <div className="account-panel">
      <section className="account-hero glass-gold"><div className="account-avatar">{profile.avatar_url ? <img src={profile.avatar_url} alt="Account avatar" /> : initials}<i /></div><div><span>Prime Polo Client</span><h2>{profile.name}</h2><p>{profile.email}</p><div><b>{profile.role}</b><b><ShieldCheck />{provider}</b></div></div><button onClick={onLogout}><LogOut />Logout</button></section>
      <div className="account-grid">
        <section className="account-section glass-elite"><div className="account-section-heading"><div><small>Profile / 01</small><h3>Account details</h3></div><button onClick={() => setEditing((value) => !value)}>{editing ? "Cancel" : "Edit profile"}</button></div><AnimatePresence mode="wait">{editing ? <motion.form key="form" onSubmit={save} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="profile-form"><label><span>Name</span><input name="name" defaultValue={profile.name || ""} required /></label><label><span>Phone</span><input name="phone" defaultValue={profile.phone || ""} placeholder="Add phone number" /></label><label><span>Company</span><input name="company" defaultValue={profile.company || ""} placeholder="Add company" /></label><PrimaryButton type="submit" disabled={loading}>Save Changes</PrimaryButton></motion.form> : <motion.dl key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><div><dt>Name</dt><dd>{profile.name || "Not added"}</dd></div><div><dt>Email</dt><dd>{profile.email}</dd></div><div><dt>Phone</dt><dd>{profile.phone || "Not added"}</dd></div><div><dt>Company</dt><dd>{profile.company || "Not added"}</dd></div><div><dt>Account type</dt><dd className="capitalize">{profile.role}</dd></div></motion.dl>}</AnimatePresence>{notice && <p className="profile-notice">{notice}</p>}</section>
        <section className="account-section glass-elite purchases"><div className="account-section-heading"><div><small>Purchases / 02</small><h3>Services & plans</h3></div></div><div><PackageOpen /><h4>No purchases yet</h4><p>Your active retainers, projects and service documents will appear here.</p><a href="/#contact">Explore a growth plan</a></div></section>
      </div>
      <section className="danger-zone"><div><Trash2 /><span><strong>Delete account</strong><small>Permanently remove your profile and authentication data.</small></span></div><button onClick={() => void deleteAccount()}>Delete Account</button></section>
    </div>
  );
}

export function DashboardPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [recoveryMode, setRecoveryMode] = useState(() => {
    try { return new URLSearchParams(window.location.search).has("reset"); } catch { return false; }
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setRecoveryMode(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  const logout = async () => { await supabase.auth.signOut(); setSession(null); };
  const authenticated = useCallback((next: Session) => { setSession(next); setRecoveryMode(false); }, []);
  return (
    <main className="dashboard-page">
      <PageIntro tag="Client Portal" title={session ? "Your Growth Workspace" : "Account Access"} copy={session ? "Profile, services and the direct line to your Prime Polo team." : "Secure, private and designed for long-term growth partnerships."} />
      <section className="section dashboard-content"><div className="container-elite">{loading ? <div className="account-loading"><RefreshCw />Checking secure session...</div> : recoveryMode ? <AuthPanel onAuthenticated={authenticated} /> : session ? <AccountPanel session={session} onLogout={() => void logout()} /> : <AuthPanel onAuthenticated={authenticated} />}</div></section>
    </main>
  );
}
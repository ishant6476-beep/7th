import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

/** Surfaced in the UI so a missing key is obvious instead of failing silently. */
export const supabaseConfigStatus = !supabaseUrl
  ? "Missing VITE_SUPABASE_URL"
  : !supabaseAnonKey
    ? "Missing VITE_SUPABASE_ANON_KEY"
    : "ready";

export const supabase = createClient(
  supabaseUrl || "https://example.supabase.co",
  supabaseAnonKey || "public-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
  },
);

export type LeadStatus = "new" | "contacted" | "qualified" | "proposal" | "won" | "lost";

export interface LeadRecord {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  message: string;
  budget: string | null;
  service: string | null;
  status: LeadStatus;
  assigned_staff: string | null;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
}

export interface ChatRecord {
  id: string;
  user_message: string;
  bot_reply: string;
  created_at: string;
}

export interface ProfileRecord {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  avatar_url: string | null;
  role: "company" | "influencer" | "freelancer" | "other";
  created_at: string;
}
import { randomUUID } from "node:crypto";

const PROFILE_TYPES = new Set(["influencer", "company", "agency"]);
const SERVICES = new Set([
  "Growth Strategy & Consulting",
  "Influencer Marketing",
  "Social Media Marketing",
  "Performance Marketing (Google/Meta/LinkedIn)",
  "Search Engine Optimization (SEO)",
  "Website Design & Development",
  "Landing Pages & Conversion Optimization",
  "Content Strategy & Copywriting",
  "Video Production & Creative",
  "Brand Strategy & Visual Identity",
  "Lead Generation & Sales Funnels",
  "Marketing Automation",
  "CRM Setup & Integration",
  "AI Workflows & Chatbots",
  "Email Marketing & Lead Nurturing",
  "Analytics, Attribution & Reporting",
]);
const REQUIRED_BY_PROFILE = {
  influencer: ["creator_name", "primary_handle", "profile_links", "niche", "primary_platform", "audience_size", "audience_profile", "audience_locations", "content_languages", "content_formats", "creator_goal", "creator_challenge"],
  company: ["company_name", "job_title", "industry", "business_model", "company_size", "headquarters", "markets_served", "target_audience", "offer", "marketing_team", "current_channels", "company_goal", "company_challenge"],
  agency: ["agency_name", "job_title", "agency_type", "team_size", "headquarters", "markets_served", "agency_services", "client_profile", "partnership_type", "delivery_capacity", "agency_goal", "agency_challenge"],
};

const attempts = new Map();
function rateLimit(ip) {
  const now = Date.now();
  const recent = (attempts.get(ip) || []).filter((time) => now - time < 60 * 60 * 1000);
  if (recent.length >= 8) return false;
  recent.push(now);
  attempts.set(ip, recent);
  return true;
}
function clean(value, max = 2000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown").split(",")[0].trim();
  if (!rateLimit(ip)) return res.status(429).json({ error: "Too many submissions. Please try again later." });

  const body = req.body && typeof req.body === "object" ? req.body : {};
  if (clean(body.website_confirm, 200)) return res.status(200).json({ reference: `PP-${randomUUID().slice(0, 8).toUpperCase()}` });

  const profileType = clean(body.profile_type, 30).toLowerCase();
  if (!PROFILE_TYPES.has(profileType)) return res.status(400).json({ error: "Choose a valid profile type." });
  if (body.consent !== true) return res.status(400).json({ error: "Consent is required before saving." });

  const rawDetails = body.details && typeof body.details === "object" && !Array.isArray(body.details) ? body.details : {};
  const details = {};
  for (const [key, value] of Object.entries(rawDetails).slice(0, 80)) {
    if (/^[a-z][a-z0-9_]{0,49}$/i.test(key)) details[key] = clean(value, 2000);
  }

  const fullName = clean(details.full_name, 200);
  const email = clean(details.email, 254).toLowerCase();
  const phone = clean(details.phone, 80);
  if (fullName.length < 2) return res.status(400).json({ error: "Please enter your full name." });
  if (!validEmail(email)) return res.status(400).json({ error: "Please enter a valid business email." });
  if (phone.replace(/\D/g, "").length < 7) return res.status(400).json({ error: "Please enter a valid phone or WhatsApp number with country code." });

  for (const field of REQUIRED_BY_PROFILE[profileType]) {
    if (!clean(details[field])) return res.status(400).json({ error: `Please complete the required field: ${field.replaceAll("_", " ")}.` });
  }
  for (const field of ["preferred_contact", "objectives", "success_metrics", "monthly_budget", "timeline"]) {
    if (!clean(details[field])) return res.status(400).json({ error: `Please complete the required field: ${field.replaceAll("_", " ")}.` });
  }

  const services = Array.isArray(body.services)
    ? [...new Set(body.services.map((item) => clean(item, 120)).filter((item) => SERVICES.has(item)))].slice(0, SERVICES.size)
    : [];
  if (!services.length) return res.status(400).json({ error: "Select at least one valid service." });

  const supabaseUrl = clean(process.env.SUPABASE_URL, 500).replace(/\/$/, "");
  // Prefer Supabase's current sb_secret_ key. Legacy service_role JWTs remain supported.
  const serviceKey = clean(process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY, 5000);
  if (!supabaseUrl || !serviceKey) {
    console.error("Intake storage is not configured: SUPABASE_URL or a server secret key is missing");
    return res.status(503).json({ error: "Profile storage is not configured. Add the Supabase server variables in Vercel, then redeploy." });
  }

  const referenceId = randomUUID();
  const company = clean(details.company_name || details.agency_name || details.creator_name, 300);
  const challenge = clean(details.company_challenge || details.agency_challenge || details.creator_challenge, 2000);
  const summary = [
    `Profile: ${profileType}`,
    `Objectives: ${clean(details.objectives, 2000)}`,
    challenge ? `Primary challenge: ${challenge}` : "",
    `Success metrics: ${clean(details.success_metrics, 2000)}`,
    clean(details.additional_notes) ? `Additional notes: ${clean(details.additional_notes, 2000)}` : "",
  ].filter(Boolean).join("\n\n");

  // Store chatbot profiles in the existing public.leads table so website
  // contact leads and detailed intake profiles are visible in one place.
  const record = {
    name: fullName,
    email,
    phone,
    company,
    service: services.join(", "),
    budget: clean(details.monthly_budget, 100),
    message: summary.slice(0, 6000),
    status: "new",
    profile_type: profileType,
    preferred_contact: clean(details.preferred_contact, 40),
    services,
    intake_details: details,
    consent: true,
    source: "chatbot_intake",
    user_agent: clean(req.headers["user-agent"], 500),
  };

  try {
    const headers = {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Prefer: "return=minimal",
    };
    // New sb_secret_ keys are opaque, not JWTs, and must NOT be sent as
    // Authorization: Bearer. Legacy service_role JWTs require that header.
    if (!serviceKey.startsWith("sb_secret_")) headers.Authorization = `Bearer ${serviceKey}`;

    const response = await fetch(`${supabaseUrl}/rest/v1/leads`, {
      method: "POST",
      headers,
      body: JSON.stringify(record),
    });
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Supabase intake insert failed", response.status, errorText.slice(0, 1000));
      const tableMissing = response.status === 404 || /leads|PGRST204|PGRST205|schema cache/i.test(errorText);
      const keyRejected = response.status === 401 || response.status === 403 || /invalid.*(jwt|key)|unauthorized/i.test(errorText);
      if (tableMissing) return res.status(503).json({ error: "The leads table needs the intake columns. Run supabase/leads_intake_upgrade.sql in Supabase SQL Editor." });
      if (keyRejected) return res.status(503).json({ error: "Supabase rejected the server key. Add SUPABASE_SECRET_KEY in Vercel using the sb_secret_ key, then redeploy." });
      return res.status(502).json({ error: "The database rejected this submission. Check the Vercel Function log for api/intake." });
    }
    return res.status(201).json({ reference: `PP-${referenceId.slice(0, 8).toUpperCase()}` });
  } catch (error) {
    console.error("Intake endpoint failure", error?.message || error);
    return res.status(502).json({ error: "We could not save your profile right now. Please try again or email info@primepolomarketing.in." });
  }
}

# Prime Polo — Performance Agency Redesign

This is a deployable recovery and full visual redesign of the Prime Polo website. The unavailable original source is preserved as a self-contained snapshot in `src/site.html`. The interface now uses an original black, cream and yellow performance-agency design inspired by contemporary Indian agency websites, while preserving Prime Polo branding, both themes, the theme toggle, authentication, dashboard, chatbot and Supabase workflows.

## Version 9 visual system

- Bold editorial typography, yellow calls to action, black performance panels and structured service cards
- Three original generated 3D visuals for the hero, integrated services and strategy sections
- Responsive desktop and mobile layouts
- Real Google Maps embed with an external **Open in Google Maps** action
- White presentation tiles automatically applied to displayed company/partner/client logos
- Dark and light themes remain available through the existing theme button
- Founder corrected to **Saurya Kumar**
- Professional experience updated to **5+ years**
- Business location updated to **Vikas Nagar, Bihta, Bihar 801103**
- Primary contact email updated to **primepolomarketing@gmail.com**
- Business formation year updated to **2026**
- Main navigation updated to **Influencer, About Us, News & Awards, Services, Clients, Industry, International**
- Service catalog expanded to Creative & Communication; Search Engine Marketing with SEO/AEO/GEO; full-funnel Digital Marketing; Website, Web App and Mobile App Development; Ad Management; UGC Content Creation; Social Media and Influencer Marketing; Online Reputation Management; Content and Video Production; Branding and Design; Performance Marketing; Lead Generation; Marketing Automation/CRM; and Analytics/Attribution

## Data flow

EmailJS has been removed completely. No EmailJS endpoint, service ID, template ID, public key, package, or legal-policy reference remains in the project.

- The main website contact form inserts directly into `public.leads` through the configured Supabase browser client.
- The Influencer, Company, and Agency questionnaire posts to `/api/intake`, which validates the submission and inserts it into the same `public.leads` table through the server-only Supabase secret key.
- No submission email is sent by this project.

## Chatbot design

Provider order:

1. **GroqCloud** using Llama 3.3 70B (recommended free developer API)
2. **Gemini** when its key is configured as a secondary provider
3. Detailed built-in Prime Polo knowledge base if both providers are unavailable

Normal AI answers can use up to 500 completion tokens. The server asks for useful 70–150 word answers and automatically supplements an unusually short substantive answer with knowledge-base information.

## Configure the recommended free Groq API

1. Create an account and API key at https://console.groq.com/keys.
2. In Vercel, open **Project → Settings → Environment Variables**.
3. Add these variables to **Production, Preview, and Development**:

```env
GROQ_API_KEY=gsk_your_real_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

4. Save the variables.
5. Open **Deployments**, select the latest deployment, and click **Redeploy**.

Environment variables do not change a deployment that is already running. A redeploy is required.

Do not name the variable `VITE_GROQ_API_KEY`. `VITE_` variables are exposed to visitors. `GROQ_API_KEY` must remain server-side.

Groq controls free-tier availability and rate limits. The site automatically falls back to Gemini or its built-in knowledge base if Groq is temporarily unavailable.

## Optional Gemini fallback

```env
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-3.5-flash
```

## Configure profile storage

The **Get a plan** tab collects structured profiles for three visitor types:

- Influencer
- Company
- Agency

It requires both email and phone/WhatsApp, records occupation/business details, allows selection from the complete service catalog, and saves everything to the existing `public.leads` table.

1. Open **Supabase → SQL Editor**.
2. Run `supabase/leads_intake_upgrade.sql` once. It adds the profile and service-detail columns to `public.leads` without deleting existing leads.
3. In **Vercel → Settings → Environment Variables**, add:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_server_key
```

Use the current **Secret key** from Supabase → Project Settings → API Keys. Legacy projects can instead set `SUPABASE_SERVICE_ROLE_KEY` to the old JWT service-role key.

4. Apply the variables to Production, Preview, and Development.
5. Redeploy.

Never expose either server key through a `VITE_` variable or place it in browser code. Row Level Security remains enabled. Browser visitors can submit leads but cannot read, update, or delete the table.

All submissions are available in **Supabase → Table Editor → leads**:

- Original contact-form fields remain in `name`, `email`, `phone`, `company`, `service`, `budget`, and `message`.
- Questionnaire type is in `profile_type`.
- All selected services are in the `services` array.
- Every Influencer, Company, or Agency answer is in `intake_details` as structured JSON.
- `source` distinguishes `website_contact` from `chatbot_intake`.

## Configure dashboard work profiles

After an authenticated user reaches `/dashboard`, the dashboard is locked until a complete work profile exists. First-time users must choose:

- Company
- Influencer
- Other

The setup cannot be closed or skipped. The dashboard becomes visible only after the server validates and saves all required contact details, profile-specific work information, links/platforms, goals, challenges, and at least one service of interest. Existing users with a completed profile enter normally and can reopen **Work profile** to update their answers.

Run this once in **Supabase → SQL Editor**:

```text
supabase/user_work_profiles.sql
```

Profiles are saved in:

```text
Supabase → Table Editor → user_work_profiles
```

The selected type is stored in `profile_type`; all form answers are stored as structured JSON in `profile_data`. Records reference `auth.users(id)` and are deleted automatically when the corresponding authentication user is deleted.

The endpoint uses the same server variables as the detailed lead intake:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_server_key
```

## Deploy

```bash
npm install
npm run build
```

Push the folder to GitHub and import it into Vercel. Vercel builds `dist/` and deploys `api/chat.js` as a serverless function.

For local API development:

```bash
cp .env.example .env.local
# Add your real GROQ_API_KEY to .env.local
npm install
npm run dev
```

## Project structure

- `src/site.html` — self-contained recovered website
- `public/chatbot.js` — standalone chatbot interface
- `public/chatbot.css` — isolated chatbot styles
- `api/chat.js` — Groq/Gemini/knowledge-base server endpoint
- `api/intake.js` — validated server endpoint that saves visitor profiles to `public.leads`
- `api/user-profile.js` — authenticated dashboard work-profile endpoint
- `public/user-profile.js` — Company, Influencer and Other onboarding interface
- `public/user-profile.css` — dashboard profile interface styles
- `supabase/leads_intake_upgrade.sql` — adds profile, service and JSON detail columns to `public.leads`
- `supabase/user_work_profiles.sql` — authenticated user work-profile table
- `public/images/` — website images
- `scripts/build.mjs` — production build
- `.env.example` — environment template
- `vercel.json` — routing and security headers

## Security

Never commit `.env.local`, put an API key in `site.html`, or expose a key through a `VITE_` variable.

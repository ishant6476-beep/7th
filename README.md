# Prime Polo — Performance Agency Redesign

This is a deployable recovery and full visual redesign of the Prime Polo website. The earlier black-and-yellow performance-agency interface has been restored, including its bold editorial typography, structured dark panels and bright yellow calls to action. Prime Polo branding, content, both themes, the theme toggle, authentication, dashboard, chatbot and Supabase workflows are preserved.

## Restored visual system

- Black-and-yellow performance-agency design
- Bold editorial typography and structured service panels
- Original responsive header, cards and calls to action
- Three original generated 3D visuals for the hero, integrated services and strategy sections
- Responsive desktop and mobile layouts
- Real Google Maps embed with an external **Open in Google Maps** action
- White presentation tiles automatically applied only to third-party company, partner and client logos; Prime Polo's own header and footer logos keep their original background
- Dark and light themes remain available through the existing theme button
- Founder corrected to **Saurya Kumar**
- Professional experience updated to **5+ years**
- Business location updated to **Vikas Nagar, Bihta, Bihar 801103**
- General enquiries and growth briefs use **info@primepolomarketing.in**
- Account, privacy, rights and technical assistance use **support@primepolomarketing.in**
- Business formation year updated to **2026**
- Main navigation updated to **Influencer, About Us, Blog, Services, Clients, Industry, International**, with a working destination and original content for every option
- Added dedicated Influencer Marketing, Blog, and International Growth sections
- Blog includes four complete, readable articles covering SEO/AEO/GEO, influencer briefs, paid-media measurement, and conversion-ready websites
- Every service card now opens a functional detail panel; the Services navigation link now lands on the correct section
- Click-to-call uses **7903946440**; WhatsApp enquiries use **7992278315**
- Connected official Instagram: `https://www.instagram.com/primepolo_marketing/`
- Connected official LinkedIn: `https://www.linkedin.com/in/prime-polo-2b12853b6`
- Service catalog expanded to Creative & Communication; Search Engine Marketing with SEO/AEO/GEO; full-funnel Digital Marketing; Website, Web App and Mobile App Development; Ad Management; UGC Content Creation; Social Media and Influencer Marketing; Online Reputation Management; Content and Video Production; Branding and Design; Performance Marketing; Lead Generation; Marketing Automation/CRM; and Analytics/Attribution

## Configure the Admin Website Editor

The `/admin` CRM includes a **Website Editor** tab with:

- Hero text, buttons, image and homepage SEO fields
- Business emails, phone, WhatsApp, address, hours, social links and map URL
- Founder/about content
- Add, remove, reorder, hide and edit services
- Add, remove, reorder and edit showcase projects
- Add, remove, reorder and edit FAQs
- Section visibility controls
- Draft saving, secure preview, per-section publishing and publish-all
- Revision history and administrator rollback
- Supabase Storage media library with image upload and copyable URLs

Run this once in **Supabase → SQL Editor**:

```text
supabase/site_cms.sql
```

The editor uses the existing server-only variables:

```env
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_server_key
```

Staff can save drafts. Only users with `role = admin` in `staff_roles` can publish, roll back or upload media. Published content is delivered through `/api/site-content`; if the CMS is unavailable, the original built-in website content remains visible.

## Client-readiness and credibility

The homepage includes a pre-engagement standards section covering written scope, milestones, access, secure handling, reporting and accountability. A second **Before the Advance** section explains the objective, deliverables, timeline, commercial structure, access/ownership and review details a prospective client should receive before kickoff.

Unverified performance statistics, fictional client names, fictional team members, testimonials and calculator benchmarks have been removed from the public presentation. Demonstration portfolio work is clearly labelled as concept work until verified client permission and evidence are available.

## Expanded editorial and portfolio sections

The homepage includes additional original content inspired by modern agency publishing patterns without copying another company's claims or client list:

- Channels and ecosystems strip for Google Ads, Meta, Instagram, LinkedIn, YouTube, Shopify, WordPress, HubSpot and GA4
- Interactive four-project creative concept showcase
- Original generated imagery for branding, social campaigns, web analytics and creator production
- Studio journal with brand-craft, creator-production and measurement stories
- Free growth-audit call-to-action
- Clear concept-work disclosure so demonstration imagery is never presented as real client work

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

## SEO implementation

The production build generates dedicated, indexable pages for:

- `/services`
- `/seo`
- `/influencer-marketing`
- `/social-media-marketing`
- `/performance-marketing`
- `/website-development`
- `/blog`
- Four individual `/blog/...` article URLs

Each page includes a unique title, meta description, canonical URL, Open Graph/Twitter metadata, one H1, internal links, responsive content and JSON-LD. Structured data includes LocalBusiness, WebSite, BreadcrumbList, Service, Article and FAQPage where relevant.

The build also regenerates `sitemap.xml` with every indexable URL and updates `robots.txt` to keep `/dashboard`, `/admin` and `/api/` out of search results.

After deployment, submit `https://primepolomarketing.in/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Search-engine submission and Google Business Profile verification require owner access and cannot be completed by the codebase itself.

## Configure EduEx college consultation

A public, no-login consultation form is available at:

```text
https://primepolomarketing.in/eduex
```

It collects mandatory student contact details, academic background, course availability preferences, college and destination choices. Guardian, address, consultation-goals, education-loan and scholarship sections were intentionally removed to keep the mobile form focused.

Submissions do **not** enter `public.leads`. They are stored separately in:

```text
public.college_inspections
```

Run this once in **Supabase → SQL Editor**:

```text
supabase/college_inspections.sql
```

The existing `SUPABASE_URL` and `SUPABASE_SECRET_KEY` Vercel variables are used by the server API. After deployment, staff can open **College Inspections** inside `/admin` to search records, review every submitted detail, assign a counsellor, set follow-up dates, add notes and update admission status.

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

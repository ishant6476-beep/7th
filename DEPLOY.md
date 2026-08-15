# Deploying Prime Polo to Vercel with a Custom Domain

Prime Polo is a static single-page app. Vercel builds it, serves it from its CDN, and Supabase plus EmailJS handle everything server-side. There is no Node server to run.

Work through the steps in order. Steps 5 and 6 are the ones people usually forget, and skipping them breaks login on the live domain even though everything worked locally.

---

## 1. Push the repository

Push the project to GitHub, GitLab, or Bitbucket. Vercel deploys from a Git repository.

Confirm `.env.local` is **not** committed. Only `.env.example` belongs in Git. Add this to `.gitignore` if it is missing:

```
node_modules
dist
.env
.env.local
.vercel
```

---

## 2. Import the project into Vercel

1. Go to `https://vercel.com/new` and import the repository.
2. Vercel reads `vercel.json` and detects Vite automatically. Leave the defaults:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
3. Do **not** click Deploy yet. Add the environment variables first (next step), otherwise the first build ships without backend credentials and you will need to redeploy.

---

## 3. Add environment variables

In the import screen, or later under **Project → Settings → Environment Variables**, add all five. Apply each to **Production, Preview, and Development**.

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase public anon key |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public browser key |

Two things that matter:

- **`VITE_` variables are baked in at build time, not read at runtime.** Changing a value in the Vercel dashboard does nothing until you trigger a new deployment. After editing any variable, go to **Deployments → ⋯ → Redeploy**.
- **Never add the Supabase `service_role` key.** Anything prefixed `VITE_` is compiled into public JavaScript and readable by any visitor. The anon key is designed for this and is safe; Row Level Security in `supabase/schema.sql` is the actual security boundary.

Now click **Deploy**. You will get a working `your-project.vercel.app` URL.

---

## 4. Connect your custom domain

1. **Project → Settings → Domains → Add**, then enter your domain, for example `primepolomarketing.in`.
2. Vercel shows the DNS records to create at your registrar (GoDaddy, Namecheap, Cloudflare, BigRock, and so on).

**Apex domain** (`primepolomarketing.in`):
```
Type: A       Name: @      Value: 76.76.21.21
```

**Subdomain** (`www.primepolomarketing.in`):
```
Type: CNAME   Name: www    Value: cname.vercel-dns.com
```

Add both, then set one as primary in Vercel and let it redirect the other. `www` → apex is the common choice.

3. DNS usually propagates in minutes but can take up to 48 hours. Vercel issues an SSL certificate automatically once the records resolve. Wait for the domain to show **Valid Configuration** before continuing.

If your DNS is behind Cloudflare, set the records to **DNS only** (grey cloud), not proxied. Cloudflare's orange-cloud proxy in front of Vercel causes redirect loops and certificate issues.

---

## 5. Point Supabase at the live domain

This is the step that breaks login in production if missed. Supabase refuses auth redirects to URLs it does not recognise.

Go to **Supabase → Authentication → URL Configuration**:

- **Site URL:** `https://primepolomarketing.in`
- **Redirect URLs**, add every one of these:
  ```
  https://primepolomarketing.in/dashboard
  https://primepolomarketing.in/dashboard?reset=1
  https://www.primepolomarketing.in/dashboard
  https://your-project.vercel.app/dashboard
  http://localhost:5173/dashboard
  ```

Include the Vercel preview URL if you want to test auth on preview deployments, and keep localhost for local development.

Then in **Authentication → Providers → Google**, confirm the provider is enabled. In **Google Cloud Console → Credentials → your OAuth client**, add:

- **Authorized JavaScript origins:** `https://primepolomarketing.in`
- **Authorized redirect URIs:** `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

The redirect URI points at Supabase, not at your domain. That trips people up. The Google client secret stays in Supabase only and never reaches the frontend.

---

## 6. Allow the domain in EmailJS

**EmailJS → Account → Security → Allowed Origins**, add:

```
https://primepolomarketing.in
https://www.primepolomarketing.in
```

Without this, contact form and chatbot emails fail with a CORS or origin error. The lead still saves to Supabase because the code settles those two operations independently, so you will get silent email failures rather than lost leads.

---

## 7. Update the SEO URLs

`index.html` currently references the placeholder `https://primepolomarketing.in/`. If your real domain differs, update these five spots:

| Line content | Tag |
|---|---|
| `<link rel="canonical" href="..." />` | canonical |
| `<meta property="og:url" content="..." />` | Open Graph URL |
| `<meta property="og:image" content=".../images/prime-polo-hero.jpg" />` | Open Graph image |
| `<meta name="twitter:image" content=".../images/prime-polo-hero.jpg" />` | Twitter image |
| `"url": "..."` inside the JSON-LD block | schema.org Organization |

Commit and push. Vercel redeploys automatically on every push to the production branch.

---

## 8. Verify the deployment

Check each of these on the live domain:

- [ ] `https://primepolomarketing.in` loads with hero imagery, aurora effects, and particles
- [ ] `https://primepolomarketing.in/dashboard` loads **on a hard refresh**, not just via in-app navigation — this proves the SPA rewrite works
- [ ] `/terms`, `/privacy`, and `/admin` also survive a direct refresh
- [ ] Sign up with a real address, receive the confirmation email, and confirm
- [ ] "Continue with Google" completes the round trip and returns you logged in
- [ ] Submit the contact form, then confirm the row appears in the Supabase `leads` table
- [ ] Send a chatbot message, then confirm the row appears in `chat_logs`
- [ ] Log in at `/admin` with a user who has a `staff_roles` row and confirm leads are listed
- [ ] Log in at `/admin` with a normal customer account and confirm it is **rejected**
- [ ] Theme toggle persists across a reload
- [ ] Open on a phone: bottom tab bar, hamburger menu, and Log In / Sign Up all appear

The URL bar should show clean paths like `/dashboard`. If you see `#/dashboard` instead, the rewrite in `vercel.json` is not being applied — the router falls back to hash mode automatically so the site still works, but check that `vercel.json` is committed at the repository root.

---

## How the routing works

`vercel.json` rewrites every unmatched path to `/index.html`. Vercel checks the filesystem before applying rewrites, so real files such as `/images/prime-polo-hero.jpg` are served directly and never swallowed by the catch-all.

This is what lets someone paste `https://primepolomarketing.in/privacy` into a fresh tab and land on the privacy page. Without it, Vercel would look for a file at `/privacy`, fail, and return 404.

---

## Ongoing deployments

Every push to your production branch triggers a rebuild and deploy. Pull requests get their own preview URLs.

If a deployment misbehaves, use **Deployments → ⋯ → Instant Rollback** to return to the previous working build immediately.

Remember the environment variable rule: changing a `VITE_` value requires a redeploy to take effect.

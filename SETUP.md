# Prime Polo Production Setup

The frontend is a static Vite SPA. Supabase provides authentication and data access; EmailJS sends contact and chatbot notifications. No service-role key or private OAuth secret belongs in this repository.

## 1. Supabase Project

1. Create a project at `https://supabase.com/dashboard` and save the project URL and public anon key from Project Settings > API.
2. Open SQL Editor, paste `supabase/schema.sql`, and run it once. The migration creates all tables, indexes, trigger functions, helper functions, grants and Row Level Security policies.
3. In Authentication > Providers > Email, enable Email and **Confirm email**. Set the minimum password length to at least 8.
4. In Authentication > URL Configuration, set the production Site URL. Add `http://localhost:5173/dashboard` and your production `/dashboard` URL to Redirect URLs.
5. Never place the Supabase `service_role` key in a `VITE_` variable. The browser only receives the public anon key; RLS is the security boundary.

## 2. Google OAuth

1. In Google Cloud Console, create an OAuth 2.0 Web application client.
2. Use the Supabase callback shown in Authentication > Providers > Google as an authorized redirect URI. It normally resembles `https://YOUR_PROJECT.supabase.co/auth/v1/callback`.
3. Paste the Google Client ID and Client Secret into Supabase Authentication > Providers > Google and enable the provider.
4. Keep the Google Client Secret only in Supabase. The site starts OAuth through Supabase's hosted flow and never exposes that secret.
5. Apple login is intentionally disabled until a paid Apple Developer account and provider credentials are available.

## 3. Staff Access

Staff registration is never public. First create the staff member through Supabase Authentication, then add the same user UUID manually to `public.staff_roles` in Table Editor:

```sql
insert into public.staff_roles (id, role)
values ('AUTH-USER-UUID', 'admin');
```

Use `staff` instead of `admin` for a standard staff account. The `/admin` route authenticates with Supabase and then requires the protected `staff_roles` row. Customer accounts without a matching row are rejected.

## 4. EmailJS

1. Create an EmailJS service connected to the inbox that should send notifications.
2. Create a template using `{{subject}}`, `{{message}}`, `{{reply_to}}` and `{{to_email}}`. Set the recipient to `{{to_email}}` or directly to `primepolo03@gmail.com`.
3. Add `https://primepolomarketing.in` and local development origins to the EmailJS allowed-origin list.
4. Copy the Service ID, Template ID and public browser key into the Vite environment variables below. EmailJS public keys are designed for browser use; do not put a private email provider credential in the frontend.

## 5. Environment

Copy `.env.example` to `.env.local` and replace placeholders:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
VITE_EMAILJS_SERVICE_ID=YOUR_EMAILJS_SERVICE_ID
VITE_EMAILJS_TEMPLATE_ID=YOUR_EMAILJS_TEMPLATE_ID
VITE_EMAILJS_PUBLIC_KEY=YOUR_EMAILJS_PUBLIC_KEY
```

Restart Vite after environment changes. Contact leads save to `leads`, chatbot exchanges save to `chat_logs`, and both send EmailJS notifications. If EmailJS is temporarily unavailable, database writes remain successful.

## 6. Static Hosting

Configure the host to rewrite unknown paths to `index.html` so `/terms`, `/privacy`, `/dashboard` and `/admin` load the SPA. Use HTTPS in production. Update canonical and Open Graph URLs in `index.html` if the final domain differs from `https://primepolomarketing.in/`.
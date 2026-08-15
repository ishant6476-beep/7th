# Prime Polo — Recovered Site + Rebuilt AI Chatbot

This project is a deployable recovery of the live Prime Polo site. The original `src` folder was not available, so the existing production application has been preserved in `src/site.html` as a self-contained source snapshot. The chatbot has been rebuilt to call a secure server-side Gemini endpoint.

## What was fixed

- The mobile floating chat button no longer overlaps the Send button. That overlap closed the chat and exposed the light-theme white background, which looked like a blank screen.
- Chat requests now go to `/api/chat` instead of using only fixed keyword responses.
- API/network/model failures are caught; the existing local business-answer system is used as a fallback, so the page never disappears or crashes.
- The Gemini key stays in a server-only environment variable and is never shipped to the browser.
- Input length, conversation history, output length, timeout, and basic per-IP request rate are limited.

## Get a free API key

1. Open https://aistudio.google.com/apikey and create a Gemini API key.
2. On Vercel, open **Project → Settings → Environment Variables**.
3. Add:

   - `GEMINI_API_KEY` = your key
   - `GEMINI_MODEL` = `gemini-3.5-flash` (optional; this is already the default)

4. Apply variables to Production, Preview, and Development.
5. Redeploy. Environment changes do not affect a deployment that has already been built.

Do not rename the key to `VITE_GEMINI_API_KEY`. A `VITE_` variable would expose it publicly.

Free-tier availability and quotas are controlled by Google and can vary by region/account. If the quota is exhausted or a model becomes unavailable, update `GEMINI_MODEL`; the browser chatbot will still provide its local fallback answers.

## Deploy to Vercel

```bash
npm install
npm run build
```

Push the folder to GitHub and import it into Vercel. Vercel uses `vercel.json`, builds `dist/`, and deploys `api/chat.js` as a serverless function.

For local development with the API route:

```bash
cp .env.example .env.local
# Put your real key in .env.local
npm install
npm run dev
```

## Project structure

- `src/site.html` — complete self-contained website snapshot and rebuilt chatbot client
- `api/chat.js` — secure Gemini serverless endpoint
- `public/images/` — site images
- `scripts/build.mjs` — deterministic production build
- `.env.example` — environment variable template
- `vercel.json` — API/static routing and security headers

## Important

The Gemini key must remain secret. Never commit `.env.local`, and never place the key directly inside `site.html` or browser JavaScript.

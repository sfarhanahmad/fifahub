# FIFA Hub 2026

A fan-made, SEO-optimized hub for the 2026 FIFA World Cup — live scores,
group standings for all 48 teams, schedules, history, a team directory,
a predictions/trivia page, an AI chat assistant, and Google AdSense slots.

## What's in this folder

```
index.html          Main hub (live ticker, groups, schedule, history, FAQ, chat widget)
teams.html           All 48 teams — searchable/filterable directory
predictions.html     "Pick your champion" + trivia quiz
style.css            Shared design system for all pages
data/teams.json      Team data powering teams.html
api/scores.js        Serverless function — live scores (football-data.org)
api/chat.js          Serverless function — AI chat (Groq, free tier)
vercel.json          Security headers + caching config
robots.txt           Search engine crawl rules
sitemap.xml          Pages for Google to index
```

## 1. Deploy to Vercel (free)

1. Create a free account at https://vercel.com (sign in with GitHub).
2. Create a new GitHub repository and push **everything in this folder** to it
   (keep the folder structure exactly as-is — `api/` and `data/` must stay
   as folders, not be renamed).
3. In Vercel: **Add New → Project → Import** your repo.
4. Leave the framework preset as **"Other"** (it's a static site + serverless
   functions — Vercel auto-detects the `api/` folder). Click **Deploy**.
5. You'll get a live URL like `your-project.vercel.app` within ~30 seconds.

## 2. Connect your free domain

1. In Vercel: open your project → **Settings → Domains → Add**.
2. Type the domain you got for free and click Add.
3. Vercel shows you DNS records (usually an `A` record pointing to
   `76.76.21.21` and/or a `CNAME` for `www`).
4. Go to wherever you manage that domain's DNS, add those exact records.
5. Wait 10–60 minutes for DNS to propagate, then your site is live at
   your own domain with free HTTPS.

## 3. Enable live scores (optional but recommended)

1. Sign up free at https://www.football-data.org/client/register — you'll
   get an API token instantly by email.
2. In Vercel: **Settings → Environment Variables** → add
   `FOOTBALL_DATA_TOKEN` = *your token*.
3. Redeploy (Vercel → Deployments → ⋯ → Redeploy).
4. The homepage ticker now pulls live scores from `/api/scores`,
   cached for 10 minutes — no manual edits needed.

## 4. Enable the AI chat widget ("Ask The Pundit")

1. Sign up free at https://console.groq.com and create an API key.
2. In Vercel: **Settings → Environment Variables** → add
   `GROQ_API_KEY` = *your key*.
3. Redeploy. The chat bubble on the homepage now answers questions live.

## 5. Set up Google AdSense

1. Apply at https://www.google.com/adsense — you'll need your site live
   on its real domain first (AdSense reviews the live URL).
2. Once approved, AdSense gives you a **publisher ID** like
   `ca-pub-1234567890123456`.
3. Find-and-replace `ca-pub-XXXXXXXXXXXXXXXX` with your real publisher ID
   in **index.html, teams.html, predictions.html** (it appears in the
   `<head>` script tag and in each `<ins class="adsbygoogle">` block).
4. For each `<ins class="adsbygoogle">` block, also replace
   `data-ad-slot="XXXXXXXXXX"` with the ad unit IDs AdSense gives you
   (create one "Display ad" unit per slot in the AdSense dashboard, or
   reuse one "auto" unit ID everywhere).
5. Redeploy. Ads typically take a few hours to start showing after approval.

## 6. SEO checklist

- Replace `https://example.com` and `YOURDOMAIN.com` placeholders in
  `index.html`, `teams.html`, `predictions.html`, `sitemap.xml`, and
  `robots.txt` with your real domain.
- Go to https://search.google.com/search-console, add your domain,
  verify it (Vercel supports one-click DNS verification), and submit
  `https://yourdomain.com/sitemap.xml`.
- Keep `index.html`'s match results and group tables updated — once
  `/api/scores` is live this happens automatically.

## 7. Updating data day-to-day

- **Scores**: automatic via `/api/scores` once `FOOTBALL_DATA_TOKEN` is set.
- **Group standings tables, schedule, history**: edit the HTML directly —
  every table is plain markup, no build step.
- **Teams directory**: edit `data/teams.json` — one object per team.

## Notes

- This is an independent fan project, not affiliated with FIFA.
- No subscriptions, logins, or paid services are required to run this —
  every external service used (Vercel, football-data.org, Groq, AdSense)
  has a free tier sufficient for a fan site.

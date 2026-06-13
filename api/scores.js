// /api/scores.js
// Vercel Serverless Function — acts as your "backend".
// It fetches live World Cup 2026 data from football-data.org (free tier)
// and re-serves it to your frontend, cached at the edge so you stay
// well under the free API's rate limit (10 requests/minute).
//
// SETUP:
// 1. Create a free account at https://www.football-data.org/client/register
// 2. Copy your API token
// 3. In your Vercel project: Settings -> Environment Variables
//    add FOOTBALL_DATA_TOKEN = <your token>
// 4. Deploy. Your frontend calls fetch("/api/scores") — never the
//    football-data.org API directly, so your token stays secret.

export default async function handler(req, res) {
  const TOKEN = process.env.FOOTBALL_DATA_TOKEN;

  if (!TOKEN) {
    return res.status(500).json({ error: "Missing FOOTBALL_DATA_TOKEN env var" });
  }

  try {
    // WC = World Cup competition code on football-data.org
    const upstream = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches",
      { headers: { "X-Auth-Token": TOKEN } }
    );

    if (!upstream.ok) {
      return res.status(upstream.status).json({ error: "Upstream error" });
    }

    const data = await upstream.json();

    // Shape the response down to only what the frontend needs
    const matches = (data.matches || []).map((m) => ({
      id: m.id,
      group: m.group,
      status: m.status, // SCHEDULED | LIVE | IN_PLAY | PAUSED | FINISHED
      utcDate: m.utcDate,
      home: m.homeTeam?.name,
      away: m.awayTeam?.name,
      homeScore: m.score?.fullTime?.home,
      awayScore: m.score?.fullTime?.away,
      venue: m.venue,
    }));

    // Cache at Vercel's edge for 10 minutes, serve stale for up to 1 hour
    // while revalidating in the background — this is what gives you
    // "daily updating" data without a database or cron job.
    res.setHeader(
      "Cache-Control",
      "s-maxage=600, stale-while-revalidate=3600"
    );
    return res.status(200).json({ updated: new Date().toISOString(), matches });
  } catch (err) {
    return res.status(500).json({ error: "Fetch failed", detail: String(err) });
  }
}

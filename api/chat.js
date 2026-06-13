// /api/chat.js
// Powers the "Ask the Pundit" chat widget using Groq's free API.
// Groq gives a generous free tier and runs open-source models
// (Llama 3.1 / 3.3) extremely fast — no OpenAI billing needed.
//
// SETUP:
// 1. Create a free account at https://console.groq.com
// 2. Create an API key
// 3. In your Vercel project: Settings -> Environment Variables
//    add GROQ_API_KEY = <your key>
// 4. Deploy. The frontend calls fetch("/api/chat") — the key
//    never reaches the browser.

const SYSTEM_PROMPT = `You are the "FIFA Hub 2026 Pundit" — a friendly, knowledgeable
assistant for a World Cup 2026 fan website. Answer questions about the
2026 FIFA World Cup (48 teams, 12 groups, hosted by USA/Canada/Mexico,
June 11 - July 19 2026, final at MetLife Stadium), the FIFA Club World Cup
2025 (won by Chelsea, beat PSG 3-0), and general football history and rules.
Keep answers short (2-4 sentences), conversational, and football-fan friendly.
If you don't know an exact live score or very recent result, say so honestly
and suggest the visitor check the live scores section of the site instead
of guessing.`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Use POST" });
  }

  const KEY = process.env.GROQ_API_KEY;
  if (!KEY) {
    return res.status(500).json({ error: "Missing GROQ_API_KEY env var" });
  }

  const { message, history = [] } = req.body || {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Missing 'message' string" });
  }
  if (message.length > 500) {
    return res.status(400).json({ error: "Message too long" });
  }

  // Keep only the last few turns to control cost/latency
  const trimmedHistory = Array.isArray(history) ? history.slice(-6) : [];

  try {
    const upstream = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        max_tokens: 300,
        temperature: 0.6,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          ...trimmedHistory,
          { role: "user", content: message },
        ],
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text();
      return res.status(upstream.status).json({ error: "Upstream error", detail });
    }

    const data = await upstream.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn't think of an answer.";
    return res.status(200).json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Request failed", detail: String(err) });
  }
}

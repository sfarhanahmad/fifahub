// /api/ping.js
// Call this endpoint after every deploy to notify Google your sitemap updated.
// Add it as a Deploy Hook in Vercel:
//   Settings → Git → Deploy Hooks → create a hook
// Or just visit: https://fifahub-livid.vercel.app/api/ping
// 
// You can also add this to your robots.txt which Google reads automatically.

export default async function handler(req, res) {
  const SITEMAP = 'https://fifahub-livid.vercel.app/sitemap.xml';
  
  try {
    // Ping Google
    const googlePing = await fetch(
      `https://www.google.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`
    );
    
    // Ping Bing (also indexes your site)
    const bingPing = await fetch(
      `https://www.bing.com/ping?sitemap=${encodeURIComponent(SITEMAP)}`
    );

    return res.status(200).json({
      ok: true,
      google: googlePing.status,
      bing: bingPing.status,
      sitemap: SITEMAP,
      pinged_at: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}

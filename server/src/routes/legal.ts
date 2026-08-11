import { Router } from "express";

export const legalRouter = Router();

const PAGE_STYLE = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 680px; margin: 0 auto; padding: 40px 24px 80px; color: #12141A; line-height: 1.6; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  h2 { font-size: 18px; margin-top: 32px; }
  .updated { color: #5B6270; font-size: 14px; margin-bottom: 32px; }
  a { color: #3E63DD; }
  ul { padding-left: 20px; }
`;

legalRouter.get("/privacy", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Privacy Policy — Actually Real?</title><style>${PAGE_STYLE}</style></head>
<body>
<h1>Privacy Policy</h1>
<p class="updated">Last updated: ${new Date().toISOString().slice(0, 10)}</p>

<p>Actually Real? ("the app") lets you scan photos to check whether they look AI-generated. This page explains what data we collect and why.</p>

<h2>What we collect</h2>
<ul>
  <li><strong>Photos you scan.</strong> Sent to our server to run detection, and to our third-party detection provider (SightEngine) for analysis. Stored so you can view your scan history.</li>
  <li><strong>An anonymous account identifier.</strong> Created automatically on first launch (via Supabase anonymous authentication) — no name, email, or phone number is required or collected.</li>
  <li><strong>Scan results and history</strong>, tied to that anonymous identifier.</li>
  <li><strong>Subscription status</strong>, if you purchase Unlimited, via RevenueCat and Apple's App Store. We never see your payment card details — Apple handles all billing directly.</li>
</ul>

<h2>What we don't collect</h2>
<p>We do not collect precise location, contacts, browsing history, or use any advertising/tracking SDKs.</p>

<h2>Third parties we share data with</h2>
<ul>
  <li><strong>SightEngine</strong> — receives scanned images to run AI-detection analysis.</li>
  <li><strong>Supabase</strong> — hosts our database, file storage, and anonymous authentication.</li>
  <li><strong>RevenueCat</strong> — manages subscription status.</li>
  <li><strong>Apple</strong> — processes all App Store purchases.</li>
</ul>
<p>We do not sell your data to anyone.</p>

<h2>Data retention and deletion</h2>
<p>Scanned images and results are kept until you request deletion. To request deletion of your data, contact us at the email below and we'll remove it within 30 days.</p>

<h2>Children</h2>
<p>This app is not directed at children under 13, and we do not knowingly collect data from them.</p>

<h2>Contact</h2>
<p>Questions about this policy or your data: <a href="mailto:mr.webdev.lv@gmail.com">mr.webdev.lv@gmail.com</a></p>
</body></html>`);
});

legalRouter.get("/support", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Support — Actually Real?</title><style>${PAGE_STYLE}</style></head>
<body>
<h1>Support</h1>
<p>Need help with Actually Real?, or found a bug? Email us and we'll get back to you.</p>
<p><a href="mailto:mr.webdev.lv@gmail.com">mr.webdev.lv@gmail.com</a></p>
<h2>Frequently asked</h2>
<h2>How accurate is the detection?</h2>
<p>No AI detector can be 100% certain. Every result shows a confidence level and the individual signals behind it, including where they disagree — see the "why we're not 100% sure" panel on any result.</p>
<h2>How do I cancel my subscription?</h2>
<p>Subscriptions are billed and managed through your Apple ID. Go to Settings &gt; [your name] &gt; Subscriptions on your iPhone to manage or cancel.</p>
<h2>How do I delete my data?</h2>
<p>Email <a href="mailto:mr.webdev.lv@gmail.com">mr.webdev.lv@gmail.com</a> and we'll remove your scan history and account data within 30 days. See our <a href="/privacy">Privacy Policy</a> for details.</p>
</body></html>`);
});

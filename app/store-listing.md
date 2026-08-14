# App Store Listing — Actually Real?

Copy-paste these directly into App Store Connect (App Information / Version Information).

## App Name
Actually Real?

## Subtitle (30 char max)
AI photo detector, explained

## Promotional Text (170 char max, editable anytime without a new build)
See whether a photo looks AI-generated, and exactly why. Flagged regions, camera metadata, compression clues - not just a bare percentage.

## Description (4000 char max)

Actually Real? scans any photo and tells you whether it looks AI-generated - and shows you exactly why, not just a score.

HOW IT WORKS
- Every scan runs four independent checks: a trained AI-detection model, a compression-artifact analysis that flags exactly which regions look synthesized, a camera-metadata check, and a Content Credentials (C2PA) check where available. You get a clear verdict — Likely Real, Likely AI, or Uncertain — with a confidence level, plus a heatmap showing precisely which parts of the image triggered the result.

HONEST ABOUT UNCERTAINTY
- No detector is ever 100% certain, and we don't pretend otherwise. Every scan shows you each individual signal — including when they disagree — so you can judge for yourself instead of trusting a single black-box number.

FREE TO START
- Get 5 scans a day at no cost. Upgrade to Unlimited for unrestricted daily scanning.

Perfect for checking suspicious photos, verifying images before sharing, or just satisfying your curiosity about what's real.

Privacy Policy: https://ai-scanner-backend-production.up.railway.app/privacy
Terms of Use (EULA): https://www.apple.com/legal/internet-services/itunes/dev/stdeula/

Privacy policy and terms are also available in-app under Settings and on the subscription screen.

## Keywords (100 char max, comma-separated, no spaces)
ai detector,ai image,fake photo,photo checker,image forensics,real or fake,is this ai

## Category
Primary: Utilities
Secondary: Photo & Video

## Support URL / Marketing URL
https://ai-scanner-backend-production.up.railway.app/support

## Privacy Policy URL
https://ai-scanner-backend-production.up.railway.app/privacy

## Terms of Use (EULA)
Using Apple's standard EULA (no custom terms) — do not fill in the "License Agreement" field in App Store Connect. The standard EULA link (https://www.apple.com/legal/internet-services/itunes/dev/stdeula/) is included in the App Description above, per Apple's guidance for apps that don't use a custom EULA.

## App Review Notes
This app provides probabilistic AI-image detection using a third-party classification API (SightEngine) combined with our own heuristic signals (EXIF metadata, compression-artifact analysis, C2PA content credentials). Results are explicitly presented as confidence levels, not certainties — the app includes a persistent "why we're not 100% sure" panel on every result. No detector can guarantee 100% accuracy; this is disclosed in-app and in the App Store description.

The free tier allows a limited number of scans per day (server-enforced). The Unlimited subscription removes this cap. Test account: not required — the app works immediately with anonymous sign-in (no login/signup needed to test core functionality).

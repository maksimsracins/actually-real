---
name: Actually Real?
description: A forensic photo-authenticity scanner that shows its evidence, not just a verdict.
colors:
  ink: "#12141A"
  ink-dark: "#F4F5F7"
  ink-soft: "#5B6270"
  ink-soft-dark: "#A7ADBA"
  ink-mute: "#8A909E"
  ink-mute-dark: "#6E7480"
  paper: "#F7F8FA"
  paper-dark: "#0B0C0F"
  surface: "#FFFFFF"
  surface-dark: "#16181D"
  surface-raised: "#FFFFFF"
  surface-raised-dark: "#1D2028"
  border: "#E4E7EC"
  border-dark: "#272A31"
  accent: "#3550C4"
  accent-dark: "#8CA3FF"
  accent-deep: "#1E2E82"
  accent-surface: "#EEF1FF"
  accent-surface-dark: "#1A2247"
  ai-likely: "#C7333B"
  ai-likely-dark: "#F27373"
  ai-likely-surface: "#FBEAEA"
  ai-likely-surface-dark: "#2E1717"
  real-likely: "#127A54"
  real-likely-dark: "#4FCE9B"
  real-likely-surface: "#E7F6EF"
  real-likely-surface-dark: "#122A20"
  uncertain: "#A5720E"
  uncertain-dark: "#E0AC4E"
  uncertain-surface: "#FBF2DF"
  uncertain-surface-dark: "#2E2410"
typography:
  display:
    fontFamily: "Fraunces_600SemiBold, Georgia, serif"
    fontSize: 34
    fontWeight: "600"
    lineHeight: 40
    letterSpacing: -0.4
  verdict:
    fontFamily: "Fraunces_700Bold, Georgia, serif"
    fontSize: 26
    fontWeight: "700"
    lineHeight: 32
    letterSpacing: -0.2
  heading:
    fontFamily: "System"
    fontSize: 20
    fontWeight: "600"
    lineHeight: 26
  body:
    fontFamily: "System"
    fontSize: 16
    fontWeight: "400"
    lineHeight: 23
  caption:
    fontFamily: "System"
    fontSize: 13
    fontWeight: "500"
    lineHeight: 18
  label:
    fontFamily: "System"
    fontSize: 12
    fontWeight: "600"
    letterSpacing: 0.4
rounded:
  sm: "10px"
  md: "16px"
  lg: "22px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "18px 24px"
  button-primary-pressed:
    backgroundColor: "{colors.accent-deep}"
    textColor: "#FFFFFF"
    rounded: "{rounded.lg}"
    padding: "18px 24px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "18px 24px"
  verdict-badge-real:
    backgroundColor: "{colors.real-likely-surface}"
    textColor: "{colors.real-likely}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  verdict-badge-ai:
    backgroundColor: "{colors.ai-likely-surface}"
    textColor: "{colors.ai-likely}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
  verdict-badge-uncertain:
    backgroundColor: "{colors.uncertain-surface}"
    textColor: "{colors.uncertain}"
    rounded: "{rounded.pill}"
    padding: "10px 18px"
---

# Design System: Actually Real?

## 1. Overview

**Creative North Star: "The Loupe"**

Think of a jeweler's loupe, or a photographic contact-sheet light table: a precise instrument for close inspection, built to feel authoritative in the hand without a single ounce of decoration wasted. Actually Real? is that instrument for photographs. The interface behaves like evidence review, not like a consumer AI toy — deep, quiet neutrals; one deliberate accent; generous space around the one thing that matters on any given screen (the photo, the verdict, the flagged region).

This system explicitly rejects the generic SaaS/AI-tool look: no cream or beige backgrounds, no pastel rounded cards stacked edge to edge, no gradient-clip-text headlines, no tiny uppercase tracked eyebrows scattered above every section. It also rejects anything cute or gamified — no bouncy mascots, no confetti, no playful easing — because the entire product promise is credibility, and credibility reads as composed, not enthusiastic.

**Key Characteristics:**
- Cool, near-neutral grounds (never warm cream/sand)
- One accent color, used with intent, never decoratively
- A serif display face reserved for the verdict and the app's own name — everywhere else, the native system sans
- Flat by default; shadow and depth appear only under things the user acts on
- Verdict states carry icon + label + color together — never color alone

## 2. Colors

A cool, almost clinical neutral base carries the interface; color is spent deliberately on the one accent and on the three verdict states, never as ambient decoration.

### Primary
- **Loupe Indigo** (#3550C4 / dark: #8CA3FF): the single interactive accent — primary buttons, active tab, links, the selected state of "Take Photo." Reserved for things the user can act on.
- **Loupe Indigo Deep** (#1E2E82): pressed/active state of the primary accent; also doubles as a depth color for the primary button's resting shadow.

### Neutral
- **Instrument Paper** (#F7F8FA / dark: #0B0C0F): the app background. Cool, not warm — deliberately not the cream/beige of generic AI-tool marketing.
- **Plate White** (#FFFFFF / dark: #16181D): card and surface background, sitting one step above the paper.
- **Hairline** (#E4E7EC / dark: #272A31): the only border weight in the system, 1px, always full-perimeter (never a colored side-stripe).
- **Ink** (#12141A / dark: #F4F5F7): primary text.
- **Ink Soft** (#5B6270 / dark: #A7ADBA): secondary text, explanation-card bodies.
- **Ink Mute** (#8A909E / dark: #6E7480): captions, timestamps, disabled states.

### Verdict States (Named Rule)
**The Evidence-Color Rule.** Every verdict state is a (color, icon, label) triad — never color alone, since a decision-bearing result must survive both colorblindness and a black-and-white screenshot.
- **Real-Likely Green** (#127A54 / dark: #4FCE9B) with a checkmark-in-circle glyph: "Likely Real."
- **AI-Likely Red** (#C7333B / dark: #F27373) with a sparkle/synthetic glyph: "Likely AI."
- **Uncertain Amber** (#A5720E / dark: #E0AC4E) with a question-mark glyph: "Uncertain."

### Named Rules
**The One Accent Rule.** Loupe Indigo appears on at most one element per screen at rest (the primary CTA or the active tab). It is never used as a background wash or a gradient.

## 3. Typography

**Display Font:** Fraunces (SemiBold 600 / Bold 700), with Georgia as fallback
**Body Font:** System (San Francisco on iOS)

**Character:** Fraunces is a high-contrast serif with real optical weight — it reads as considered and editorial, not templated. It appears in exactly two places: the app's own wordmark ("Actually Real?") and the verdict itself ("Likely Real" / "Likely AI" / "Uncertain"). Everything else — every button, every explanation card, every label — stays in the native system sans, so the serif never competes with itself and always reads as a deliberate accent, not a theme.

### Hierarchy
- **Display** (Fraunces SemiBold 600, 34px, 40 line-height, -0.4 tracking): the app wordmark on Scan and Onboarding.
- **Verdict** (Fraunces Bold 700, 26px, 32 line-height, -0.2 tracking): the verdict badge label only ("Likely Real", etc).
- **Heading** (System Semibold 600, 20px, 26 line-height): section titles ("Why", screen titles).
- **Body** (System Regular 400, 16px, 23 line-height): explanation-card copy, onboarding body text. Capped at ~60ch.
- **Caption** (System Medium 500, 13px, 18 line-height): confidence-band text, timestamps.
- **Label** (System Semibold 600, 12px, 0.4 tracking): rare, used only for the confidence-band eyebrow directly under the verdict badge — not repeated as a section marker elsewhere.

### Named Rules
**The Two-Voice Rule.** Fraunces speaks exactly twice per screen at most (wordmark, verdict). A third serif instance is always a mistake — convert it back to System.

## 4. Elevation

Flat by default. Depth is reserved for the two things the user directly acts on: the primary button and the photo itself. Everything else — explanation cards, the confidence badge, list rows — stays flat with a single 1px hairline border, so depth doesn't become visual noise across a screen with a dozen cards.

### Shadow Vocabulary
- **Instrument shadow** (`shadowColor: accent-deep, shadowOffset: {0,8}, shadowOpacity: 0.18, shadowRadius: 20`): under the primary button only, in Loupe Indigo's own deep tone rather than generic black — it reads as the button's own glow, not a generic drop shadow.
- **Photo lift** (`shadowColor: #000, shadowOffset: {0,12}, shadowOpacity: 0.16, shadowRadius: 28`): under the scanned photo on the Result screen, separating it from the page the way a print sits above a light table.

### Named Rules
**The Flat-Card Rule.** Explanation cards, history rows, and the uncertainty panel are always flat (hairline border, no shadow). Shadow is a signal reserved for "this is the primary thing on this screen," and loses meaning if every card has one.

## 5. Components

### Buttons
- **Shape:** 22px corner radius (`rounded.lg`) — soft enough to feel considered, not a full pill (pills are reserved for status badges only, so the two shapes stay visually distinct).
- **Primary:** Loupe Indigo background, white text, System Semibold 17px, 18px vertical padding, Instrument shadow beneath.
- **Pressed:** background steps to Loupe Indigo Deep, shadow compresses (radius 20→10, opacity 0.18→0.24) rather than just fading — a tactile push, not just a dimmer.
- **Secondary (e.g. "Choose from Library"):** Plate White background, 1px Hairline border, Ink text, no shadow — visually one full step quieter than primary.

### Verdict Badge (signature component)
- **Shape:** full pill (999px radius) — the one place pill shape is used, so it always reads as "this is a status," never confused with a button.
- **Style:** verdict-state surface color as background, verdict-state ink color as text and leading icon glyph, Fraunces Bold for the label.
- **Confidence line:** System Medium 13px in Ink Mute, directly beneath the pill, never inside it — keeps the pill itself short and scannable.

### Explanation Cards
- **Corner Style:** 16px radius (`rounded.md`).
- **Background:** Plate White; 1px Hairline border; no shadow (Flat-Card Rule).
- **Internal Padding:** 20px.
- **Structure:** bold System heading line, then Ink Soft body — no icon column, no colored side-stripe accent.

### Heatmap Overlay
- **Style:** a radial hotspot gradient in a single warning-red tone at partial opacity, scaled by the region's own intensity value — never a flat colored rectangle, so the eye reads it as "heat" rather than a UI chrome element.

### Navigation (Tab Bar)
- **Style:** Plate White background, 1px Hairline top border, active tab in Loupe Indigo (icon + label), inactive tabs in Ink Mute. No pill/background highlight behind the active icon — color alone carries the active state here, since it's paired with a persistent label (not a color-only decision surface).

## 6. Do's and Don'ts

### Do:
- **Do** keep the app background a cool near-white or near-black (#F7F8FA / #0B0C0F) — never cream, sand, or beige.
- **Do** reserve Fraunces for the wordmark and the verdict label only (The Two-Voice Rule).
- **Do** pair every verdict color with an icon and a text label (The Evidence-Color Rule) — color is never the sole carrier of a decision-bearing result.
- **Do** keep explanation cards, history rows, and panels flat with a single hairline border (The Flat-Card Rule).
- **Do** use full-perimeter 1px borders on every card; never a colored `border-left`/`border-right` stripe as an accent.

### Don't:
- **Don't** use a cream/beige/sand background — the generic SaaS/AI-tool default this system explicitly rejects.
- **Don't** add pastel rounded cards stacked edge-to-edge, or gradient-clip-text headlines.
- **Don't** add tiny uppercase tracked eyebrows above sections as decoration; the Label style is reserved for the confidence-band line only.
- **Don't** add playful/bouncy motion, mascots, or confetti — this is a credibility tool, not a game.
- **Don't** let a verdict state rely on color alone (a screenshot in grayscale must still be legible via icon + label).
- **Don't** add a shadow to more than the primary button and the scanned photo; shadows on every card cancel each other out.

# Prompt: implement the HeroReveal intro on my Next.js site

Copy everything below the line into your coding assistant (Claude Code, Cursor, etc.) from the root of your site's repo.

---

You're working in my personal site's Next.js (App Router) + TypeScript repo. Build a new hero section, `HeroReveal`, that replaces the current top section of the homepage. It plays an intro animation **once**, about 10 seconds, then **stays** on its final state. No looping. Use **only React, CSS Modules and a small amount of JS**. No animation libraries, no video, no canvas.

## Look (match the existing site)
- Background: near-black `#050505`, text `#f4f4f5`, secondary text `#b4b4bb`, muted `#7a7a82`.
- Accent gradient: `linear-gradient(90deg, #a5b4fc 0%, #e879f9 55%, #f472b6 100%)`. Use it as gradient-clipped text on the eyebrow and highlight labels.
- Font: the site's existing monospace (JetBrains Mono or whatever `--font-mono` / `next/font` is already configured). Reuse it; don't add a new font.
- Three large, very soft radial glows (lavender, magenta, pink at ~12–18% alpha) drift slowly behind everything.

## Content (make these props with these defaults)
- `name`: "Stef Vanremoortele"
- `roles`: ["Software developer", "Security specialist", "Agentic orchestrator"]
- `highlights` (`{label, text, segment, from, to?, dashed?}[]`, chronological; `to` omitted = now). Consecutive items with the same `segment` share one labelled timeline group:
  1. "Education · 2015—18" / "HOWEST Bruges" / "Education" / 2015–2018 / dashed
  2. "Software development · 2018—20" / "Easypost" / "Software development" / 2018–2020
  3. "Software development · 2020—21" / "Noordzee Helikopters Vlaanderen" / "Software development" / 2020–2021
  4. "Software development · 2021—22" / "NineID" / "Software development" / 2021–2022
  5. "Software development · 2022—23" / "Zora Robotics" / "Software development" / 2022–2023
  6. "Security · 2023—26" / "Roularta Media Group" / "Security" / 2023–2026
  7. "AI agentic · 2026" / "SIMIT" / "AI agentic" / 2026–now
- `avatarSrc`: "/avatar_me.png" (use `next/image`, `priority`)
- `ctaLabel`: "Get in contact", `ctaHref`: "#booking"
- `availability`: "Open to software & security roles", `availabilityHref`: "#booking"
- `cycleRoles`: boolean, default `true`

## Layout (centered column, top to bottom)
1. **Avatar:** a circle, `clamp(140px, 14vw, 240px)`, `object-fit: cover`, `object-position: 50% 18%`. It has a 6px conic-gradient ring in the accent colors with a soft magenta glow, separated from the photo by a thin dark gap.
2. **Eyebrow:** an outline "badge" icon (stroke `#c084fc`, 1.5px, slowly rotating), then the uppercase role text in the accent gradient, letter-spacing `0.32em`, followed by a blinking `_` caret.
3. **Name:** `<h1>`, bold, `clamp(40px, 7.1vw, 136px)`, `text-wrap: balance`.
4. **Slot area:** the highlights and the final actions share **one grid cell** (`grid-area: 1/1`), so they swap in place without shifting the layout.
   - **Company roller (one persistent pill, not one pill per company):** same pill style as the availability chip (1px `rgba(255,255,255,0.14)` border, `rgba(255,255,255,0.03)` fill), holding a violet dot and the **company name only**, bold white at 1.4× the pill font size.
     - When the company changes, each letter of the old name rolls **up and out** (translateY -100%, blur 3px, fade; 300ms) and each letter of the new name rolls **up in** from below (from translateY 100%, blur 3px; 360ms ease-out). Stagger letters by 14ms (`transition-delay: calc(var(--k) * 14ms)`), like a split-flap board.
     - The text window's width **morphs** between names: it's monospace, so `width: calc(var(--len) * 1ch)` with a 360ms transition.
     - On each change, the dot does a quick glow "beat" and a faint magenta sheen sweeps across the pill (800ms).
     - The pill **eases in softly** to match the timeline: over 1s it fades in, rises 16px, grows from scale 0.96 and un-blurs from 6px, with a long ease-out and no overshoot. The first company's letters roll in about 350ms later, once the pill has mostly arrived. The pill scales out at the end.
     - Put the full list of highlights (label + company) in a visually hidden `<ul>` for screen readers, and mark the roller `aria-hidden`.
   - **Final actions (a flex row that wraps):**
     - A solid gradient pill button "Get in contact" (`#c4b5fd → #e879f9 → #f9a8d4`), dark `#111` bold text, with a magenta glow that pulses gently.
     - Next to it, an outlined availability pill with a `→` that nudges right on hover.

5. **Career timeline:** below the slot, width `min(1600px, 100% - 48px)`, sized to read clearly: labels `clamp(13px, 1.35vw, 26px)`, 3px track, 10px segment bars (16px when active), 30px ticks, 28px marker.
   - A 3px track at `rgba(255,255,255,0.12)` runs from the first `from` year to **now** (compute now on the client only, as year + month/12, to avoid a hydration mismatch).
   - Each group (Education, Development, Security, AI agentic) is a segment positioned in %: a 10px rounded bar at `rgba(255,255,255,0.16)` (dashed for education), with its uppercase `segment` label centered above it.
   - Ticks with year labels sit at each distinct start year (2015, 2018, 2020, 2021, 2022, 2023, 2026), plus a magenta "Now" tick at the end.
   - Inside each group bar, every highlight has its own gradient fill spanning its exact years. **Only the active highlight's fill lights** (plus a magenta glow); e.g. only 2020–2021 lights for Noordzee Helikopters. The active group's bar grows to 16px. The active group's label brightens to white and lifts 4px, and stays lit across consecutive highlights in the same group.
   - A white glowing **marker dot** glides (360ms ease-in-out on `left`, **starting at the same moment the company name starts rolling**, so they move together; it holds still between changes) to the middle of the active segment.
   - **Resting state:** once the last company has shown, the timeline fades out quickly (300ms, drifting 12px down and scaling to 0.98) and is hidden (`visibility: hidden`).
   - Under 640px, show only the active group's label (all labels in the resting state).

## Timeline (seconds from mount)
- **0.2–1.3:** avatar pops in (fade, translateY 24px → 0, scale 0.9 → 1, slight overshoot `cubic-bezier(0.34,1.56,0.64,1)`). The ring fades in from 0.4s, then rotates continuously (12s per turn).
- **0.5:** eyebrow fades in. From **0.9**, the first role types on at ~55ms per character.
- **0.8–2.0:** the name rises 16px and un-blurs from 8px to 0.
- **1.4–2.8:** the timeline fades in, the track draws left to right, and segments and ticks stagger in.
- **2.6 onward:** the seven highlights cross-fade **one at a time**: roles in a category with several roles (software development) flash by at **0.85s each**, and roles alone in their category (Education, Security, AI agentic) linger for **1.5s** (marker glides in 360ms, in sync with the company roll), in the same spot. Each one enters with fade + 10px rise and exits with fade + scale 0.98. Its timeline segment lights at the same moment and the marker glides to it.
- **After the last highlight (≈9.6s):** **hold for 1.2s** (`HOLD` constant): the last company rolls out and the company pill fades away, the marker glides on to **"Now"** (now is later than the last role's start), and every timeline role lights at 75% so visitors can read the whole career. Then the company pill and the timeline clear away quickly (300ms). **Only after they are gone** (at +0.4s), the CTA and then the availability pill (0.4s later) **settle in slowly**: ~1.8s each, fading up 28px from scale 0.94 with a strong expo ease-out (`cubic-bezier(0.16,1,0.3,1)`): quick start, very long soft landing, no overshoot. This is the end state, so it should feel calm and unhurried. **The CTA and availability pill stay** (with the avatar, eyebrow and name); this is the resting state.
- **Whole intro:** the content column scales 1 → 1.015 very slowly for a subtle push-in.
- **Role typing:** if `cycleRoles`, hold each role ~1.8s, delete it at ~28ms per character, then type the next one, forever. If `false`, stop on the last role.

Use CSS `@keyframes` for the one-off entrances (avatar, eyebrow, name, timeline draw-in). Drive the highlight sequence with a single `phase` state (-1 before, 0..n-1 per highlight, n = done), advanced by `setTimeout`s from a cumulative schedule starting at 2.6s (0.85s per shared-category role, 1.5s per single-role category) (the final "done" step gets an extra 1.2s `HOLD`). Chips, segments, marker and CTA all react to `phase` via data attributes and CSS transitions, so they stay in sync. The typing hook is the only other JS (a cancellable async loop, cleaned up on unmount). Keep the timings as constants at the top of the file.

## Accessibility and quality
- `prefers-reduced-motion: reduce`: disable all animations, show the final state immediately (first role fully typed; phase = done, so the resting state (no timeline; CTA and availability pill) shows immediately).
- Screen readers: put the full roles list in a visually hidden span and mark the typed text `aria-hidden`. The highlights are a `<ul aria-label="Experience highlights">`. The section has `aria-label="Introduction"`.
- Real `<a>` links, visible `:focus-visible` outline (2px `#e879f9`, offset 4px), hover `scale(1.03)` and press `scale(0.97)` on the CTA.
- Responsive from 360px to 4K using `clamp()`. Chips wrap their content on small screens. The section is `min-height: 100svh`.
- It must be a client component (`'use client'`). No hydration mismatch: the initial typed text is empty on both server and client.
- No layout shift while animating (reserve space for the eyebrow line, the slot and the timeline).

## Deliverables
1. `components/HeroReveal/HeroReveal.tsx` (typed props, sensible defaults)
2. `components/HeroReveal/HeroReveal.module.css`
3. Swap it into the homepage in place of the current hero, keeping the rest of the page and the `#booking` anchor intact.
4. Confirm it with `npm run build` and describe anything you had to adapt to the existing codebase (font variable name, avatar path, etc.).

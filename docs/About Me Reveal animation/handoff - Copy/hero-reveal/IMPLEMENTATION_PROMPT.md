# Prompt: implement the HeroReveal intro on my Next.js site

Copy everything below the line into your coding assistant (Claude Code, Cursor, etc.) from the root of your site's repo.

---

You're working in my personal site's Next.js (App Router) + TypeScript repo. Build a new hero section, `HeroReveal`, that replaces the current top section of the homepage. It plays a short intro animation **once**, about 8.5 seconds, then **stays** on its final state. No looping. Use **only React, CSS Modules and a small amount of JS**. No animation libraries, no video, no canvas.

## Look (match the existing site)
- Background: near-black `#050505`, text `#f4f4f5`, secondary text `#b4b4bb`, muted `#7a7a82`.
- Accent gradient: `linear-gradient(90deg, #a5b4fc 0%, #e879f9 55%, #f472b6 100%)`. Use it as gradient-clipped text on the eyebrow and highlight labels.
- Font: the site's existing monospace (JetBrains Mono or whatever `--font-mono` / `next/font` is already configured). Reuse it; don't add a new font.
- Three large, very soft radial glows (lavender, magenta, pink at ~12–18% alpha) drift slowly behind everything.

## Content (make these props with these defaults)
- `name`: "Stef Vanremoortele"
- `roles`: ["Software developer", "Security specialist", "Agentic orchestrator"]
- `highlights` (`{label, text}[]`):
  1. "AI agentic · 2026" / "IT solutions architect at SIMIT"
  2. "Security · 2023—26" / "Security & compliance engineer at Roularta"
  3. "Development · 2018—23" / "Backend engineer at Zora Robotics, NineID"
- `avatarSrc`: "/avatar_me.png" (use `next/image`, `priority`)
- `ctaLabel`: "Get in contact", `ctaHref`: "#booking"
- `availability`: "Open to software & security roles", `availabilityHref`: "#booking"
- `cycleRoles`: boolean, default `true`

## Layout (centered column, top to bottom)
1. **Avatar:** a circle, `clamp(140px, 14vw, 240px)`, `object-fit: cover`, `object-position: 50% 18%`. It has a 6px conic-gradient ring in the accent colors with a soft magenta glow, separated from the photo by a thin dark gap.
2. **Eyebrow:** an outline "badge" icon (stroke `#c084fc`, 1.5px, slowly rotating), then the uppercase role text in the accent gradient, letter-spacing `0.32em`, followed by a blinking `_` caret.
3. **Name:** `<h1>`, bold, `clamp(40px, 7.1vw, 136px)`, `text-wrap: balance`.
4. **Slot area:** the highlights and the final actions share **one grid cell** (`grid-area: 1/1`), so they swap in place without shifting the layout.
   - **Highlight chip:** a pill with a 1px `rgba(255,255,255,0.14)` border and `rgba(255,255,255,0.03)` fill. Inside: a small violet dot with a soft halo, the uppercase gradient label, a faint `/` separator, and the text in `#f4f4f5`.
   - **Final actions (a flex row that wraps):**
     - A solid gradient pill button "Get in contact" (`#c4b5fd → #e879f9 → #f9a8d4`), dark `#111` bold text, with a magenta glow that pulses gently.
     - Next to it, an outlined availability pill with a `→` that nudges right on hover.

## Timeline (seconds from mount)
- **0.2–1.3:** avatar pops in (fade, translateY 24px → 0, scale 0.9 → 1, slight overshoot `cubic-bezier(0.34,1.56,0.64,1)`). The ring fades in from 0.4s, then rotates continuously (12s per turn).
- **0.5:** eyebrow fades in. From **0.9**, the first role types on at ~55ms per character.
- **0.8–2.0:** the name rises 16px and un-blurs from 8px to 0.
- **2.6 onward:** the three highlights cross-fade **one at a time, ~1.67s each**, in the same spot. Each one enters with fade + 10px rise and exits with fade + scale 0.98.
- **After the last highlight (≈7.6s):** the CTA pops in, the availability pill slides in 0.3s later, and **both stay**. This is the resting state.
- **Whole intro:** the content column scales 1 → 1.015 very slowly for a subtle push-in.
- **Role typing:** if `cycleRoles`, hold each role ~1.8s, delete it at ~28ms per character, then type the next one, forever. If `false`, stop on the last role.

Do the choreography with CSS `@keyframes` and `animation-delay` / `animation-fill-mode: both`. Pass per-chip delays through inline `style`, and pass the CTA delay as a CSS variable computed from the number of highlights. The only JS is the typing hook (a cancellable async loop with `setTimeout`, cleaned up on unmount).

## Accessibility and quality
- `prefers-reduced-motion: reduce`: disable all animations, show the final state immediately (first role, fully typed; no highlights cycling; CTA visible).
- Screen readers: put the full roles list in a visually hidden span and mark the typed text `aria-hidden`. The highlights are a `<ul aria-label="Experience highlights">`. The section has `aria-label="Introduction"`.
- Real `<a>` links, visible `:focus-visible` outline (2px `#e879f9`, offset 4px), hover `scale(1.03)` and press `scale(0.97)` on the CTA.
- Responsive from 360px to 4K using `clamp()`. Chips wrap their content on small screens. The section is `min-height: 100svh`.
- It must be a client component (`'use client'`). No hydration mismatch: the initial typed text is empty on both server and client.
- No layout shift while animating (reserve space for the eyebrow line and the slot).

## Deliverables
1. `components/HeroReveal/HeroReveal.tsx` (typed props, sensible defaults)
2. `components/HeroReveal/HeroReveal.module.css`
3. Swap it into the homepage in place of the current hero, keeping the rest of the page and the `#booking` anchor intact.
4. Confirm it with `npm run build` and describe anything you had to adapt to the existing codebase (font variable name, avatar path, etc.).

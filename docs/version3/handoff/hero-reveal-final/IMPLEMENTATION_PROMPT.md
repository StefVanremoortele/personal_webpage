# Prompt: implement the final HeroReveal hero (full version)

Paste everything below the line into your coding assistant (Claude Code, Cursor, …) from the root of your Next.js repo. Copy the folder contents into the repo first:

- `components/HeroReveal/HeroReveal.tsx` and `HeroReveal.module.css` are the finished reference implementation.
- `public/avatar_me.png` is the avatar. Skip it if your site already serves `/avatar_me.png`.

---

Replace my site's homepage hero with the `HeroReveal` component in `components/HeroReveal/`. Those two files are the **source of truth**: use them as-is and adapt only what my codebase needs (font variable, import paths, section IDs). If anything below conflicts with the files, the files win. Remove any earlier HeroReveal version, along with the old availability pill and its props.

## Constraints
- Next.js App Router + TypeScript, `'use client'` component, CSS Modules only. No animation libraries, video or canvas.
- No hydration mismatch: "now" on the timeline and the typed text are resolved on the client only. Initial render is identical on server and client.
- Reuse the site's existing monospace font through `var(--font-mono)`. With `next/font`, configure JetBrains Mono (or the current mono) with `variable: '--font-mono'`.
- `prefers-reduced-motion: reduce`: jump straight to the resting state (see §7) with no motion.
- Keep the `#booking` anchor; "Get in contact" links to it.

## 1. Look
- **Colors:** near-black `#050505` background, text `#f4f4f5`, secondary `#b4b4bb`, muted `#7a7a82`. Accent gradient `#a5b4fc → #e879f9 → #f472b6`. CTA gradient `#c4b5fd → #e879f9 → #f9a8d4` with `#111` text.
- **Glow:** three huge, very soft radial glows (lavender, magenta, pink at 12–18% alpha) drift slowly behind everything.
- **Layout:** centered column — avatar → role eyebrow → name → company pill → timeline row (the CTA appears in that row at the end). The section is `min-height: 100svh`.

## 2. Avatar
- A round photo (`next/image`, `priority`, `object-position: 50% 18%`) inside a 6px conic-gradient ring in the accent colors with a soft magenta glow. A thin dark gap separates ring and photo.
- **Intro spin:** as the avatar pops in, the ring's colors spin **1.5 turns (540°) over 3.2s** with an ease-out (`introSpin`, on `transform`). They then settle into a slow drift (`spin 14s linear infinite`, on `rotate`). The two properties compose.
- **Mid-timeline (subtle):** when `phase >= floor(count/2)`, set `data-glow`. The ring (inside a `.ringTurn` wrapper) makes **one extra 360° turn** (2.7s ease-in-out), and a soft radial bloom swells behind the avatar and fades.
- **End burst:** when done, set `data-burst`. It plays once, together with the CTA morph, starting at +300ms:
  - **Corona:** a large blurred conic aura in the ring colors swirls up (scale 0.75 → 1.25, rotate 0 → 300°) and fades over 2.7s.
  - **Ring flash:** a white flash on the ring band.
  - **Spark burst:** 10 sparks (every 36°, alternating white/magenta 8px and lavender 6px) shoot outward from the ring edge, fading and shrinking over 1.5s with a tiny stagger.

## 3. Role eyebrow
- **Style:** uppercase gradient text, `letter-spacing: 0.32em`, with a blinking `_` caret.
- **Typing:** each role types on (~55ms per char), holds ~2.4s, deletes (~28ms per char) and moves to the next, forever (`cycleRoles`, default true).
- **Icons:** each role gets its own matching outline icon (Lucide geometry, 1.5px stroke `#c084fc`), chosen by keyword:
  - "secur" → shield-check
  - "agent", "orchestr" or "ai" → network
  - anything else → code-xml (`</>`)
- The icon eases in as its role starts typing (fade, 6px rise, scale 0.8 → 1, blur 3px → 0) and disappears while the role is erased.
- A visually hidden span lists all roles for screen readers; the typed text is `aria-hidden`.

## 4. Name
`<h1>`, bold, `clamp(40px, 7.1vw, 136px)`, `text-wrap: balance`. It rises 16px and un-blurs from 8px to 0 (0.8s → 2.0s).

## 5. Experience data (defaults, chronological)
`{ label, text (company), segment, from, to?, dashed? }`. Consecutive items with the same `segment` share one timeline group.
1. Education · 2015—18 — **HOWEST Bruges** — Education — 2015–2018 — dashed
2. Software development · 2018—20 — **Easypost** — Software development — 2018–2020
3. Software development · 2020—21 — **Noordzee Helikopters Vlaanderen** — Software development — 2020–2021
4. Software development · 2021—22 — **NineID** — Software development — 2021–2022
5. Software development · 2022—23 — **Zora Robotics** — Software development — 2022–2023
6. Security · 2023—26 — **Roularta Media Group** — Security — 2023–2026
7. AI agentic · 2026 — **SIMIT** — AI agentic — 2026–now

## 6. Company pill + timeline (the main sequence)
**Phase state.** A single `phase` state drives everything: -1 before, 0..n-1 per item, n = done. Its schedule starts at `HIGHLIGHTS_START = 2600`ms. Items whose segment is shared (software development) show for `HIGHLIGHT_SPAN = 850`ms; items alone in their segment show for `LONG_SPAN = 1500`ms. After the last item comes a `HOLD = 1200`ms summary (`data-summary`), then done.

**Company pill.** One persistent pill (1px `rgba(255,255,255,.14)` border, `rgba(255,255,255,.03)` fill, violet dot) shows **only the company name**, bold white at 1.4× pill size.
- **Letter roll (split-flap):** on change, old letters roll up and out (300ms) and new letters roll up in from below (360ms ease-out), with a 14ms per-letter stagger.
- **Width morph:** the text window is `calc(var(--len) * 1ch)` and transitions over 360ms.
- **On each change:** the dot glows briefly and a faint sheen sweeps across the pill.
- **Entrance:** over 1s it fades in, rises 16px, grows from 0.96 and un-blurs from 6px. The first name rolls in ~350ms later.
- **Exit:** during the summary hold, the last company rolls out and the pill fades.
- **Accessibility:** a visually hidden `<ul>` lists `label: company` for every item.

**Timeline (desktop, horizontal).** Width `min(1600px, 100% - 48px)`, labels `clamp(13px, 1.35vw, 26px)`. It runs 2015 → **now**.
- **Track and groups:** a 3px track. Group bars are 10px (16px when active), with Education dashed and category labels above them.
- **Fills:** each item has its own gradient fill over its exact years (hairline gaps between neighbors). **Only the active item's fill lights**, with a glow. The active group's label brightens and stays lit across consecutive items.
- **Ticks:** year ticks at 2015, 2018, 2020, 2021, 2022, 2023, 2026, plus a magenta "Now".
- **Marker:** a 28px white glowing marker holds on the active item's midpoint. It glides to the next item in the same 360ms window as the letter roll.
- **Entrance:** fades in at 1.4s, the track draws left to right, and segments and ticks stagger in.
- **During the summary hold:** all fills light at 75%, and the marker glides on to **Now**.

## 7. Ending
1. **Morph:** the timeline collapses toward its center (`scale(0.15, 0.5)`, 800ms ease-in-out, blurring and fading). Overlapping that at +0.25s, **"Get in contact" expands out of the same spot, on the same line** (`morphIn`: from `scale(0.2, 0.55)` + blur 6px to 1, 1.6s expo ease-out). Timeline and CTA share one grid cell (`.endRow`).
2. **Avatar end burst** (§2).
3. **CTA loops,** starting ~1.4s after it lands:
   - a conic light comet rotating inside a 3px ring around the button (3.2s)
   - a gentle 5px float over a glow ellipse (3.6s)
   - a white sheen sweep at the end of each float cycle
   - a soft glow pulse
4. **Magnetic pull** (desktop, `(hover: hover) and (pointer: fine)` only): within 220px the CTA leans toward the cursor (`--mx = dx·0.2`, `--my = dy·0.28`, 380ms ease-out), its glow brightens, and a → slides out after the label. It is rAF-throttled and writes CSS vars directly, with no re-renders.
5. **Resting state (forever):** avatar, eyebrow (still cycling), name and "Get in contact". No timeline, no company pill, no fade-out.

## 8. Mobile (≤ 640px)
Same component, restyled with a media query only:
- **Vertical timeline,** 2015 at the top and Now at the bottom, 400px tall. All timeline positions are CSS vars `--a`/`--w` (%) that map to `left`/`width` on desktop and `top`/`height` on mobile.
- **Labels:** years right-aligned left of the track; category labels right of the bars.
- **Bars and marker:** gradient at 180°; the marker glides on `top`.
- **Company pill** sits **below** the timeline. Its font shrinks so the longest name fits: `min(1.4em, calc((100vw - 120px) / (var(--len) * 0.6)))`.
- **CTA:** the timeline collapses toward its vertical center (`scale(0.55, 0.15)`), and the CTA morphs out at that spot.

## 9. Deliverables
1. `components/HeroReveal/HeroReveal.tsx` and `HeroReveal.module.css` (from this package).
2. `public/avatar_me.png` (if not already present).
3. Homepage: replace the current hero with `<HeroReveal />`, keeping the rest of the page and the `#booking` anchor.
4. Run `npm run build`, then report anything you adapted (font variable, avatar path, anchor IDs).
5. Sanity-check in the browser at 1440px and 390px wide, and with reduced motion on.

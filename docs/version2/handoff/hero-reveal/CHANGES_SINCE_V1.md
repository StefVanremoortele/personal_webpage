# Prompt: update the HeroReveal hero (changes since v1)

Paste everything below the line into your coding assistant from the root of your site's repo. It assumes the **first** HeroReveal version is already implemented: avatar, typed roles, name, three highlight chips cross-fading, then "Get in contact" and the availability pill. The attached `HeroReveal.tsx` and `HeroReveal.module.css` are the finished reference; use them as the source of truth where this text is ambiguous.

---

Update the existing `HeroReveal` component (`components/HeroReveal/HeroReveal.tsx` + `.module.css`) with the changes below. Keep everything else as it is (avatar, eyebrow typing, name, glow, colors, font, reduced-motion handling). It must still be pure React + CSS Modules with no new dependencies, still a client component, and still free of hydration mismatches.

## 1. New data model and content
Replace the `Highlight` type and defaults:

```ts
type Highlight = {
  label: string;    // screen-reader context, e.g. "Security · 2023—26"
  text: string;     // company name shown in the pill
  segment: string;  // timeline category; consecutive items with the same segment form one group
  from: number;     // start year
  to?: number;      // end year; omit = now
  dashed?: boolean; // dashed bar (education)
};
```

Defaults, in chronological order:
1. Education · 2015—18 / "HOWEST Bruges" / segment "Education" / 2015–2018 / dashed
2. Software development · 2018—20 / "Easypost" / "Software development" / 2018–2020
3. Software development · 2020—21 / "Noordzee Helikopters Vlaanderen" / "Software development" / 2020–2021
4. Software development · 2021—22 / "NineID" / "Software development" / 2021–2022
5. Software development · 2022—23 / "Zora Robotics" / "Software development" / 2022–2023
6. Security · 2023—26 / "Roularta Media Group" / "Security" / 2023–2026
7. AI agentic · 2026 / "SIMIT" / "AI agentic" / 2026–now

## 2. Company pill: one persistent pill, not one chip per item
- Remove the per-highlight chips. Render **one** pill (same style as the availability chip: 1px `rgba(255,255,255,0.14)` border, `rgba(255,255,255,0.03)` fill) with a violet dot and **only the company name**, bold white at 1.4× the pill font size. No job titles, no category or years in the pill.
- **Letter roll (split-flap):** each company is a row of per-letter spans (`--k` = index). When the company changes, the old letters roll up and out (translateY -100%, blur 3px, fade; 300ms ease-in-out). The new letters roll up in from below (translateY 100% → 0, blur 3px → 0; 360ms ease-out). Stagger letters by `calc(var(--k) * 14ms)`.
- **Width morph:** the text window is `width: calc(var(--len) * 1ch)` (monospace) with `transition: width 360ms` ease-in-out, so the pill smoothly grows or shrinks between names.
- **On each change:** the dot does a quick glow "beat" (600ms), and a faint magenta sheen sweeps across the pill (800ms).
- **Entrance:** over 1s the pill fades in, rises 16px, grows from scale 0.96 and un-blurs from 6px (long ease-out, no overshoot). The first company's letters roll in about 350ms later.
- **Exit:** when the timeline summary starts (see §5), the last company rolls out and the pill fades away.
- **Accessibility:** mark the roller `aria-hidden`, and add a visually hidden `<ul aria-label="Experience highlights">` listing `label: text` for every item.

## 3. Horizontal career timeline (new, below the pill)
- **Size:** width `min(1600px, 100% - 48px)`. Font `clamp(13px, 1.35vw, 26px)`, 3px track, 10px segment bars (16px when active), 30px ticks, 28px marker. It must be clearly readable.
- **Scale:** it runs from the earliest `from` year to **now**. Compute now on the client only, as `year + month/12`.
- **Groups:** consecutive highlights with the same `segment` form one group bar (Education is dashed), with the category label centered above it. Labels read Education, Software development, Security, AI agentic.
- **Fills:** inside each group bar, every highlight has its own gradient fill (`#a5b4fc → #e879f9 → #f472b6`) over its exact years, separated by a hairline (`box-shadow: 0 0 0 1px var(--bg)`). **Only the active highlight's fill lights**, with a magenta glow.
- **Active group:** the bar grows to 16px, and the label brightens to white and lifts 4px. It stays lit across consecutive items in the same group; do not swap the label for the company.
- **Ticks:** year ticks at each distinct start year (2015, 2018, 2020, 2021, 2022, 2023, 2026), plus a magenta "Now" tick at the end.
- **Marker:** a white glowing dot that **holds still** on the middle of the active highlight's range. When the company changes, it glides to the next role in the **same 360ms window** as the letter roll, so both move together.
- **Entrance:** fades in at 1.4s, the track draws left to right (scaleX, 1.6–2.8s), and segments and ticks stagger in.
- **Mobile:** under 640px, show only the active group's label.

## 4. Timing (single `phase` state drives everything)
- `phase`: -1 before the highlights, 0..n-1 while item i shows, n = done. Build a cumulative schedule starting at `HIGHLIGHTS_START = 2600`ms:
  - Items whose `segment` is shared by more than one item (software development) show for `HIGHLIGHT_SPAN = 850`ms each.
  - Items alone in their segment (Education, Security, AI agentic) show for `LONG_SPAN = 1500`ms.
- The pill, fills, labels and marker all react to `phase` through data attributes and CSS transitions.

## 5. Ending (rewritten)
When the last item's slot ends:
1. **Summary hold (`HOLD = 1200`ms):** set `data-summary` on the section. The company pill rolls out and fades, every timeline fill lights at 75% with white labels, and the marker glides on to **"Now"** (now is later than the last role's start).
2. **Clear:** set `phase = n` (`data-done`). The timeline fades out quickly (300ms, drifting 12px down and scaling to 0.98), then `visibility: hidden`.
3. **Contact pills (only after the timeline is gone):**
   - At +0.4s, "Get in contact" settles in: 1.8s, fading up 28px from scale 0.94 with `cubic-bezier(0.16,1,0.3,1)` (expo ease-out), no overshoot. Its glow pulse starts after it lands.
   - The availability pill follows 0.35s later with the same easing.
4. **Resting state (stays forever):** avatar, eyebrow, name, "Get in contact" and the availability pill. No timeline, no company pill, **no fade-out**.

## 6. Other small changes
- `prefers-reduced-motion`: jump straight to the resting state in §5.4.
- Keep all timings as named constants at the top of `HeroReveal.tsx` (`HIGHLIGHTS_START`, `HIGHLIGHT_SPAN`, `LONG_SPAN`, `HOLD`).
- Run `npm run build`, then report anything you had to adapt (font variable, avatar path, section IDs).

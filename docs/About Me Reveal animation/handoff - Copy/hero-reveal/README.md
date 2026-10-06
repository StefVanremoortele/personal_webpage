# HeroReveal

A Next.js hero that plays the intro once (≈8.5s), then stays on the final frame: avatar, role label, name, "Get in contact" and availability pill. Pure CSS animations plus a small typing hook. No dependencies.

## Install

1. Copy `HeroReveal.tsx` and `HeroReveal.module.css` into e.g. `components/HeroReveal/`.
2. Your avatar is already at `/public/avatar_me.png`. Otherwise pass `avatarSrc`.
3. Use it:

```tsx
import HeroReveal from '@/components/HeroReveal/HeroReveal';

export default function Page() {
  return <HeroReveal />;
}
```

## Props (all optional)

- `name` — heading text
- `roles` — string[] typed into the eyebrow
- `cycleRoles` — keep cycling roles after the intro (default `true`; `false` stops on the last one)
- `highlights` — `{ label, text }[]`, shown one at a time during the intro
- `avatarSrc`
- `ctaLabel` and `ctaHref` (default `#booking`)
- `availability` and `availabilityHref`

## Notes

- **Font:** uses `var(--font-mono)` if it's defined. With `next/font`, set `variable: '--font-mono'` on JetBrains Mono (or your current mono) and it's picked up automatically.
- **Reduced motion:** users with reduced motion turned on see the final state straight away.
- **Timing:** change `HIGHLIGHTS_START` / `HIGHLIGHT_SPAN` in the `.tsx`. The CTA delay follows the number of highlights automatically.
- **Layout:** it fills the viewport (`min-height: 100svh`). Change `.hero` if it sits inside a larger layout.

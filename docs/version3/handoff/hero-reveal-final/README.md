# HeroReveal — final package

- `IMPLEMENTATION_PROMPT.md`: paste into your coding assistant.
- `components/HeroReveal/HeroReveal.tsx` and `HeroReveal.module.css`: the reference implementation, with no dependencies beyond React and Next.
- `public/avatar_me.png`: your avatar.

Tunable constants at the top of `HeroReveal.tsx`:
- `HIGHLIGHTS_START`: when the experience sequence starts
- `HIGHLIGHT_SPAN`: software development roles
- `LONG_SPAN`: single-role categories
- `HOLD`: the summary pause before the CTA

The intro sequence timing comes from the "About Me Reveal v3" (desktop) and "About Me Reveal Mobile" previews.

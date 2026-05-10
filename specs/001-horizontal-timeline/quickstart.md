# Quickstart: Scroll-Collapsing Experience Timeline

## Prerequisites

- Node dependencies installed with `npm install`.
- Current branch: `001-horizontal-timeline`.
- Feature spec and plan available under `specs/001-horizontal-timeline/`.

## Implementation Notes

- Use the existing Experience content from `content/site.ts`.
- Keep the feature scoped to the public Experience section.
- Use the active-entry rule from clarifications: only the current entry shows full details; inactive entries show summary only.
- Preserve static fallback behavior for reduced-motion users.
- Use a stacked or compressed timeline on narrow screens.

## Local Verification

1. Run static checks:

   ```bash
   npm run lint
   npm run build
   ```

2. Start the app:

   ```bash
   npm run dev
   ```

3. In a browser, verify:

   - Desktop scroll through Experience progressively builds the timeline.
   - The final timeline contains every experience entry with period, company, and job title.
   - Scrolling backward restores the currently active entry's detailed content.
   - Narrow viewport uses a stacked or compressed timeline without requiring precise horizontal scrolling.
   - Reduced-motion mode shows a static timeline summary and readable entries without collapse animation.
   - The timeline does not overlap the Projects or Contact sections after leaving Experience.

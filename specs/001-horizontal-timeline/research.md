# Research: Scroll-Collapsing Experience Timeline

## Decision: Implement the interaction inside the existing Experience section

**Rationale**: The feature affects one public page section and uses the existing `experience` content array. Keeping behavior in `components/Experience.tsx` avoids introducing routing, persistence, or cross-page abstractions.

**Alternatives considered**: A separate timeline route was rejected because the requested behavior is scroll-based within the current page. Moving content to a new data store was rejected because the current static content already contains all required fields.

## Decision: Use a client-side component boundary for scroll progress

**Rationale**: Scroll progress, reduced-motion preference, and active-entry state depend on browser APIs. A client-side Experience interaction layer can consume the static data while keeping the rest of the page structure unchanged.

**Alternatives considered**: CSS-only scroll behavior was considered, but it would make active-entry state and reduced-motion branching harder to keep testable. A global scroll manager was rejected as unnecessary for one section.

## Decision: Use existing framer-motion dependency for scroll-linked values

**Rationale**: `framer-motion` is already installed and is designed for scroll progress, transforms, and reduced-motion handling. Reusing it avoids adding a new animation dependency.

**Alternatives considered**: Hand-written scroll listeners were rejected because they add cleanup/throttling complexity. Native CSS scroll-linked animations were rejected because support and fallback handling would be less predictable across the project target browsers.

## Decision: Keep active-entry details and summarize inactive entries

**Rationale**: This matches the clarified requirement and reduces vertical length while keeping detailed bullets, highlights, and references visible for the entry currently being reviewed.

**Alternatives considered**: Click-to-expand timeline items were rejected by clarification. Showing all details after the timeline was rejected because it would reintroduce the long-list scrolling problem.

## Decision: Provide static accessible fallbacks

**Rationale**: Narrow screens and reduced-motion users must receive the same career information without needing precise horizontal scrolling or collapse animation. The plan uses a stacked/compressed timeline on narrow screens and a static summary plus readable entries when reduced motion is preferred.

**Alternatives considered**: Always-horizontal mobile timeline was rejected because it risks text overflow and difficult touch scrolling. Disabling the timeline entirely for reduced motion was rejected because the spec requires equivalent timeline information.

## Decision: Verify with lint, production build, and browser checks

**Rationale**: The repo already provides `npm run lint` and `npm run build`. Because the feature is visual and scroll-driven, final validation also needs browser checks for desktop, mobile viewport, keyboard/page scroll, and reduced-motion behavior.

**Alternatives considered**: Unit-only verification was rejected because it cannot validate sticky positioning, scroll progress, or layout overlap. Adding a new browser automation dependency is deferred unless implementation testing shows manual checks are insufficient.

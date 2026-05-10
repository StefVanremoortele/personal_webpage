# Implementation Plan: Scroll-Collapsing Experience Timeline

**Branch**: `001-horizontal-timeline` | **Date**: 2026-05-07 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `specs/001-horizontal-timeline/spec.md`

**Note**: This template is filled in by the `/speckit-plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Replace the current long vertical Experience list with a scroll-aware experience section: detailed content stays available for the active entry, inactive entries collapse into summaries, and a sticky timeline grows as visitors scroll. The implementation will keep the existing `content/site.ts` experience data as the source of truth, add a client-side interaction layer for scroll progress and reduced-motion handling, and preserve a static readable fallback for mobile and reduced-motion contexts.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2 App Router  
**Primary Dependencies**: Next.js, React, Tailwind CSS 4, framer-motion 12, existing portfolio content module  
**Storage**: N/A; uses existing static experience data from `content/site.ts`  
**Testing**: `npm run lint`, `npm run build`, browser verification in `npm run dev` for desktop, mobile/narrow viewport, keyboard scroll, and reduced-motion behavior  
**Target Platform**: Static/public portfolio website served through Next.js output, targeting Next.js modern browser baseline  
**Project Type**: Single-project frontend web application  
**Performance Goals**: Preserve smooth scrolling at common desktop and mobile viewport sizes; avoid layout overlap; reduce vertical scroll required to reach the complete experience overview by at least 30% versus the current full-detail list  
**Constraints**: No new persistent data; timeline must stay scoped to the Experience section; active entry shows details while inactive entries show summary only; narrow screens use stacked/compressed timeline; reduced-motion users receive static timeline summary and readable entries without collapse animation  
**Scale/Scope**: One public landing page section, currently 6 experience entries, designed to tolerate additional entries from the existing content array

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution currently contains placeholder text only and defines no enforceable gates. No constitution violations are identified for this plan.

Post-design re-check: Phase 0 and Phase 1 artifacts keep the implementation scoped to the existing frontend app, do not add persistence or external services, and preserve the specified accessibility fallbacks. No constitution violations are identified.

## Project Structure

### Documentation (this feature)

```text
specs/001-horizontal-timeline/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── experience-timeline.md
└── tasks.md
```

### Source Code (repository root)

```text
app/
├── globals.css
└── page.tsx

components/
└── Experience.tsx

content/
└── site.ts
```

**Structure Decision**: Implement in the existing single Next.js app. Keep `content/site.ts` as the data source, update `components/Experience.tsx` to own the Experience-section UI behavior, and add only minimal global CSS if needed for motion/layout support.

## Complexity Tracking

No constitution violations or additional architectural complexity require justification.

# Tasks: Scroll-Collapsing Experience Timeline

**Input**: Design documents from `specs/001-horizontal-timeline/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Formal automated test tasks are not included because tests are optional and no TDD requirement was requested. Verification tasks are included in the final phase.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the current app structure and local documentation needed before editing the Experience section.

- [X] T001 Read the local Next.js App Router, accessibility, and supported-browser docs under node_modules/next/dist/docs/
- [X] T002 Inspect the existing Experience section implementation in components/Experience.tsx
- [X] T003 [P] Inspect existing experience content fields in content/site.ts
- [X] T004 [P] Inspect existing global styling tokens and Tailwind setup in app/globals.css

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Prepare shared data derivation and client-side interaction boundaries used by every user story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T005 Convert components/Experience.tsx to a client component that can use browser scroll, viewport, and motion-preference state
- [X] T006 Create timeline item derivation from the existing experience array inside components/Experience.tsx
- [X] T007 Create reusable period, company, role, active, and collapsed rendering helpers inside components/Experience.tsx
- [X] T008 Add baseline responsive section layout classes in components/Experience.tsx that keep the Experience section scoped and prevent overlap with following sections

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Compress Experience While Scrolling (Priority: P1) MVP

**Goal**: Experience entries progressively condense during scrolling, with one active entry showing full detail and inactive entries summarized.

**Independent Test**: Scroll from the start of the Experience section through the first several entries and confirm read entries collapse while a timeline overview begins to form.

### Implementation for User Story 1

- [X] T009 [US1] Add an Experience section scroll container and sticky timeline area in components/Experience.tsx
- [X] T010 [US1] Implement section scroll progress tracking for the Experience section in components/Experience.tsx
- [X] T011 [US1] Calculate activeIndex and completedCount from scroll progress in components/Experience.tsx
- [X] T012 [US1] Render the active experience entry with bullets, highlight, and reference details in components/Experience.tsx
- [X] T013 [US1] Render inactive collapsed entries with period, company, and job title summary only in components/Experience.tsx
- [X] T014 [US1] Animate or transition entry collapse and expansion in components/Experience.tsx without hiding the active entry before it is readable
- [X] T015 [US1] Support backward scrolling so a reactivated entry restores its detailed content in components/Experience.tsx

**Checkpoint**: User Story 1 should be fully functional and testable independently.

---

## Phase 4: User Story 2 - Review Complete Career Timeline (Priority: P2)

**Goal**: By the end of the Experience section, visitors see a complete timeline containing every period, company, and job title.

**Independent Test**: Scroll to the end of the Experience section and verify every existing experience appears in the final timeline with period, company, and job title.

### Implementation for User Story 2

- [X] T016 [US2] Render the sticky timeline summary from derived timeline items in components/Experience.tsx
- [X] T017 [US2] Implement the growing timeline progress indicator based on completedCount in components/Experience.tsx
- [X] T018 [US2] Ensure all six current companies render in final timeline order in components/Experience.tsx
- [X] T019 [US2] Ensure each final timeline item displays combined period, company name, and job title in components/Experience.tsx
- [X] T020 [US2] Tune section height and spacing in components/Experience.tsx so the complete timeline is reached by the final experience item
- [X] T021 [US2] Prevent the sticky timeline from overlapping Projects or Contact sections after leaving Experience in components/Experience.tsx

**Checkpoint**: User Stories 1 and 2 should both work independently.

---

## Phase 5: User Story 3 - Preserve Accessible Detail (Priority: P3)

**Goal**: Narrow screens, keyboard/page scrolling, and reduced-motion preferences preserve equivalent readable experience information.

**Independent Test**: Review the Experience section on narrow screens and with reduced-motion preferences, confirming the same entries and summary information remain available.

### Implementation for User Story 3

- [X] T022 [US3] Add reduced-motion detection and static fallback rendering in components/Experience.tsx
- [X] T023 [US3] Render static timeline summary plus readable entries without collapse animation for reduced-motion mode in components/Experience.tsx
- [X] T024 [US3] Add narrow-screen stacked or compressed timeline presentation in components/Experience.tsx
- [X] T025 [US3] Ensure timeline labels wrap or compress cleanly for long company names and job titles in components/Experience.tsx
- [X] T026 [US3] Preserve semantic list structure and keyboard/page-scroll behavior without focus or scroll traps in components/Experience.tsx
- [X] T027 [US3] Add any required reduced-motion or responsive utility styles in app/globals.css

**Checkpoint**: All user stories should now be independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the feature against the contract, quickstart, and production build.

- [X] T028 Verify UI contract acceptance checks from specs/001-horizontal-timeline/contracts/experience-timeline.md against components/Experience.tsx
- [X] T029 Run npm run lint from the repository root
- [X] T030 Run npm run build from the repository root
- [X] T031 Start npm run dev and verify desktop scroll behavior from specs/001-horizontal-timeline/quickstart.md
- [X] T032 Verify narrow viewport stacked or compressed timeline behavior from specs/001-horizontal-timeline/quickstart.md
- [X] T033 Verify reduced-motion static timeline behavior from specs/001-horizontal-timeline/quickstart.md
- [X] T034 Verify the Experience timeline does not overlap the Projects or Contact sections in app/page.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP scope.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and builds on the shared timeline state from US1.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and should be integrated after the baseline scroll/timeline behavior exists.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - no dependency on US2 or US3.
- **User Story 2 (P2)**: Can start after Foundational, but is most efficient after US1 because it uses activeIndex and completedCount.
- **User Story 3 (P3)**: Can start after Foundational, but final validation depends on US1 and US2 behavior existing.

### Within Each User Story

- Derive state before rendering state-dependent UI.
- Render active/detail and inactive/summary states before tuning animation.
- Implement desktop behavior before final narrow-screen and reduced-motion fallbacks.
- Complete each checkpoint before moving to the next priority.

### Parallel Opportunities

- T003 and T004 can run in parallel after T001.
- US2 final timeline rendering tasks T018 and T019 can be reviewed in parallel after T016.
- US3 reduced-motion tasks T022 and T023 are separate from narrow-screen tasks T024 and T025, but both edit components/Experience.tsx and should be coordinated if worked concurrently.
- Final verification tasks T031, T032, and T033 can run in parallel after T029 and T030 pass.

---

## Parallel Example: User Story 2

```bash
Task: "Ensure all six current companies render in final timeline order in components/Experience.tsx"
Task: "Ensure each final timeline item displays combined period, company name, and job title in components/Experience.tsx"
```

---

## Parallel Example: Polish

```bash
Task: "Start npm run dev and verify desktop scroll behavior from specs/001-horizontal-timeline/quickstart.md"
Task: "Verify narrow viewport stacked or compressed timeline behavior from specs/001-horizontal-timeline/quickstart.md"
Task: "Verify reduced-motion static timeline behavior from specs/001-horizontal-timeline/quickstart.md"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate that entries collapse into summaries while the active entry remains detailed.

### Incremental Delivery

1. Add User Story 1 for the core scroll-compression interaction.
2. Add User Story 2 for the complete final timeline.
3. Add User Story 3 for narrow-screen, keyboard, and reduced-motion coverage.
4. Run all polish verification tasks before considering the feature complete.

### Single-Developer Strategy

Work sequentially in task order to avoid conflicts in components/Experience.tsx, then run the final validation commands and browser checks.

---

## Notes

- [P] tasks use different files or are verification-only and can run without conflicting edits.
- [US1], [US2], and [US3] labels map to user stories in specs/001-horizontal-timeline/spec.md.
- Avoid adding new data stores or changing content/site.ts unless the existing fields are insufficient.
- Keep the timeline sticky behavior scoped to the Experience section, not globally fixed to the viewport outside that section.

# UI Contract: Experience Timeline

## Scope

Defines the observable behavior for the public Experience section. This is a UI contract rather than a network API contract.

## Inputs

- Existing `experience` entries from `content/site.ts`.
- Visitor scroll position through the Experience section.
- Viewport width category: standard or narrow.
- Motion preference: standard motion or reduced motion.

## Outputs

- A visible Experience heading and scoped timeline summary.
- One active experience entry with full detail during animated scroll mode.
- Inactive experience entries represented by summary information only.
- Completed timeline containing every experience entry's period, company, and job title.
- Static timeline summary and readable entries when reduced motion is preferred.

## Required Behaviors

- The timeline becomes visible while the visitor is browsing the Experience section.
- The timeline grows as entries are passed during scrolling.
- The active entry shows bullets, highlights, and references where present.
- Inactive collapsed entries show period, company, and job title summary only.
- Scrolling backward updates the active entry and restores its detail.
- Narrow screens use a stacked or compressed timeline presentation.
- Reduced-motion mode disables collapse animation and shows static equivalent content.
- The timeline remains scoped to the Experience section and does not obscure following sections.

## Acceptance Checks

- All 6 current entries are represented: SIMIT, Roularta Media Group, Zora Robotics, NineID, Noordzee Helikopters Vlaanderen, and Easypost.
- Each timeline item exposes period, company, and job title.
- The page remains readable at desktop and narrow viewport sizes.
- Keyboard/page scroll moves through the section without trapping focus or scroll.
- Reduced-motion preference shows the timeline summary without animated collapse.

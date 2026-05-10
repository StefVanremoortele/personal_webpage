# Feature Specification: Scroll-Collapsing Experience Timeline

**Feature Branch**: `001-horizontal-timeline`  
**Created**: 2026-05-07  
**Status**: Draft  
**Input**: User description: "I would like to implement a new feature. Currently, when scrolling through the webpage, the scrolling takes too long, especially starting from my experiences. It's a long list to scroll through. I would like, when arriving at the experiences section, each entry to collapse when scrolling, generating a full horizontal timeline by the time we reach the last experience item. So above the experiences there should be a fixed element that increases/compounds when scrolling down and extends the horizontal timeline. When having reached the end of the experiences, I want to see a horizontal timeline presenting me the period and company I worked for, including my job titles"

## Clarifications

### Session 2026-05-07

- Q: How should visitors retain access to detailed experience content after entries collapse? → A: Keep only the currently active entry expanded; collapsed entries show summary only.
- Q: How should the timeline behave on narrow screens? → A: Use a stacked or compressed timeline on narrow screens.
- Q: What should visitors with reduced-motion preferences see? → A: Show a static timeline summary and readable entries without collapse animation.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Compress Experience While Scrolling (Priority: P1)

As a portfolio visitor, I want the Experience section to progressively condense as I scroll so I can move through a long career history without feeling stuck in a long vertical list.

**Why this priority**: This directly addresses the current problem: the Experience section takes too long to scroll through.

**Independent Test**: Can be tested by scrolling from the start of the Experience section through the first several entries and confirming that read entries collapse while a timeline overview begins to form.

**Acceptance Scenarios**:

1. **Given** a visitor reaches the Experience section, **When** they scroll down through the first experience entry, **Then** that entry remains readable before it begins to collapse into the timeline.
2. **Given** a visitor continues scrolling through multiple experience entries, **When** each entry has passed its readable point, **Then** the entry contributes a visible marker or segment to the horizontal timeline.
3. **Given** a visitor scrolls backward through the Experience section, **When** an entry becomes active again, **Then** that entry expands to show its detailed content while inactive entries remain summarized.

---

### User Story 2 - Review Complete Career Timeline (Priority: P2)

As a portfolio visitor, I want to see a complete horizontal timeline by the end of the Experience section so I can quickly understand the career sequence, periods, companies, and job titles.

**Why this priority**: The final timeline is the main replacement for the current long scrolling experience and provides a compact overview.

**Independent Test**: Can be tested by scrolling to the end of the Experience section and verifying that every existing experience appears in the final horizontal timeline with period, company, and job title.

**Acceptance Scenarios**:

1. **Given** a visitor reaches the final experience item, **When** the timeline is complete, **Then** the timeline shows SIMIT, Roularta Media Group, Zora Robotics, NineID, Noordzee Helikopters Vlaanderen, and Easypost.
2. **Given** the timeline is complete, **When** a visitor scans each timeline item, **Then** they can identify the employment period, company, and job title for that item.
3. **Given** a visitor has reached the end of Experience, **When** they continue to the next page section, **Then** the completed timeline does not obscure or overlap unrelated page content.

---

### User Story 3 - Preserve Accessible Detail (Priority: P3)

As a visitor on different devices or with motion sensitivity, I want the same experience information to remain accessible and readable even if the scroll-linked animation is reduced or unavailable.

**Why this priority**: The timeline should improve navigation without making the portfolio harder to read for visitors using mobile, keyboard navigation, touch scrolling, or reduced-motion settings.

**Independent Test**: Can be tested by reviewing the Experience section on narrow screens and with reduced-motion preferences, confirming that the same entries and summary information remain available.

**Acceptance Scenarios**:

1. **Given** a visitor uses a narrow viewport, **When** they browse the Experience section, **Then** the section presents a stacked or compressed timeline that remains readable without requiring precise horizontal scrolling.
2. **Given** a visitor prefers reduced motion, **When** they browse the Experience section, **Then** they see a static timeline summary and readable entries without collapse animation.
3. **Given** a visitor uses keyboard or page scrolling, **When** they move through the Experience section, **Then** the section progresses in a predictable order without trapping focus or scroll position.

### Edge Cases

- The timeline must remain understandable when an experience entry has a much longer company name or job title than the others.
- The transition must not hide details before a visitor has had a reasonable chance to read the active entry.
- The completed timeline must remain usable if entries are added, removed, or reordered in the existing experience content.
- The Experience section must still communicate the full career history when scroll-linked visual effects are not supported or reduced motion is preferred.
- The fixed timeline element must not cover page content above or below the Experience section.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The Experience section MUST progressively condense experience entries as the visitor scrolls through the section.
- **FR-002**: The page MUST show a timeline element above or at the top of the Experience content while the visitor is browsing the Experience section.
- **FR-003**: The timeline element MUST visibly grow or compound as additional experience entries are passed during scrolling.
- **FR-004**: Each experience entry MUST remain readable before it collapses into the timeline representation.
- **FR-005**: The final state of the Experience section MUST present a complete horizontal timeline containing every existing experience entry.
- **FR-006**: Each item in the completed timeline MUST include the employment period, company name, and job title.
- **FR-007**: The currently active experience entry MUST show its detailed content, including bullets, highlights, and references where present; inactive collapsed entries MUST show summary information only.
- **FR-008**: The timeline MUST represent experience entries in the same chronological order as the current Experience section.
- **FR-009**: The Experience section MUST support normal scroll behavior, including mouse wheel, trackpad, touch, keyboard, and page-scroll interactions.
- **FR-010**: When motion is reduced or scroll-linked animation is unavailable, the Experience section MUST show a static timeline summary and readable entries without collapse animation.
- **FR-011**: The timeline and collapsing entries MUST remain readable on common desktop and mobile viewport sizes.
- **FR-012**: The fixed timeline element MUST stay scoped to the Experience section and MUST NOT obscure unrelated page sections.
- **FR-013**: On narrow screens, the timeline MUST use a stacked or compressed presentation rather than depending on precise horizontal scrolling.

### Key Entities

- **Experience Entry**: A professional experience item currently shown in the portfolio. Key attributes are company, job title, start period, end period, detailed bullets, optional highlight, and optional reference.
- **Timeline Item**: The compact representation of an experience entry in the horizontal timeline. Key attributes are period, company, job title, and its visual position in the overall career sequence.
- **Timeline Progress**: The visitor's current progress through the Experience section, used to determine which entries are expanded, collapsed, or represented in the growing timeline.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A visitor can reach the complete experience overview with at least 30% less vertical scrolling than the current full-detail Experience list.
- **SC-002**: 100% of existing experience entries are represented in the completed timeline.
- **SC-003**: A reviewer can identify the period, company, and job title for every experience item from the completed timeline without opening additional content.
- **SC-004**: The active experience entry remains readable for at least one normal scroll interval before it collapses into the timeline.
- **SC-005**: The Experience section remains readable without content overlap at common mobile and desktop viewport sizes.
- **SC-006**: Visitors using reduced-motion settings can access the same experience information and final timeline summary without collapse animation.

## Assumptions

- The existing portfolio visitor is the target user for this feature.
- The existing experience content is the source of truth for companies, periods, job titles, bullets, highlights, and references.
- "Fixed element above the experiences" means fixed or sticky within the Experience section context, not globally fixed across the entire webpage.
- The feature should improve perceived scrolling effort while still allowing visitors to read detailed experience content.
- Mobile and reduced-motion support are in scope because the portfolio is public-facing.

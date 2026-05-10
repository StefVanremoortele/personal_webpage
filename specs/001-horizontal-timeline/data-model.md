# Data Model: Scroll-Collapsing Experience Timeline

## Experience Entry

Represents one professional role in the existing portfolio content.

**Fields**

- `company`: Display name for the employer or client.
- `role`: Job title shown in the list and timeline.
- `start`: Start period label.
- `end`: End period label.
- `bullets`: Detailed role description points.
- `highlight`: Optional short highlight label.
- `reference`: Optional reference label.

**Validation Rules**

- `company`, `role`, `start`, and `end` must be present for timeline display.
- `bullets` may contain one or more detail items for active-entry display.
- Optional `highlight` and `reference` are shown only for the active entry.

## Timeline Item

Derived compact representation of an Experience Entry.

**Fields**

- `period`: Combined display label from `start` and `end`.
- `company`: Copied from Experience Entry.
- `role`: Copied from Experience Entry.
- `index`: Position in the current experience sequence.
- `isActive`: Whether this item maps to the currently expanded entry.
- `isCollapsed`: Whether this item has already contributed to the timeline summary.

**Validation Rules**

- Every Experience Entry must produce exactly one Timeline Item.
- Timeline Item order must match the order of the existing experience array.
- On narrow screens, the same items are presented in stacked or compressed form.

## Timeline Progress

Represents the visitor's progress through the Experience section.

**Fields**

- `sectionProgress`: Normalized progress through the Experience section.
- `activeIndex`: Index of the entry currently expanded with full details.
- `completedCount`: Number of entries represented in the growing timeline.
- `isReducedMotion`: Whether collapse animation should be disabled.
- `isNarrowLayout`: Whether stacked/compressed timeline presentation should be used.

**State Transitions**

- Before Experience section: no entries are active in the timeline interaction.
- Entering Experience section: first entry becomes active and timeline starts visible.
- Scrolling forward: prior entries become summarized, one entry remains active, and completed timeline representation grows.
- Scrolling backward: active entry updates in reverse and regains detailed content.
- End of Experience section: all entries are represented in the complete timeline.
- Reduced motion: static timeline summary and readable entries are shown without collapse animation.

import type { Era, NowStatus } from "@/content/site";

/**
 * Single source of truth for the /now timeline.
 *
 * Edit the data here to update the page — no component changes needed:
 *  - `nowItems`      — the timeline log (current / upcoming / past entries)
 *  - `curiousTopics` — the "Curious about" pills
 *  - `statusDisplay`, `curiousDisplay`, `dateColor` — labels & colours
 */

export type NowItem = {
  /** Stable id, used as the React key. */
  slug: string;
  topic: string;
  era: Era;
  status: NowStatus;
  /** Human-readable date/time, e.g. "Q2 2026 – present" or "Planned". */
  period: string;
  /** Sort key, "YYYY-MM" (most recent first); "" sorts last. */
  start: string;
  /** Optional short description shown under the topic. */
  blurb?: string;
};

export const nowItems: NowItem[] = [
  {
    slug: "agent-review-loops",
    topic: "Agent Review Loops",
    era: "agent",
    status: "current",
    period: "Q2 2026 – present",
    start: "2026-04",
    blurb: "Blurb coming soon.",
  },
  {
    slug: "ai-repository-context",
    topic: "AI Repository Context",
    era: "agent",
    status: "current",
    period: "Q2 2026 – present",
    start: "2026-04",
    blurb: "Blurb coming soon.",
  },
  {
    slug: "harness-engineering-agent-loops",
    topic: "Harness Engineering & Agent Loops",
    era: "agent",
    status: "current",
    period: "Q2 2026 – present",
    start: "2026-04",
    blurb: "Blurb coming soon.",
  },
  {
    slug: "spec-driven",
    topic: "Spec Driven",
    era: "agent",
    status: "current",
    period: "Q2 2026 – present",
    start: "2026-04",
    blurb: "Blurb coming soon.",
  },
  {
    slug: "knowledge-graphs",
    topic: "Knowledge Graphs",
    era: "agent",
    status: "upcoming",
    period: "Planned",
    start: "",
    blurb: "Blurb coming soon.",
  },
  {
    slug: "ai-dev-cli-environments",
    topic: "AI Dev CLI Environments (Pi, Opencode, Claude, Codex)",
    era: "agent",
    status: "past",
    period: "Q4 2025 – Q1 2026",
    start: "2025-10",
    blurb: "Blurb coming soon.",
  },
  {
    slug: "openclaw",
    topic: "Openclaw",
    era: "agent",
    status: "past",
    period: "Q4 2025 – Q1 2026",
    start: "2025-10",
    blurb: "Blurb coming soon.",
  },
  {
    slug: "ollama",
    topic: "Ollama",
    era: "agent",
    status: "past",
    period: "Q2–Q3 2025",
    start: "2025-04",
    blurb: "Blurb coming soon.",
  },
];

/** "Curious about" pills — interests I want to dig into (no dates/body). */
export const curiousTopics: string[] = [
  "Applied cryptography",
  "Distributed systems",
  "Formal verification",
  "Rust",
  "Local-first software",
  "Confidential computing",
  "Threat modeling",
];

/** Heading label + colour for each status group on the timeline. */
export const statusDisplay: Record<NowStatus, { label: string; color: string }> = {
  upcoming: { label: "Upcoming", color: "rgb(85, 119, 166)" },
  current: { label: "Right now", color: "var(--accent)" },
  past: { label: "Past", color: "var(--muted)" },
};

/** Heading, subtitle and colour for the "Curious about" pill section. */
export const curiousDisplay = {
  label: "Curious about",
  subtitle: "things I want to dig into",
  color: "rgb(130, 138, 153)",
};

/** Colour for all date/time strings on the timeline (e.g. "Q2 2026 – present"). */
export const dateColor = "rgb(158, 123, 62)";

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
    blurb:
      "Building automated review loops where one agent's output is checked and critiqued by another before it reaches me, to catch mistakes earlier and raise the bar on AI-generated code.",
  },
  {
    slug: "ai-repository-context",
    topic: "AI Repository Context",
    era: "agent",
    status: "current",
    period: "Q2 2026 – present",
    start: "2026-04",
    blurb:
      "Exploring how to feed coherent, up-to-date repo context to coding agents (memory, CLAUDE.md-style instructions, retrieval) so they stop re-deriving things I already know.",
  },
  {
    slug: "harness-engineering-agent-loops",
    topic: "Harness Engineering & Agent Loops",
    era: "agent",
    status: "current",
    period: "Q2 2026 – present",
    start: "2026-04",
    blurb:
      "Designing the surrounding harness — tools, guardrails, permissions — that determines whether an autonomous coding agent is useful or dangerous.",
  },
  {
    slug: "spec-driven",
    topic: "Spec Driven",
    era: "agent",
    status: "current",
    period: "Q2 2026 – present",
    start: "2026-04",
    blurb:
      "Explored spec-driven development mainly using Google's spec-kit framework to keep AI-assisted development aligned with actual intent.",
  },
  {
    slug: "knowledge-graphs",
    topic: "Knowledge Graphs",
    era: "agent",
    status: "upcoming",
    period: "Planned",
    start: "",
    blurb:
      "Next up: structuring personal/project knowledge as a graph rather than flat notes, to give agents better long-term context.",
  },
  {
    slug: "ai-dev-cli-environments",
    topic: "AI Dev CLI Environments (Pi, Opencode, Claude, Codex)",
    era: "agent",
    status: "past",
    period: "Q4 2025 – Q1 2026",
    start: "2025-10",
    blurb:
      "Compared CLI agentic dev environments using lower class models (Kimi K2, Llama, Qwen, etc.) to find more cost-efficient ways for LLM-supported development.",
  },
  {
    slug: "openclaw",
    topic: "Openclaw",
    era: "agent",
    status: "past",
    period: "Q4 2025 – Q1 2026",
    start: "2025-10",
    blurb:
      "Built a full agent setup on Openclaw to assist with my own development and build workflows.",
  },
  {
    slug: "ollama",
    topic: "Ollama",
    era: "agent",
    status: "past",
    period: "Q2–Q3 2025",
    start: "2025-04",
    blurb:
      "Ran local LLMs via Ollama to evaluate self-hosted models as an alternative to cloud APIs.",
  },
  {
    slug: "cissp-study-guide",
    topic: "CISSP Official Study Guide",
    era: "sec",
    status: "past",
    period: "Q4 2025",
    start: "2025-10",
    blurb:
      "Read the CISSP study book to improve my overall knowledge regarding IT security (from a defensive perspective).",
  },
];

/** "Curious about" pills — interests I want to dig into (no dates/body). */
export const curiousTopics: string[] = [
  "Cryptography",
  "Blockchain",
  "Agentic development & workflows",
  "Technical IT security",
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

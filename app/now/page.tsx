import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { siteUrl, type Era, type NowStatus } from "@/content/site";
import {
  curiousDisplay,
  curiousTopics,
  dateColor,
  statusDisplay,
} from "@/content/now.config";
import { getNowGroups, type NowGroup, type NowItem } from "@/lib/now";

export const metadata: Metadata = {
  title: "Now — Stef Vanremoortele",
  description:
    "What I'm currently exploring, what's planned next, and what I've researched in the past — AI workflows, dev tooling, security topics, and general tinkering.",
  alternates: { canonical: `${siteUrl}/now` },
};

const ERAS: Record<Era, { label: string; color: string }> = {
  dev: { label: "DEVELOPMENT", color: "var(--era-dev)" },
  sec: { label: "SECURITY", color: "var(--era-sec)" },
  agent: { label: "AI AGENTIC", color: "var(--era-agent)" },
};

const RAIL_COLOR = "color-mix(in srgb, var(--muted) 65%, transparent)";
const DASHED_RAIL = `repeating-linear-gradient(to bottom, ${RAIL_COLOR} 0 4px, transparent 4px 13px)`;

function EraPill({ era }: { era: Era }) {
  const e = ERAS[era];
  return (
    <span
      className="rounded-full border border-[color:var(--accent-border)] px-3 py-1 text-xs text-foreground/70"
      style={{ "--accent": e.color } as React.CSSProperties}
    >
      {e.label}
    </span>
  );
}

function RailNode({ status }: { status: NowStatus }) {
  if (status === "current") {
    return (
      <span className="absolute left-[-1px] top-[2px] h-[14px] w-[14px]" aria-hidden>
        <span
          className="absolute -inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, color-mix(in oklch, var(--accent) 38%, transparent) 0%, transparent 70%)",
          }}
        />
        <span className="now-node-live absolute inset-0 rounded-full bg-[var(--accent)]" />
      </span>
    );
  }

  if (status === "upcoming") {
    return (
      <span
        className="absolute left-[-1px] top-[2px] h-[14px] w-[14px] rounded-full border-2 border-[var(--accent)] bg-[var(--background)]"
        style={{ boxShadow: "0 0 0 3px var(--background)" }}
        aria-hidden
      />
    );
  }

  return (
    <span
      className="absolute left-[2px] top-[5px] h-2 w-2 rounded-full bg-[var(--muted)]"
      style={{ boxShadow: "0 0 0 3px var(--background)" }}
      aria-hidden
    />
  );
}

function NowCard({ item, showPeriod }: { item: NowItem; showPeriod: boolean }) {
  return (
    <article className="rounded-[18px] border border-[var(--line)] p-5 sm:p-6">
      <header className="mb-3 flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h3 className="text-lg font-bold tracking-[-0.01em] sm:text-xl">{item.topic}</h3>
        {showPeriod && (
          <span
            className="font-mono text-[11px] tracking-[0.06em] whitespace-nowrap"
            style={{ color: dateColor }}
          >
            {item.period}
          </span>
        )}
      </header>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <EraPill era={item.era} />
      </div>
      {item.blurb && <p className="text-[15px] italic text-[var(--muted)]">{item.blurb}</p>}
    </article>
  );
}

// Lightweight pill section for things I'm curious about. Sits at the top of
// the timeline with a dashed rail segment connecting down to the first group.
function CuriousSection({ topics }: { topics: string[] }) {
  if (topics.length === 0) return null;
  return (
    <div className="relative mb-12">
      <span
        className="absolute left-[6px] top-[9px] w-px"
        style={{ bottom: "-3rem", background: DASHED_RAIL }}
        aria-hidden
      />
      <span
        className="absolute left-[-1px] top-[2px] h-[14px] w-[14px] rounded-full border-2 border-[var(--accent)] bg-[var(--background)]"
        style={{ boxShadow: "0 0 0 3px var(--background)" }}
        aria-hidden
      />
      <div className="mb-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 pl-9 sm:pl-10">
        <h2
          className="text-sm font-bold uppercase tracking-[0.22em]"
          style={{ color: curiousDisplay.color }}
        >
          {curiousDisplay.label}
        </h2>
        <p className="text-[13px] text-[var(--muted)]">{curiousDisplay.subtitle}</p>
      </div>
      <div className="flex flex-wrap gap-2.5 pl-9 sm:pl-10">
        {topics.map((topic) => (
          <span
            key={topic}
            className="rounded-full border border-[var(--line)] px-3.5 py-1.5 text-sm text-foreground/80"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
}

function TimelineGroup({ group, isLast }: { group: NowGroup; isLast: boolean }) {
  const { status, entries } = group;
  const display = statusDisplay[status];
  // Current entries share a period ("… – present"); surface it on the
  // group header instead of repeating it on every card.
  const headerPeriod = status === "current" ? entries[0]?.period : null;

  return (
    <div className="relative mb-12 last:mb-0">
      {/* Solid rail segment for this group. Non-last segments extend through
          the margin to meet the next group's node; the final segment trails
          past the last card and fades out. */}
      <span
        className="absolute left-[6px] top-[9px] w-px"
        style={{
          bottom: isLast ? "-2.5rem" : "-3rem",
          background: RAIL_COLOR,
          ...(isLast && {
            maskImage: "linear-gradient(to bottom, #000 0, #000 calc(100% - 72px), transparent)",
            WebkitMaskImage:
              "linear-gradient(to bottom, #000 0, #000 calc(100% - 72px), transparent)",
          }),
        }}
        aria-hidden
      />
      <RailNode status={status} />
      <div className="mb-5 pl-9 sm:pl-10">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h2
            className="text-sm font-bold uppercase tracking-[0.22em]"
            style={{ color: display.color }}
          >
            {display.label}
          </h2>
          {headerPeriod && (
            <span
              className="font-mono text-[11px] tracking-[0.06em]"
              style={{ color: dateColor }}
            >
              {headerPeriod}
            </span>
          )}
        </div>
      </div>
      <div className="grid gap-4 pl-9 sm:pl-10">
        {entries.map((item) => (
          <NowCard key={item.slug} item={item} showPeriod={status !== "current"} />
        ))}
      </div>
    </div>
  );
}

export default function NowPage() {
  const groups = getNowGroups();

  return (
    <>
      <main className="flex-1 px-5 py-16 sm:px-10 sm:py-24" style={{ zoom: 0.8 }}>
        <div className="mx-auto w-full max-w-2xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--accent)]"
          >
            ← Home
          </Link>

          <h1 className="mb-3 text-[2.25rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Now
          </h1>
          <p className="mb-20 max-w-2xl text-base leading-relaxed text-foreground/75 sm:mb-28 sm:text-lg">
            A running log of what I&apos;m researching, tinkering with, and thinking about — AI
            workflows, dev tooling, security, and whatever else pulls focus.
          </p>

          <section aria-label="Timeline">
            <div className="relative">
              <CuriousSection topics={curiousTopics} />
              {groups.map((group, i) => (
                <TimelineGroup
                  key={group.status}
                  group={group}
                  isLast={i === groups.length - 1}
                />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

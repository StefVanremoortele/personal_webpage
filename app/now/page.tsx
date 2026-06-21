import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { siteUrl, type Era, type NowStatus } from "@/content/site";
import {
  getAllNowEntries,
  getCurrentEntries,
  getPastEntries,
  getUpcomingEntries,
  type NowEntry,
} from "@/lib/now";

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

const STATUS_LABEL: Record<NowStatus, string> = {
  current: "Current",
  upcoming: "Upcoming",
  past: "Past",
};

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

function StatusPill({ status }: { status: NowStatus }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-3.5 py-[7px] text-[13px] text-[var(--fg)]">
      {status === "current" && <span className="live-dot" aria-hidden />}
      {STATUS_LABEL[status]}
    </span>
  );
}

function NowCard({ entry }: { entry: NowEntry }) {
  const { metadata: m, Body } = entry;
  return (
    <article className="rounded-[18px] border border-[var(--line)] p-5 sm:p-6">
      <header className="mb-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h3 className="text-lg font-bold tracking-[-0.01em] sm:text-xl">{m.topic}</h3>
        <span className="font-mono text-[11px] tracking-[0.06em] text-[var(--muted)]">
          {m.period}
        </span>
      </header>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <EraPill era={m.era} />
        <StatusPill status={m.status} />
      </div>
      <Body />
    </article>
  );
}

export default async function NowPage() {
  const all = await getAllNowEntries();
  const current = getCurrentEntries(all);
  const log = [...getUpcomingEntries(all), ...getPastEntries(all)];

  return (
    <>
      <main className="flex-1 px-5 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto w-full max-w-4xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] hover:text-[var(--accent)]"
          >
            ← Home
          </Link>

          <h1 className="mb-3 text-[2.25rem] font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Now
          </h1>
          <p className="mb-12 max-w-2xl text-base leading-relaxed text-foreground/75 sm:text-lg">
            A running log of what I&apos;m researching, tinkering with, and thinking about — AI
            workflows, dev tooling, security, and whatever else pulls focus.
          </p>

          {current.length > 0 && (
            <section className="mb-16" aria-label="Currently exploring">
              <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
                Right now
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {current.map((entry) => (
                  <NowCard key={entry.slug} entry={entry} />
                ))}
              </div>
            </section>
          )}

          <section aria-label="Log">
            <h2 className="mb-5 text-sm font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
              Log
            </h2>
            <div className="grid gap-4">
              {log.map((entry) => (
                <NowCard key={entry.slug} entry={entry} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}

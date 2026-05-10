"use client";

import { useEffect, useRef, useState } from "react";
import { experience, type Era } from "@/content/site";
import { useMorphPath } from "./useMorphPath";

const ERAS: Record<Era, { label: string; color: string; gradient?: string }> = {
  dev: { label: "DEVELOPMENT", color: "var(--era-dev)" },
  sec: { label: "SECURITY", color: "var(--era-sec)" },
  agent: {
    label: "AI AGENTIC",
    color: "var(--era-agent)",
    gradient: "var(--era-agent-gradient)",
  },
};

const GLYPH_PATHS: Record<Era, string> = {
  dev: "M12 10 L36 10 Q40 10 40 14 L40 34 Q40 38 36 38 L12 38 Q8 38 8 34 L8 14 Q8 10 12 10 Z",
  sec: "M24 6 L40 12 L40 24 C40 32 33 40 24 42 C15 40 8 32 8 24 L8 12 Z",
  agent:
    "M24 6 C26 12 26 12 30 12 C34 10 34 10 36 14 C36 18 36 18 40 20 C42 24 42 24 40 28 C36 30 36 30 36 34 C34 38 34 38 30 36 C26 36 26 36 24 42 C22 36 22 36 18 36 C14 38 14 38 12 34 C12 30 12 30 8 28 C6 24 6 24 8 20 C12 18 12 18 12 14 C14 10 14 10 18 12 C22 12 22 12 24 6 Z",
};

function EraIndicator({ activeEra }: { activeEra: Era }) {
  const ref = useMorphPath(GLYPH_PATHS, activeEra);
  const era = ERAS[activeEra];
  const labelBg = era.gradient ?? `linear-gradient(0deg, ${era.color}, ${era.color})`;

  return (
    <div
      className="mt-3 flex flex-col items-center gap-[18px] text-center"
      style={{ "--accent": era.color } as React.CSSProperties}
    >
      <div className="era-glyph" style={{ color: era.color }}>
        <svg
          viewBox="0 0 48 48"
          width="56"
          height="56"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path ref={ref} d={GLYPH_PATHS[activeEra]} />
          {/* dev: code brackets + slash */}
          <g style={{ opacity: activeEra === "dev" ? 1 : 0, transition: "opacity 420ms ease" }}>
            <path d="M19 19 L13 24 L19 29" />
            <path d="M29 19 L35 24 L29 29" />
            <path d="M26 17 L22 31" opacity="0.7" />
          </g>
          {/* sec: shield checkmark */}
          <g style={{ opacity: activeEra === "sec" ? 1 : 0, transition: "opacity 420ms ease" }}>
            <path d="M16 24 L22 30 L33 18" />
          </g>
          {/* agent: hub with 4 connected nodes */}
          <g style={{ opacity: activeEra === "agent" ? 1 : 0, transition: "opacity 420ms ease" }}>
            <circle cx="24" cy="24" r="3" />
            <line x1="14" y1="16" x2="21" y2="22" opacity="0.7" />
            <line x1="34" y1="16" x2="27" y2="22" opacity="0.7" />
            <line x1="14" y1="32" x2="21" y2="26" opacity="0.7" />
            <line x1="34" y1="32" x2="27" y2="26" opacity="0.7" />
            <circle cx="13" cy="15" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="35" cy="15" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="13" cy="33" r="1.6" fill="currentColor" stroke="none" />
            <circle cx="35" cy="33" r="1.6" fill="currentColor" stroke="none" />
          </g>
        </svg>
      </div>
      <div
        className="font-mono text-[11px] font-semibold tracking-[0.32em]"
        style={{
          backgroundImage: labelBg,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          transition: "background-image 600ms ease",
        }}
      >
        {era.label}
      </div>
    </div>
  );
}

function Entry({
  entry,
  idx,
  onIntersect,
}: {
  entry: (typeof experience)[number];
  idx: number;
  onIntersect: (idx: number) => void;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) onIntersect(idx);
        });
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: 0 },
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, [idx, onIntersect]);

  const era = ERAS[entry.era];
  const dotBg = era.gradient ?? era.color;

  return (
    <article
      ref={ref}
      className="relative pb-16 last:pb-0"
      style={{ "--accent": era.color } as React.CSSProperties}
    >
      <span className="absolute -left-[28px] top-[10px] h-[14px] w-[14px]">
        <span
          className="absolute -inset-1.5 rounded-full"
          style={{
            background: `radial-gradient(circle, color-mix(in oklch, ${era.color} 35%, transparent) 0%, transparent 70%)`,
          }}
        />
        <span
          className="absolute inset-[3px] rounded-full"
          style={{
            background: dotBg,
            boxShadow: "0 0 0 3px var(--background)",
          }}
        />
      </span>

      <header className="mb-1 flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
        <h3 className="text-[22px] font-bold tracking-[-0.01em]">
          {entry.role}{" "}
          <span className="font-medium text-[var(--muted)]">@ {entry.company}</span>
        </h3>
        <span className="font-mono text-xs tracking-[0.06em] whitespace-nowrap text-[var(--muted)]">
          {entry.start} — {entry.end}
        </span>
      </header>

      <div
        className="mb-3.5 mt-1 font-mono text-[10px] uppercase tracking-[0.28em]"
        style={{ color: era.color, transition: "color 600ms ease" }}
      >
        {era.label}
      </div>

      <ul className="space-y-3 text-[16px] leading-[1.6] text-foreground/80">
        {entry.bullets.map((b, j) => (
          <li key={j}>{b}</li>
        ))}
      </ul>

      {(entry.highlight || entry.reference) && (
        <p className="mt-2.5 text-sm text-[var(--muted)]">
          {entry.highlight && (
            <span className="mr-3">
              <span className="font-semibold" style={{ color: era.color }}>
                Highlight:
              </span>{" "}
              {entry.highlight}
            </span>
          )}
          {entry.reference && (
            <span>
              <span className="font-semibold" style={{ color: era.color }}>
                Reference:
              </span>{" "}
              {entry.reference}
            </span>
          )}
        </p>
      )}
    </article>
  );
}

const ERA_VAR: Record<Era, string> = {
  dev: "var(--era-dev)",
  sec: "var(--era-sec)",
  agent: "var(--era-agent)",
};

function buildRailGradient(): string {
  const n = experience.length;
  // Anchor each bullet at the center of its segment, then linearly blend
  // between adjacent bullets. Pad with the first/last era color so the rail
  // is solid above the first bullet and below the last.
  const inner = experience
    .map((e, i) => {
      const pos = ((i + 0.5) / n) * 100;
      return `${ERA_VAR[e.era]} ${pos.toFixed(2)}%`;
    })
    .join(", ");
  const firstColor = ERA_VAR[experience[0].era];
  const lastColor = ERA_VAR[experience[experience.length - 1].era];
  return `linear-gradient(to bottom, ${firstColor} 0%, ${inner}, ${lastColor} 100%)`;
}

export function Experience() {
  const [activeIdx, setActiveIdx] = useState(0);
  const activeEra = experience[activeIdx]?.era ?? "agent";
  const railBg = buildRailGradient();

  return (
    <section id="experience" className="px-6 py-20 sm:px-10">
      <div className="mx-auto grid w-full max-w-4xl gap-8 sm:grid-cols-[140px_1fr]">
        <aside className="sm:sticky sm:top-[calc(var(--spacing)*50)] sm:self-start">
          <div
            className="mb-7 text-center text-sm font-bold uppercase tracking-[0.22em] transition-colors duration-500"
            style={{ color: ERAS[activeEra].color }}
          >
            Experience
          </div>
          <EraIndicator activeEra={activeEra} />
        </aside>

        <div className="relative pl-7">
          <div
            className="absolute left-[6px] top-2 bottom-2 w-px opacity-55"
            style={{ background: railBg }}
          />
          {experience.map((entry, i) => (
            <Entry
              key={`${entry.company}-${entry.start}`}
              entry={entry}
              idx={i}
              onIntersect={setActiveIdx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

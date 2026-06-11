"use client";

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

function Entry({ entry }: { entry: (typeof experience)[number] }) {
  const era = ERAS[entry.era];
  const dotBg = era.gradient ?? era.color;

  return (
    <article
      className="relative"
      style={{ "--accent": era.color } as React.CSSProperties}
    >
      <span className="absolute -left-[24px] top-[9px] h-[14px] w-[14px] sm:-left-[28px] sm:top-[10px]">
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

      <header className="mb-1 flex flex-wrap items-start justify-between gap-x-5 gap-y-2">
        <div>
          <h3 className="text-xl font-bold tracking-[-0.01em] sm:text-[22px]">
            {entry.role}
          </h3>
          <p className="mt-1 text-[15px] font-medium text-[var(--muted)] sm:text-[17px]">
            {entry.company}
          </p>
        </div>
        <span className="font-mono text-[11px] tracking-[0.06em] whitespace-nowrap text-[var(--muted)] sm:text-xs">
          {entry.start} — {entry.end}
        </span>
      </header>

      <div
        className="mb-3 mt-2 font-mono text-[9px] uppercase tracking-[0.2em] sm:mb-3.5 sm:mt-1 sm:text-[10px] sm:tracking-[0.28em]"
        style={{ color: era.color, transition: "color 600ms ease" }}
      >
        {era.label}
      </div>

      <ul className="space-y-2.5 text-[15px] leading-[1.55] text-foreground/80 sm:space-y-3 sm:text-[16px] sm:leading-[1.6]">
        {entry.bullets.map((b, j) => (
          <li key={j}>{b}</li>
        ))}
      </ul>
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
  const railBg = buildRailGradient();

  return (
    <>
      {experience.map((entry, i) => {
        const era = ERAS[entry.era];

        return (
          <section
            key={`${entry.company}-${entry.start}`}
            id={i === 0 ? "experience" : `experience-${i + 1}`}
            className="snap-section flex flex-col justify-center px-5 py-12 sm:px-10 sm:py-16"
            aria-label={`Experience ${i + 1} of ${experience.length}: ${entry.role} at ${entry.company}`}
          >
            <div className="mx-auto grid w-full max-w-4xl gap-5 sm:grid-cols-[140px_1fr] sm:gap-8">
              <aside className="flex items-start justify-between gap-4 sm:block sm:self-start">
                <div
                  className="text-sm font-bold uppercase tracking-[0.22em] transition-colors duration-500 sm:mb-3 sm:text-center"
                  style={{ color: era.color }}
                >
                  Experience
                </div>
                <div className="text-right font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--dim)] sm:text-center">
                  {String(i + 1).padStart(2, "0")} /{" "}
                  {String(experience.length).padStart(2, "0")}
                </div>
                <div className="hidden sm:block">
                  <EraIndicator activeEra={entry.era} />
                </div>
              </aside>

              <div className="relative pl-6 sm:pl-7">
                <div
                  className="absolute left-[5px] top-2 bottom-2 w-px opacity-55 sm:left-[6px]"
                  style={{ background: railBg }}
                />
                <Entry entry={entry} />
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}

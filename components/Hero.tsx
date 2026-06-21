"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { profile } from "@/content/site";
import { useMorphPath } from "./useMorphPath";

const ROLES = [
  {
    key: "dev",
    label: "Software Developer",
    color: "oklch(0.86 0.14 172)",
    glow: "oklch(0.86 0.14 172 / 0.45)",
    gradient: "linear-gradient(135deg, oklch(0.86 0.14 172), oklch(0.86 0.14 172))",
  },
  {
    key: "sec",
    label: "Security Specialist",
    color: "oklch(0.84 0.13 78)",
    glow: "oklch(0.84 0.13 78 / 0.45)",
    gradient: "linear-gradient(135deg, oklch(0.84 0.13 78), oklch(0.84 0.13 78))",
  },
  {
    key: "agent",
    label: "Agentic Orchestrator",
    color: "oklch(0.78 0.16 305)",
    glow: "oklch(0.74 0.20 325 / 0.55)",
    gradient:
      "linear-gradient(120deg, oklch(0.82 0.17 282) 0%, oklch(0.72 0.22 318) 55%, oklch(0.78 0.18 350) 100%)",
  },
] as const;

type RoleKey = (typeof ROLES)[number]["key"];

const MORPH_PATHS: Record<RoleKey, string> = {
  dev: "M12 10 L36 10 Q40 10 40 14 L40 34 Q40 38 36 38 L12 38 Q8 38 8 34 L8 14 Q8 10 12 10 Z",
  sec: "M24 6 L40 12 L40 24 C40 32 33 40 24 42 C15 40 8 32 8 24 L8 12 Z",
  agent:
    "M24 6 C26 12 26 12 30 12 C34 10 34 10 36 14 C36 18 36 18 40 20 C42 24 42 24 40 28 C36 30 36 30 36 34 C34 38 34 38 30 36 C26 36 26 36 24 42 C22 36 22 36 18 36 C14 38 14 38 12 34 C12 30 12 30 8 28 C6 24 6 24 8 20 C12 18 12 18 12 14 C14 10 14 10 18 12 C22 12 22 12 24 6 Z",
};

const ROTATE_MS = 2600;
const AVATAR_SRC = "/avatar_me.png";

function MorphIcon({ roleKey }: { roleKey: RoleKey }) {
  const ref = useMorphPath(MORPH_PATHS, roleKey, 650);
  return (
    <svg
      viewBox="0 0 48 48"
      width="44"
      height="44"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path ref={ref} d={MORPH_PATHS[roleKey]} />
      <g style={{ opacity: roleKey === "dev" ? 1 : 0, transition: "opacity 420ms ease" }}>
        <path d="M19 20 L14 24 L19 28" />
        <path d="M29 20 L34 24 L29 28" />
      </g>
      <g style={{ opacity: roleKey === "sec" ? 1 : 0, transition: "opacity 420ms ease" }}>
        <circle cx="24" cy="22" r="2.4" />
        <path d="M24 25 V30" />
      </g>
      <g style={{ opacity: roleKey === "agent" ? 1 : 0, transition: "opacity 420ms ease" }}>
        <circle cx="24" cy="24" r="3" />
      </g>
    </svg>
  );
}

type HeroProps = {
  currentNow?: { topic: string } | null;
};

export function Hero({ currentNow }: HeroProps) {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIdx((p) => (p + 1) % ROLES.length), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const role = ROLES[idx];
  const heroText = profile.name;

  return (
    <section
      id="hero"
      className="snap-section relative flex flex-col justify-center overflow-hidden px-5 py-16 sm:px-10 sm:py-24"
      style={
        {
          "--accent": role.color,
          "--glow": role.glow,
          "--accent-gradient": role.gradient,
        } as React.CSSProperties
      }
    >
      <div className="pointer-events-none relative mx-auto w-full max-w-4xl [&_a]:pointer-events-auto">
        <div className="mb-7 flex items-center gap-3 sm:mb-8 sm:gap-3.5" style={{ minHeight: 44 }}>
          <span
            className="inline-flex h-11 w-11 items-center justify-center"
            style={{ color: role.color, transition: "color 600ms ease" }}
          >
            <MorphIcon roleKey={role.key} />
          </span>
          <div
            className="role-stack text-[11px] font-bold uppercase tracking-[0.16em] sm:text-sm sm:tracking-[0.22em]"
            style={{ color: role.color }}
          >
            {ROLES.map((r, i) => (
              <span key={r.key} className={`role-word ${i === idx ? "is-active" : ""}`}>
                {r.label}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-7 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1
              id="hero-name"
              className="text-[2.5rem] font-semibold leading-[1.05] tracking-tight [overflow-wrap:anywhere] sm:text-6xl md:text-7xl"
            >
              {heroText}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-foreground/75 sm:mt-8 sm:text-xl">
              {profile.tagline}
            </p>
            {currentNow && (
              <a
                href="/now"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-border)] px-3.5 py-1.5 text-xs text-foreground/70 transition hover:border-[color:var(--accent-border-strong)] hover:text-foreground sm:mt-6"
              >
                <span className="live-dot" aria-hidden />
                Currently exploring: {currentNow.topic}
              </a>
            )}
          </div>
          <div className="pointer-events-auto relative mx-auto aspect-square w-24 shrink-0 overflow-hidden rounded-full sm:w-32 md:mx-0 md:w-[clamp(92px,8vw,128px)]">
            <Image
              src={AVATAR_SRC}
              alt={profile.name}
              fill
              sizes="(min-width: 768px) 128px, 128px"
              className="h-full w-full object-cover object-[50%_22%]"
            />
          </div>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href="#booking"
            className="inline-flex h-[52px] w-full max-w-xs items-center justify-center rounded-full px-8 text-sm font-semibold hover:-translate-y-px sm:w-auto"
            style={{
              backgroundImage: role.gradient,
              backgroundColor: role.color,
              color: "#0a0a0a",
              boxShadow: `0 0 60px -10px ${role.glow}`,
              transition:
                "background-color 600ms ease, background-image 600ms ease, box-shadow 600ms ease, transform 350ms cubic-bezier(.4,0,.2,1)",
            }}
          >
            Get in contact
          </a>
        </div>
      </div>
    </section>
  );
}

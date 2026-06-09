"use client";

import { useEffect, useState } from "react";
import { about, skills } from "@/content/site";

const TZ = "Europe/Brussels";

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
const hourFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: TZ,
  hour: "2-digit",
  hour12: false,
});

function DataReadout() {
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const time = timeFmt.format(now);
  const hour = Number(hourFmt.format(now));
  const working = hour >= 9 && hour < 18;

  return (
    <div className="font-mono text-xs">
      <div className="border-b border-dashed border-white/10 py-[7px] text-[var(--fg)]">
        Oostende, BE
      </div>
      <div
        className="inline-flex items-center gap-2 py-[7px] text-[var(--fg)]"
        suppressHydrationWarning
      >
        <span className={`live-dot ${working ? "" : "off"}`} aria-hidden />
        {time} CET
      </div>
    </div>
  );
}

export function About() {
  return (
    <section id="about" className="px-6 py-20 sm:px-10">
      <div className="mx-auto grid w-full max-w-4xl gap-8 sm:grid-cols-[140px_1fr]">
        <div>
          <h2 className="mb-7 text-sm font-bold uppercase tracking-[0.22em] text-[var(--accent)]">
            About
          </h2>
          <DataReadout />
        </div>
        <div className="space-y-5 text-foreground/80 leading-relaxed">
          {about.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <ul className="flex flex-wrap gap-2 pt-4">
            {skills.map((s) => (
              <li
                key={s}
                className="rounded-full border border-[color:var(--accent-border)] px-3 py-1 text-xs text-foreground/70"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

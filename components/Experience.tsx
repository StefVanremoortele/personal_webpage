import { experience } from "@/content/site";

export function Experience() {
  return (
    <section id="experience" className="px-6 py-20 sm:px-10">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Experience</h2>
        <ol className="mt-8 space-y-12 border-l border-[color:var(--accent-border)] pl-6 sm:pl-8">
          {experience.map((e, i) => (
            <li key={i} className="relative">
              <span
                className="absolute -left-[33px] top-2 h-2 w-2 rounded-full bg-[var(--accent)] ring-4 ring-[var(--accent-ring)] sm:-left-[37px]"
                aria-hidden
              />
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-lg font-medium">
                  {e.role}{" "}
                  <span className="text-foreground/60">@ {e.company}</span>
                </h3>
                <p className="text-sm text-foreground/50">
                  {e.start} — {e.end}
                </p>
              </div>
              <ul className="mt-3 space-y-2 text-foreground/75 leading-relaxed">
                {e.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              {(e.highlight || e.reference) && (
                <p className="mt-3 text-xs text-foreground/45">
                  {e.highlight && (
                    <span className="mr-3">
                      <span className="font-medium text-[var(--accent)]">Highlight:</span> {e.highlight}
                    </span>
                  )}
                  {e.reference && (
                    <span>
                      <span className="font-medium text-[var(--accent)]">Reference:</span> {e.reference}
                    </span>
                  )}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

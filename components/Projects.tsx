import { projects } from "@/content/site";

export function Projects() {
  if (projects.length === 0) return null;
  return (
    <section id="projects" className="snap-section flex flex-col justify-center px-5 py-16 sm:px-10 sm:py-20">
      <div className="mx-auto w-full max-w-4xl">
        <h2 className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">Open source</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.url}>
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block h-full rounded-xl border border-foreground/10 p-5 transition hover:border-[color:var(--accent-border-strong)] hover:bg-[var(--accent-soft)]"
              >
                <h3 className="font-medium group-hover:text-foreground">{p.name}</h3>
                <p className="mt-1 text-sm text-foreground/70">{p.description}</p>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-[color:var(--accent-border)] px-2 py-0.5 text-[11px] text-foreground/60"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

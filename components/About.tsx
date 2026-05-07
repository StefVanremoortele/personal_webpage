import { about, profile, skills } from "@/content/site";

export function About() {
  return (
    <section id="about" className="px-6 py-20 sm:px-10">
      <div className="mx-auto grid w-full max-w-4xl gap-12 sm:grid-cols-[1fr_2fr]">
        <div>
          <h2 className="text-sm uppercase tracking-[0.18em] text-[var(--accent)]">About</h2>
          <p className="mt-3 text-foreground/60">
            {profile.location}
            <br />
            {profile.yearsExperience}+ years experience
          </p>
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

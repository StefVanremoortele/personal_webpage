import { profile } from "@/content/site";

export function ContactCTA() {
  return (
    <section id="contact" className="px-6 py-24 sm:px-10">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-[color:var(--accent-border)] bg-[var(--accent-soft)] p-10 text-center sm:p-14">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Let&apos;s work together.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-foreground/70">
          Freelance project work and architecture engagements are especially welcome.
          Reach out to discuss a practical way to work together.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`${profile.whatsapp}?text=${encodeURIComponent("Hi Stef, I found your portfolio and would like to discuss a possible collaboration.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-[var(--accent-contrast)] shadow-[0_8px_22px_var(--accent-shadow)] transition hover:opacity-90"
          >
            Message on WhatsApp
          </a>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex items-center rounded-full border border-[color:var(--accent-border-strong)] px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            Email
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-[color:var(--accent-border-strong)] px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            GitHub
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border border-[color:var(--accent-border-strong)] px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}

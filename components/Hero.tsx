import { profile } from "@/content/site";
import { HeroCanvasGate } from "./HeroCanvasGate";

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] flex-col justify-center overflow-hidden px-6 py-24 sm:px-10">
      <HeroCanvasGate />
      <div className="pointer-events-none relative mx-auto w-full max-w-4xl [&_a]:pointer-events-auto">
        <p className="mb-6 text-sm uppercase tracking-[0.18em] text-foreground/50">
          {profile.title}
        </p>
        <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight [overflow-wrap:anywhere] sm:text-6xl md:text-7xl">
          {profile.name}.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-foreground/75 sm:text-xl">
          {profile.tagline}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={profile.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            Book a 15-min call
          </a>
          <a
            href="#experience"
            className="inline-flex items-center rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-foreground/5"
          >
            See experience
          </a>
        </div>
      </div>
    </section>
  );
}

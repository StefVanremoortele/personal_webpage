import Link from "next/link";
import { profile } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function Footer() {
  return (
    <footer className="mt-auto scroll-mt-0 border-t border-foreground/10 px-5 py-8 [scroll-snap-align:end] sm:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-start justify-between gap-4 text-sm text-foreground/55 sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <Link href="/now" className="hover:text-[var(--accent)]">Now</Link>
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)]">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)]">LinkedIn</a>
          <a href={`mailto:${profile.email}`} className="hover:text-[var(--accent)]">Email</a>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

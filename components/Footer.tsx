import { profile } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-foreground/10 px-6 py-8 sm:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-wrap items-center justify-between gap-4 text-sm text-foreground/55">
        <p>© {new Date().getFullYear()} {profile.name}</p>
        <div className="flex items-center gap-4">
          <a href={profile.github} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)]">GitHub</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)]">LinkedIn</a>
          <a href={`mailto:${profile.email}`} className="hover:text-[var(--accent)]">Email</a>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}

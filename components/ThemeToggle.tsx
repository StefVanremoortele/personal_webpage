"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle color theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--accent-border)] text-foreground/70 transition hover:bg-[var(--accent-soft)] hover:text-[var(--accent)]"
    >
      <span className="text-sm" aria-hidden>
        {mounted ? (isDark ? "☀" : "☾") : "·"}
      </span>
    </button>
  );
}

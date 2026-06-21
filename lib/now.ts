import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";
import type { NowMetadata } from "@/content/site";

export type NowEntry = {
  slug: string;
  metadata: NowMetadata;
  Body: ComponentType;
};

const NOW_DIR = path.join(process.cwd(), "content", "now");

export async function getAllNowEntries(): Promise<NowEntry[]> {
  const slugs = fs
    .readdirSync(NOW_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));

  return Promise.all(
    slugs.map(async (slug) => {
      const mod = await import(`@/content/now/${slug}.mdx`);
      return { slug, metadata: mod.metadata as NowMetadata, Body: mod.default as ComponentType };
    }),
  );
}

// Descending by `start`; "" sorts last; ties broken alphabetically by slug.
function sortByStartDesc(entries: NowEntry[]): NowEntry[] {
  return [...entries].sort((a, b) => {
    const aStart = a.metadata.start || "";
    const bStart = b.metadata.start || "";
    if (aStart !== bStart) return aStart < bStart ? 1 : -1;
    return a.slug.localeCompare(b.slug);
  });
}

export function getCurrentEntries(entries: NowEntry[]) {
  return sortByStartDesc(entries.filter((e) => e.metadata.status === "current"));
}

export function getUpcomingEntries(entries: NowEntry[]) {
  return sortByStartDesc(entries.filter((e) => e.metadata.status === "upcoming"));
}

export function getPastEntries(entries: NowEntry[]) {
  return sortByStartDesc(entries.filter((e) => e.metadata.status === "past"));
}

// Single most-recent "current" entry for the Hero badge, or null.
export function getHeroBadgeEntry(entries: NowEntry[]): NowEntry | null {
  return getCurrentEntries(entries)[0] ?? null;
}

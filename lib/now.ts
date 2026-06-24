import { nowItems, type NowItem } from "@/content/now.config";
import type { NowStatus } from "@/content/site";

export type { NowItem };
export type NowGroup = { status: NowStatus; entries: NowItem[] };

// Descending by `start`; "" sorts last; ties broken alphabetically by slug.
function sortByStartDesc(items: NowItem[]): NowItem[] {
  return [...items].sort((a, b) => {
    const aStart = a.start || "";
    const bStart = b.start || "";
    if (aStart !== bStart) return aStart < bStart ? 1 : -1;
    return a.slug.localeCompare(b.slug);
  });
}

export function getCurrentEntries(items: NowItem[] = nowItems): NowItem[] {
  return sortByStartDesc(items.filter((e) => e.status === "current"));
}

// Entries grouped into a single chronological timeline: upcoming first,
// then what's current, then past. Empty groups are dropped.
export function getNowGroups(items: NowItem[] = nowItems): NowGroup[] {
  const order: NowStatus[] = ["upcoming", "current", "past"];
  return order
    .map((status) => ({
      status,
      entries: sortByStartDesc(items.filter((e) => e.status === status)),
    }))
    .filter((group) => group.entries.length > 0);
}

// Single most-recent "current" entry for the Hero badge, or null.
export function getHeroBadgeEntry(items: NowItem[] = nowItems): NowItem | null {
  return getCurrentEntries(items)[0] ?? null;
}

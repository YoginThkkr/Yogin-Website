import type { Portfolio, Sticker } from "../types/portfolio";

export type TimelineGroup = "work" | "study";

export interface TimelineEntry {
  key: string;
  group: TimelineGroup;
  years: string;
  title: string;
  subtitle: string;
  location: string;
  points: string[];
  sticker: Sticker;
  /** Position within its own group (1-based) and the group's size */
  groupIndex: number;
  groupSize: number;
}

export const GROUP_LABEL: Record<TimelineGroup, string> = {
  work: "Work experience",
  study: "Education",
};

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

/** "May 2024 — Present" -> 2024.33 (used only for ordering) */
function startValue(period: string): number {
  const year = period.match(/\d{4}/);
  if (!year) return 0;
  const month = MONTHS.findIndex((m) => period.toLowerCase().startsWith(m));
  return Number(year[0]) + (month >= 0 ? month / 12 : 0);
}

/** "May 2024 — Present" -> "2024 – Now", "August 2018 — December 2018" -> "2018" */
function shortYears(period: string): string {
  const years = period.match(/\d{4}/g) ?? [];
  const ongoing = /present|now/i.test(period);
  const first = years[0];
  const last = years[years.length - 1];
  if (!first || !last) return period;
  if (ongoing) return `${first} – Now`;
  if (first === last) return first;
  return `${first} – ${last}`;
}

const FALLBACK: Sticker = { label: "★", shape: "circle", color: "#F5F5F5" };

/**
 * Work experience first, then education, like a CV.
 * Within each group the most recent comes first.
 */
export function buildTimeline(data: Portfolio): TimelineEntry[] {
  const newestFirst = <T extends { period: string }>(items: T[]) =>
    [...items].sort((a, b) => startValue(b.period) - startValue(a.period));

  const work = newestFirst(data.experience);
  const study = newestFirst(data.education);

  const workEntries: TimelineEntry[] = work.map((job, i) => ({
    key: `work-${job.company}-${job.period}`,
    group: "work",
    years: shortYears(job.period),
    title: job.company,
    subtitle: job.role,
    location: job.location,
    points: (job.points ?? job.highlights).slice(0, 3),
    sticker: job.sticker ?? FALLBACK,
    groupIndex: i + 1,
    groupSize: work.length,
  }));

  const studyEntries: TimelineEntry[] = study.map((item, i) => ({
    key: `study-${item.institution}-${item.period}`,
    group: "study",
    years: shortYears(item.period),
    title: item.institution.split(",")[0],
    subtitle: item.credential,
    location: item.institution.split(",").slice(1).join(",").trim(),
    points: item.note ? [item.note] : [],
    sticker: item.sticker ?? FALLBACK,
    groupIndex: i + 1,
    groupSize: study.length,
  }));

  return [...workEntries, ...studyEntries];
}

import type { ClassSession, TrackId } from "@/lib/types";

/** Map a session to the week label used in the Excel briefs sheet. */
export function getExcelWeekLabel(session: ClassSession): string | null {
  const track = session.cohorts?.track;
  if (!track) return null;

  const raw = session.week_label?.trim();
  if (raw) {
    if (/^week/i.test(raw)) return raw;
    if (/capstone/i.test(raw)) {
      if (track === "swe") return "Weeks 10–11";
      return "Weeks 8–9";
    }
    if (/^\d+\s*\(\s*a\s*\)$/i.test(raw)) return `Week ${raw}`;
    if (/^\d+\(a\)$/i.test(raw)) return `Week ${raw}`;
    if (/^8a$/i.test(raw)) return "Week 8(a)";
    if (/^9a$/i.test(raw)) return "Week 9(a)";
    return raw;
  }

  const n = session.week_number;
  if (track === "swe" && n >= 10 && n <= 11) return "Weeks 10–11";
  if ((track === "em" || track === "pm") && n >= 8 && n <= 9) return "Weeks 8–9";

  return `Week ${n}`;
}

export function getWeekBriefForSession(
  briefs: Record<TrackId, Record<string, WeekBriefEntry>>,
  session: ClassSession,
): WeekBriefEntry | null {
  const track = session.cohorts?.track;
  const label = getExcelWeekLabel(session);
  if (!track || !label) return null;
  return briefs[track]?.[label] ?? null;
}

export type WeekBriefEntry = {
  weekLabel: string;
  title: string;
  content: string;
  oneMinuteRecap: string;
  teachingEmphasis: string[];
  likelyQuestions: string[];
  misconceptions: string[];
};

import type { TrackId } from "@/lib/types";
import type { WeekBriefEntry } from "./resolve-week-label";

export type WeekBriefsByTrack = Record<TrackId, Record<string, WeekBriefEntry>>;

let cached: WeekBriefsByTrack | null = null;

export async function loadWeekBriefsByWeek(): Promise<WeekBriefsByTrack> {
  if (cached) return cached;
  const data = await import("@/content/week-context-briefs-by-week.json");
  cached = data.default as WeekBriefsByTrack;
  return cached;
}

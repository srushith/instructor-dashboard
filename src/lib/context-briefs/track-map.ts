import type { ClassSession, TrackId } from "@/lib/types";
export type { TrackId };

/** Map cohort track field or cohort name patterns to context-brief track IDs. */
export const contextBriefTrackMap: Record<string, TrackId> = {
  swe: "swe",
  em: "em",
  pm: "pm",
  software: "swe",
  "engineering manager": "em",
  "product manager": "pm",
  tpm: "pm",
};

export function getTrackIdFromSession(session: ClassSession): TrackId | null {
  const cohortTrack = session.cohorts?.track;
  if (cohortTrack === "swe" || cohortTrack === "em" || cohortTrack === "pm") {
    return cohortTrack;
  }

  const name = session.cohorts?.name?.toLowerCase() ?? "";
  if (/\bswe\b|software engineer/.test(name)) return "swe";
  if (/\bem\b|engineering manager/.test(name)) return "em";
  if (/\bpm\b|tpm|product manager/.test(name)) return "pm";

  return null;
}

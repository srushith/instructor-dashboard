import type { ClassSession } from "@/lib/types";
import { getModuleIdFromWeekKey } from "./module-index";
import { contextBriefSessionOverrides } from "./session-overrides";
import { getTrackIdFromSession } from "./track-map";
import { getWeekKeyFromSession } from "./week-key-from-session";

export type SessionBriefResolution =
  | { status: "found"; moduleId: string; trackId: "swe" | "em" | "pm" }
  | { status: "none" }
  | { status: "unmapped" };

export function resolveSessionContextBrief(
  session: ClassSession,
): SessionBriefResolution {
  const override = contextBriefSessionOverrides[session.id];
  if (override === null) return { status: "none" };
  if (override) {
    const trackId = getTrackIdFromSession(session) ?? override.split("-")[0] as "swe" | "em" | "pm";
    return { status: "found", moduleId: override, trackId };
  }

  const trackId = getTrackIdFromSession(session);
  const weekKey = getWeekKeyFromSession(session);

  if (!trackId || !weekKey) return { status: "unmapped" };

  const moduleId = getModuleIdFromWeekKey(trackId, weekKey);
  if (!moduleId) return { status: "unmapped" };

  return { status: "found", moduleId, trackId };
}

export function contextBriefHref(
  moduleId: string,
  sessionId?: string,
  viewerTrack?: string,
): string {
  const params = new URLSearchParams();
  if (sessionId) params.set("session", sessionId);
  if (viewerTrack) params.set("viewerTrack", viewerTrack);
  const qs = params.toString();
  return `/dashboard/context-brief/${moduleId}${qs ? `?${qs}` : ""}`;
}

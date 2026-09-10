import type { ModuleIndex, TrackId } from "./types";
import moduleIndexData from "@/content/context-brief-module-index.json";

const moduleIndex = moduleIndexData as ModuleIndex;

export function getModuleIdFromWeekKey(
  trackId: TrackId,
  weekKey: string,
): string | null {
  return moduleIndex[trackId]?.[weekKey] ?? null;
}

export function getModuleIndex(trackId: TrackId): Record<string, string> {
  return moduleIndex[trackId] ?? {};
}

export { moduleIndex };

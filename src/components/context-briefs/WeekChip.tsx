import Link from "next/link";
import type { TrackId } from "@/lib/types";
import { getModuleIdFromWeekKey } from "@/lib/context-briefs/module-index";
import { contextBriefHref } from "@/lib/context-briefs/resolve-session";

type WeekChipProps = {
  week: string;
  trackId: TrackId;
  sessionId?: string;
};

export function WeekChip({ week, trackId, sessionId }: WeekChipProps) {
  const moduleId = getModuleIdFromWeekKey(trackId, week);
  if (!moduleId) {
    return (
      <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
        [{week}]
      </span>
    );
  }

  return (
    <Link
      href={contextBriefHref(moduleId, sessionId, trackId)}
      className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      [{week}]
    </Link>
  );
}

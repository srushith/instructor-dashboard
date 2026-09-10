import type { ClassSession } from "@/lib/types";
import { normalizeWeekKey } from "./normalize-week-key";

export function getWeekKeyFromSession(
  session: Pick<ClassSession, "week_number" | "week_label">,
): string | null {
  if (session.week_label?.trim()) {
    return normalizeWeekKey(session.week_label);
  }
  if (session.week_number) {
    return normalizeWeekKey(`Week ${session.week_number}`);
  }
  return null;
}

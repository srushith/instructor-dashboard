import Link from "next/link";
import type { ClassSession } from "@/lib/types";
import type { Module } from "@/lib/context-briefs/types";
import { contextBriefHref } from "@/lib/context-briefs/resolve-session";
import { InlineMarkdown } from "@/lib/markdown/inline-markdown";

type NextClassHeroProps = {
  session: ClassSession;
  module: Module | null;
  moduleId: string | null;
  trackId: "swe" | "em" | "pm" | null;
};

function formatDateTime(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function NextClassHero({
  session,
  module,
  moduleId,
  trackId,
}: NextClassHeroProps) {
  const cohortName = session.cohorts?.name ?? "Your cohort";
  const weekLabel =
    session.week_label ?? `Week ${session.week_number}`;

  return (
    <section className="mb-8 rounded-2xl border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
        Next class
      </p>
      <h2 className="mt-2 text-2xl font-bold text-slate-900">
        {weekLabel} — {module?.title ?? cohortName}
      </h2>
      <p className="mt-1 text-slate-600">{formatDateTime(session.class_date)}</p>

      {moduleId && trackId ? (
        <div className="mt-5 space-y-3">
          <Link
            href={contextBriefHref(moduleId, session.id, trackId)}
            className="inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Read the 1-minute recap →
          </Link>
          <Link
            href={contextBriefHref(moduleId, session.id, trackId)}
            className="ml-3 inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-900"
          >
            Open full context brief
          </Link>
          {module?.sections?.oneMinuteRecap && (
            <blockquote className="mt-4 rounded-lg border-l-4 border-indigo-400 bg-white/80 p-4 text-sm text-slate-700">
              <InlineMarkdown text={module.sections.oneMinuteRecap} />
            </blockquote>
          )}
        </div>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          No context brief is available for this session yet. Ask ops to set the cohort track
          and week label.
        </p>
      )}
    </section>
  );
}

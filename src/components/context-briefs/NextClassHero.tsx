import Link from "next/link";
import type { ClassSession, TrackId } from "@/lib/types";
import type { Module } from "@/lib/context-briefs/types";
import type { WeekBriefEntry } from "@/lib/week-briefs/resolve-week-label";
import { contextBriefHref } from "@/lib/context-briefs/resolve-session";
import { InlineMarkdown } from "@/lib/markdown/inline-markdown";
import { WeekBriefSheet } from "@/components/week-briefs/WeekBriefSheet";

type NextClassHeroProps = {
  session: ClassSession;
  module: Module | null;
  moduleId: string | null;
  trackId: TrackId | null;
  weekBrief: WeekBriefEntry | null;
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
  weekBrief,
}: NextClassHeroProps) {
  const cohortName = session.cohorts?.name ?? "Your cohort";
  const weekLabel = session.week_label ?? `Week ${session.week_number}`;
  const track = session.cohorts?.track;

  return (
    <section
      className={`relative mb-8 overflow-hidden rounded-3xl border border-cyan-400/30 bg-gradient-to-br from-indigo-950/80 via-slate-900/90 to-cyan-950/50 p-6 shadow-[0_0_60px_-15px_rgba(34,211,238,0.4)] ${
        track ? `track-${track}` : ""
      }`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.15),transparent_50%)]" aria-hidden="true" />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-cyan-400/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300">
            Next class
          </span>
          {track && (
            <span className="rounded-full border border-[color:var(--track-color)]/40 bg-[color:var(--track-color)]/15 px-3 py-1 text-xs font-bold text-[color:var(--track-color)]">
              {track.toUpperCase()}
            </span>
          )}
          <span className="text-sm text-slate-400">{weekLabel}</span>
          {module?.phase && (
            <span className="text-sm text-violet-300">· {module.phase}</span>
          )}
        </div>

        <h2 className="mt-4 text-3xl font-bold text-gradient">
          {module?.title ?? cohortName}
        </h2>
        {module?.code && (
          <p className="mt-1 text-sm text-slate-400">{module.code}</p>
        )}
        <p className="mt-2 text-slate-300">{formatDateTime(session.class_date)}</p>
        <p className="text-sm text-slate-500">{cohortName}</p>

        {moduleId && trackId ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={contextBriefHref(moduleId, session.id, trackId)}
              className="btn-primary inline-flex rounded-xl px-5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              Read the 1-minute recap →
            </Link>
            <Link
              href={contextBriefHref(moduleId, session.id, trackId)}
              className="btn-ghost inline-flex rounded-xl px-5 py-2.5 text-sm"
            >
              Full context brief
            </Link>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Set cohort track and week label to unlock context briefs.
          </p>
        )}

        {module?.sections?.oneMinuteRecap && (
          <blockquote className="mt-5 rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-4 text-sm leading-relaxed text-slate-200">
            <InlineMarkdown text={module.sections.oneMinuteRecap} />
          </blockquote>
        )}

        {weekBrief && track && (
          <div className="mt-5">
            <WeekBriefSheet
              weekBrief={weekBrief}
              trackId={track}
              moduleTitle={module?.title}
            />
          </div>
        )}
      </div>
    </section>
  );
}

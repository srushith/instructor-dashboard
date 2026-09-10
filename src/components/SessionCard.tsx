import Link from "next/link";
import type { ClassSession, TrackId } from "@/lib/types";
import type { Module } from "@/lib/context-briefs/types";
import type { WeekBriefEntry } from "@/lib/week-briefs/resolve-week-label";
import { contextBriefHref } from "@/lib/context-briefs/resolve-session";
import { WeekBriefSheet } from "@/components/week-briefs/WeekBriefSheet";
import { InlineMarkdown } from "@/lib/markdown/inline-markdown";

type SessionCardProps = {
  session: ClassSession;
  showInstructor?: boolean;
  contextBriefModuleId?: string | null;
  contextBriefTrackId?: TrackId | null;
  contextBriefStatus?: "found" | "none" | "unmapped";
  module?: Module | null;
  weekBrief?: WeekBriefEntry | null;
  featured?: boolean;
};

const TRACK_BADGE: Record<TrackId, string> = {
  swe: "SWE",
  em: "EM",
  pm: "PM / TPM",
};

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SessionCard({
  session,
  showInstructor = false,
  contextBriefModuleId = null,
  contextBriefTrackId = null,
  contextBriefStatus = "unmapped",
  module = null,
  weekBrief = null,
  featured = false,
}: SessionCardProps) {
  const cohortName = session.cohorts?.name ?? "Unknown cohort";
  const instructorName =
    session.profiles?.full_name ?? session.profiles?.email ?? "Unknown";
  const weekLabel = session.week_label ?? `Week ${session.week_number}`;
  const track = session.cohorts?.track;

  return (
    <article
      className={`glass-card glass-card-hover rounded-2xl p-5 ${
        featured ? "ring-2 ring-cyan-400/40" : ""
      } ${track ? `track-${track}` : ""}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {track && (
              <span
                className="rounded-full border border-[color:var(--track-color)]/40 bg-[color:var(--track-color)]/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-[color:var(--track-color)]"
              >
                {TRACK_BADGE[track]}
              </span>
            )}
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-slate-300">
              {weekLabel}
            </span>
            {module?.phase && (
              <span className="rounded-full bg-violet-500/20 px-2.5 py-0.5 text-xs text-violet-300">
                {module.phase.replace("-", " ")}
              </span>
            )}
          </div>

          <h3 className="mt-3 text-xl font-bold text-white">
            {module?.title ?? cohortName}
          </h3>
          {module?.code && (
            <p className="mt-1 text-sm text-slate-400">{module.code}</p>
          )}
          <p className="mt-2 text-sm text-slate-400">{formatDate(session.class_date)}</p>
          <p className="text-sm text-slate-500">{cohortName}</p>

          {showInstructor && (
            <p className="mt-1 text-sm text-slate-400">Instructor: {instructorName}</p>
          )}

          {module?.sections?.oneMinuteRecap && featured && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-300">
              <InlineMarkdown text={module.sections.oneMinuteRecap} />
            </p>
          )}
        </div>

        {session.rating != null && (
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-300">
              Rating
            </p>
            <p className="text-xl font-bold text-amber-200">{session.rating}</p>
          </div>
        )}
      </div>

      {weekBrief && track && (
        <div className="mt-4">
          <WeekBriefSheet
            weekBrief={weekBrief}
            trackId={track}
            moduleTitle={module?.title}
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <ContextBriefAction
          moduleId={contextBriefModuleId}
          trackId={contextBriefTrackId}
          sessionId={session.id}
          status={contextBriefStatus}
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ResourceLink label="Content drive folder" url={session.drive_folder_url} />
        <ResourceLink label="Curriculum sheet" url={session.curriculum_sheet_url} />
      </div>

      {session.learner_background && (
        <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Learner background
          </p>
          <p className="mt-1 text-sm text-slate-300">{session.learner_background}</p>
        </div>
      )}

      {session.notes && (
        <div className="mt-3 rounded-xl border border-dashed border-white/15 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Notes
          </p>
          <p className="mt-1 text-sm text-slate-400">{session.notes}</p>
        </div>
      )}
    </article>
  );
}

function ContextBriefAction({
  moduleId,
  trackId,
  sessionId,
  status,
}: {
  moduleId: string | null;
  trackId: TrackId | null;
  sessionId: string;
  status: "found" | "none" | "unmapped";
}) {
  if (status === "none") {
    return (
      <p className="text-sm text-slate-500">No context brief available for this session.</p>
    );
  }

  if (status === "unmapped" || !moduleId || !trackId) {
    return (
      <p className="text-sm text-slate-500">
        We couldn&apos;t find a context brief for this class yet.
      </p>
    );
  }

  return (
    <Link
      href={contextBriefHref(moduleId, sessionId, trackId)}
      className="btn-primary inline-flex rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900"
    >
      Open full context brief →
    </Link>
  );
}

function ResourceLink({ label, url }: { label: string; url: string | null }) {
  if (!url) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/5 px-3 py-2">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm text-slate-600">Not added yet</p>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 px-3 py-2 transition hover:border-cyan-400/40 hover:bg-cyan-500/15"
    >
      <p className="text-xs font-medium text-cyan-300">{label}</p>
      <p className="truncate text-sm text-cyan-100">Open link →</p>
    </a>
  );
}

import type { ClassSession } from "@/lib/types";

type SessionCardProps = {
  session: ClassSession;
  showInstructor?: boolean;
};

function formatDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function SessionCard({ session, showInstructor = false }: SessionCardProps) {
  const cohortName = session.cohorts?.name ?? "Unknown cohort";
  const instructorName =
    session.profiles?.full_name ?? session.profiles?.email ?? "Unknown";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Week {session.week_number} · {cohortName}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{formatDate(session.class_date)}</p>
          {showInstructor && (
            <p className="mt-1 text-sm text-slate-600">Instructor: {instructorName}</p>
          )}
        </div>
        {session.rating != null && (
          <div className="rounded-lg bg-amber-50 px-3 py-2 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
              Rating
            </p>
            <p className="text-xl font-bold text-amber-900">{session.rating}</p>
          </div>
        )}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <ResourceLink
          label="Content drive folder"
          url={session.drive_folder_url}
        />
        <ResourceLink
          label="Curriculum sheet"
          url={session.curriculum_sheet_url}
        />
      </div>

      {session.learner_background && (
        <div className="mt-4 rounded-lg bg-slate-50 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Learner background
          </p>
          <p className="mt-1 text-sm text-slate-700">{session.learner_background}</p>
        </div>
      )}

      {session.notes && (
        <div className="mt-3 rounded-lg border border-dashed border-slate-200 p-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Notes
          </p>
          <p className="mt-1 text-sm text-slate-600">{session.notes}</p>
        </div>
      )}
    </article>
  );
}

function ResourceLink({ label, url }: { label: string; url: string | null }) {
  if (!url) {
    return (
      <div className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm text-slate-400">Not added yet</p>
      </div>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2 transition hover:bg-indigo-100"
    >
      <p className="text-xs font-medium text-indigo-600">{label}</p>
      <p className="truncate text-sm text-indigo-900">Open link →</p>
    </a>
  );
}

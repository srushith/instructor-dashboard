"use client";

import { useState } from "react";
import type { ClassSession, Cohort, Profile } from "@/lib/types";
import { SessionForm, DeleteSessionButton } from "@/components/admin/SessionForm";

type AdminSessionListProps = {
  sessions: ClassSession[];
  cohorts: Cohort[];
  instructors: Profile[];
};

export function AdminSessionList({
  sessions,
  cohorts,
  instructors,
}: AdminSessionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
        No sessions yet. Add the first weekly session above.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        if (editingId === session.id) {
          return (
            <SessionForm
              key={session.id}
              session={session}
              cohorts={cohorts}
              instructors={instructors}
              onCancel={() => setEditingId(null)}
            />
          );
        }

        const cohortName = session.cohorts?.name ?? "—";
        const instructorName =
          session.profiles?.full_name ?? session.profiles?.email ?? "—";

        return (
          <div
            key={session.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-slate-900">
                  Week {session.week_number} · {cohortName}
                </p>
                <p className="text-sm text-slate-500">
                  {session.class_date} · {instructorName}
                </p>
                {session.rating != null && (
                  <p className="mt-1 text-sm text-amber-700">
                    Rating: {session.rating}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setEditingId(session.id)}
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Edit
                </button>
                <DeleteSessionButton sessionId={session.id} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

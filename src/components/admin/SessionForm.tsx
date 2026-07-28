"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ClassSession, Cohort, Profile } from "@/lib/types";
import {
  createSession,
  deleteSession,
  updateSession,
} from "@/app/admin/actions";

type SessionFormProps = {
  cohorts: Cohort[];
  instructors: Profile[];
  session?: ClassSession;
  onCancel?: () => void;
};

export function SessionForm({
  cohorts,
  instructors,
  session,
  onCancel,
}: SessionFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const result = session
      ? await updateSession(formData)
      : await createSession(formData);

    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.refresh();
    onCancel?.();
  }

  return (
    <form action={handleSubmit} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-slate-900">
        {session ? "Edit session" : "Add weekly session"}
      </h3>

      {session && <input type="hidden" name="id" value={session.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cohort">
          <select
            name="cohort_id"
            required
            defaultValue={session?.cohort_id ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>Select cohort</option>
            {cohorts.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </Field>

        <Field label="Instructor">
          <select
            name="instructor_id"
            required
            defaultValue={session?.instructor_id ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="" disabled>Select instructor</option>
            {instructors.map((i) => (
              <option key={i.id} value={i.id}>
                {i.full_name ?? i.email}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Week number">
          <input
            type="number"
            name="week_number"
            min={1}
            required
            defaultValue={session?.week_number ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Class date">
          <input
            type="date"
            name="class_date"
            required
            defaultValue={session?.class_date ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Content drive folder URL">
          <input
            type="url"
            name="drive_folder_url"
            placeholder="https://drive.google.com/..."
            defaultValue={session?.drive_folder_url ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Curriculum sheet URL">
          <input
            type="url"
            name="curriculum_sheet_url"
            placeholder="https://docs.google.com/..."
            defaultValue={session?.curriculum_sheet_url ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Rating (post-class)" className="sm:col-span-2">
          <input
            type="number"
            name="rating"
            min={0}
            max={5}
            step={0.1}
            placeholder="e.g. 4.5"
            defaultValue={session?.rating ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Learner background" className="sm:col-span-2">
          <textarea
            name="learner_background"
            rows={3}
            placeholder="10 learners, mostly beginners, 3 from finance..."
            defaultValue={session?.learner_background ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>

        <Field label="Notes" className="sm:col-span-2">
          <textarea
            name="notes"
            rows={2}
            defaultValue={session?.notes ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
        </Field>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? "Saving..." : session ? "Update session" : "Add session"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export function DeleteSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this session?")) return;
    setLoading(true);
    const formData = new FormData();
    formData.set("id", sessionId);
    await deleteSession(formData);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-60"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

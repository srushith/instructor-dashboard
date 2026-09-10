"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCohort } from "@/app/admin/actions";

export function CohortForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await createCohort(formData);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form action={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <label className="mb-1 block text-sm font-medium text-slate-700">
          New cohort name
        </label>
        <input
          name="name"
          required
          placeholder="Agentic AI 2.0 — SWE Batch 12"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <div className="min-w-[140px]">
        <label className="mb-1 block text-sm font-medium text-slate-700">Track</label>
        <select
          name="track"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          defaultValue="swe"
        >
          <option value="swe">SWE</option>
          <option value="em">EM</option>
          <option value="pm">PM / TPM</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
      >
        {loading ? "Adding..." : "Add cohort"}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}

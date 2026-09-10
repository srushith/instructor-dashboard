"use client";

import { useState } from "react";
import type { WeekBriefEntry } from "@/lib/week-briefs/resolve-week-label";
import type { TrackId } from "@/lib/types";

type WeekBriefSheetProps = {
  weekBrief: WeekBriefEntry;
  trackId: TrackId;
  moduleTitle?: string | null;
};

const TRACK_LABELS: Record<TrackId, string> = {
  swe: "Software Engineering",
  em: "Engineering Management",
  pm: "Product / TPM",
};

export function WeekBriefSheet({
  weekBrief,
  trackId,
  moduleTitle,
}: WeekBriefSheetProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`track-${trackId}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border border-[color:var(--track-color)]/30 bg-[color:var(--track-color)]/10 px-4 py-3 text-left transition hover:bg-[color:var(--track-color)]/15 focus:outline-none focus:ring-2 focus:ring-[color:var(--track-color)]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--track-color)]">
            Week context brief sheet
          </p>
          <p className="mt-0.5 font-medium text-slate-100">
            {weekBrief.weekLabel} · {moduleTitle ?? weekBrief.title}
          </p>
        </div>
        <span className="text-slate-400" aria-hidden="true">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-4 rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <header>
            <p className="text-xs uppercase tracking-wider text-slate-400">
              {TRACK_LABELS[trackId]}
            </p>
            <h4 className="mt-1 text-lg font-bold text-white">{weekBrief.title}</h4>
          </header>

          {weekBrief.oneMinuteRecap && (
            <section className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4">
              <h5 className="text-sm font-semibold text-cyan-300">1-minute recap</h5>
              <p className="mt-2 text-sm leading-relaxed text-slate-200">
                {weekBrief.oneMinuteRecap}
              </p>
            </section>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            {weekBrief.teachingEmphasis.length > 0 && (
              <section>
                <h5 className="text-sm font-semibold text-emerald-300">Teaching emphasis (do)</h5>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                  {weekBrief.teachingEmphasis.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-emerald-400">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {weekBrief.misconceptions.length > 0 && (
              <section>
                <h5 className="text-sm font-semibold text-amber-300">Avoid (don&apos;t)</h5>
                <ul className="mt-2 space-y-1.5 text-sm text-slate-300">
                  {weekBrief.misconceptions.map((item, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-amber-400">!</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {weekBrief.likelyQuestions.length > 0 && (
            <section>
              <h5 className="text-sm font-semibold text-violet-300">Likely learner questions</h5>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {weekBrief.likelyQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-sm text-slate-300"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <details className="group rounded-xl border border-white/10 bg-black/20">
            <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-indigo-300 hover:text-indigo-200">
              Read full week brief sheet
            </summary>
            <div className="max-h-96 overflow-y-auto whitespace-pre-wrap border-t border-white/10 px-4 py-4 text-sm leading-relaxed text-slate-300">
              {weekBrief.content}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

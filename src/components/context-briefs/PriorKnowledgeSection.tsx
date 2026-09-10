import type { PriorKnowledge, TrackId } from "@/lib/context-briefs/types";
import { InlineMarkdown } from "@/lib/markdown/inline-markdown";
import { WeekChip } from "./WeekChip";

const KIND_LABELS: Record<string, string> = {
  project: "Project",
  assignment: "Assignment",
  "post-class": "Post-class",
  optional: "Optional",
  "interview-case": "Interview case",
  capstone: "Capstone",
  "capstone-option": "Capstone option",
  other: "Build",
};

type PriorKnowledgeSectionProps = {
  prior: PriorKnowledge;
  trackId: TrackId;
  sessionId?: string;
};

export function PriorKnowledgeSection({
  prior,
  trackId,
  sessionId,
}: PriorKnowledgeSectionProps) {
  const rollups = prior.projects.filter((p) => p.kind === "rollup");
  const cards = prior.projects.filter((p) => p.kind !== "rollup");
  const callbacks = prior.projects.filter((p) => p.callback);

  return (
    <div className="space-y-6">
      {prior.intro && (
        <p className="text-base leading-relaxed text-slate-700">
          <InlineMarkdown text={prior.intro} />
        </p>
      )}

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {prior.conceptsLabel}
        </h4>
        <ul className="mt-3 space-y-4">
          {prior.concepts.map((concept, i) => (
            <li key={i} className="rounded-lg border border-slate-200 p-4">
              <div className="mb-2 flex flex-wrap gap-1">
                {concept.weeks.map((w) => (
                  <WeekChip key={w} week={w} trackId={trackId} sessionId={sessionId} />
                ))}
              </div>
              <p className="font-semibold text-slate-900">
                <InlineMarkdown text={concept.label} />
              </p>
              <p className="mt-1 text-sm text-slate-700">
                <InlineMarkdown text={concept.text} />
              </p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          {prior.projectsLabel}
        </h4>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {cards.map((project, i) => (
            <article
              key={i}
              className="rounded-lg border border-slate-200 bg-white p-4 print:break-inside-avoid"
            >
              <div className="mb-2 flex flex-wrap gap-1">
                {project.weeks.map((w) => (
                  <WeekChip key={w} week={w} trackId={trackId} sessionId={sessionId} />
                ))}
              </div>
              <span className="inline-block rounded border border-slate-300 px-2 py-0.5 text-xs font-medium text-slate-700">
                {KIND_LABELS[project.kind] ?? project.label}
              </span>
              <h5 className="mt-2 font-semibold text-slate-900">{project.name}</h5>
              <p className="mt-1 text-sm text-slate-700">
                <InlineMarkdown text={project.text} />
              </p>
            </article>
          ))}
        </div>

        {rollups.map((rollup, i) => (
          <p key={i} className="mt-3 text-sm text-slate-500">
            Earlier builds — <InlineMarkdown text={rollup.text} />
          </p>
        ))}

        {callbacks.map((cb, i) => (
          <div
            key={i}
            className="mt-3 flex gap-2 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-3 print:break-inside-avoid"
            role="note"
          >
            <span aria-hidden="true" className="text-amber-700">↳</span>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                {cb.callbackLabel ?? "Builds on"}
              </p>
              <p className="text-sm text-amber-950">
                <InlineMarkdown text={cb.callback ?? cb.text} />
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

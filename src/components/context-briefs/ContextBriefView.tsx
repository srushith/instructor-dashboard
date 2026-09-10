"use client";

import { useState } from "react";
import Link from "next/link";
import type { BriefsDocument, Module, TrackId } from "@/lib/context-briefs/types";
import { contextBriefHref } from "@/lib/context-briefs/resolve-session";
import { InlineMarkdown } from "@/lib/markdown/inline-markdown";
import { PriorKnowledgeSection } from "./PriorKnowledgeSection";

type ContextBriefViewProps = {
  doc: BriefsDocument;
  module: Module;
  displayModule: Module;
  trackId: TrackId;
  viewerTrack?: TrackId;
  sessionId?: string;
  prev: Module | null;
  next: Module | null;
  emSourceModule?: Module | null;
};

export function ContextBriefView({
  doc,
  module,
  displayModule,
  trackId,
  viewerTrack,
  sessionId,
  prev,
  next,
  emSourceModule,
}: ContextBriefViewProps) {
  const titles = doc.sectionTitles;
  const showEmBanner =
    viewerTrack === "em" &&
    module.kind === "shared" &&
    displayModule.track === "swe";

  if (module.kind === "orientation") {
    return (
      <BriefShell module={module} trackId={trackId}>
        <div className="space-y-4">
          {module.notes?.map((note, i) => (
            <div key={i}>
              {note.label && (
                <h3 className="font-semibold text-slate-900">{note.label}</h3>
              )}
              <p className="text-slate-700"><InlineMarkdown text={note.text} /></p>
            </div>
          ))}
        </div>
      </BriefShell>
    );
  }

  if (module.kind === "shared" && !displayModule.sections) {
    return (
      <BriefShell module={module} trackId={trackId}>
        {showEmBanner && <EmBanner notes={emSourceModule?.notes ?? module.notes} />}
        <div className="space-y-4">
          {module.notes?.map((note, i) => (
            <div key={i}>
              {note.label && (
                <h3 className="font-semibold text-slate-900">{note.label}</h3>
              )}
              <p className="text-slate-700"><InlineMarkdown text={note.text} /></p>
            </div>
          ))}
          {module.sharedWith && (
            <Link
              href={contextBriefHref(module.sharedWith, sessionId, viewerTrack ?? trackId)}
              className="inline-flex rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-900 hover:bg-indigo-100"
            >
              View {module.sharedWith.split("-")[0].toUpperCase()} context brief →
            </Link>
          )}
        </div>
      </BriefShell>
    );
  }

  const sections = displayModule.sections;
  if (!sections) {
    return (
      <BriefShell module={module} trackId={trackId}>
        <p className="text-slate-600">No context brief content is available for this module.</p>
      </BriefShell>
    );
  }

  const sectionKeys = [
    "courseJourney",
    "priorKnowledge",
    "learnToday",
    "preparesFor",
    "connections",
    "likelyQuestions",
    "teachingEmphasis",
    "misconceptions",
    "oneMinuteRecap",
  ] as const;

  return (
    <div className="context-brief-print mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="no-print mb-8 border-b border-slate-200 pb-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          {trackId.toUpperCase()}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          {module.weekLabel} · {module.title}
        </h1>
        <p className="text-sm text-slate-500">{module.code}</p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {prev && (
            <NavLink module={prev} label="← Previous" sessionId={sessionId} trackId={trackId} />
          )}
          {next && (
            <NavLink module={next} label="Next →" sessionId={sessionId} trackId={trackId} />
          )}
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(sections.oneMinuteRecap)}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Copy recap
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Print
          </button>
          <a
            href={doc.curriculumSheet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Open curriculum sheet
          </a>
        </div>
      </header>

      {showEmBanner && <EmBanner notes={emSourceModule?.notes ?? module.notes} />}

      <section className="mb-8 rounded-xl border border-indigo-200 bg-indigo-50 p-5 print:break-inside-avoid">
        <h2 className="text-lg font-bold text-indigo-900">{titles.oneMinuteRecap}</h2>
        <p className="mt-2 text-indigo-950">
          <InlineMarkdown text={sections.oneMinuteRecap} />
        </p>
      </section>

      <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Pre-class quick view</h2>
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-700">What learners already know</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {sections.priorKnowledge.concepts.slice(0, 4).map((c, i) => (
                <li key={i}>{c.label}</li>
              ))}
              {sections.priorKnowledge.projects
                .filter((p) => p.kind !== "rollup")
                .slice(0, 4)
                .map((p, i) => (
                  <li key={`p-${i}`}>{p.name}</li>
                ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-700">{titles.connections}</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
              {sections.connections.slice(0, 4).map((c, i) => (
                <li key={i}><InlineMarkdown text={c} /></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="lg:grid lg:grid-cols-[200px_1fr] lg:gap-8">
        <nav className="no-print sticky top-4 hidden h-fit lg:block" aria-label="Section navigation">
          <ul className="space-y-1 text-sm">
            {sectionKeys.map((key) => (
              <li key={key}>
                <a href={`#section-${key}`} className="text-slate-600 hover:text-indigo-700">
                  {titles[key]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-4">
          {sectionKeys.map((key) => (
            <BriefSection
              key={key}
              id={key}
              title={titles[key]}
              defaultOpen={key === "oneMinuteRecap" || key === "priorKnowledge"}
            >
              <SectionBody
                sectionKey={key}
                sections={sections}
                trackId={trackId}
                sessionId={sessionId}
              />
            </BriefSection>
          ))}
        </div>
      </div>
    </div>
  );
}

function BriefShell({
  module,
  trackId,
  children,
}: {
  module: Module;
  trackId: TrackId;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm font-semibold uppercase text-indigo-600">{trackId.toUpperCase()}</p>
      <h1 className="text-2xl font-bold">{module.weekLabel} · {module.title}</h1>
      {children}
    </div>
  );
}

function EmBanner({ notes }: { notes?: { label: string | null; text: string }[] }) {
  return (
    <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4" role="note">
      <p className="font-bold text-amber-900">Viewing as EM</p>
      <p className="mt-1 text-sm text-amber-950">
        This class uses the SWE brief. The notes below explain what is different for EM learners.
      </p>
      {notes?.map((n, i) => (
        <p key={i} className="mt-2 text-sm text-amber-950">
          {n.label ? <strong>{n.label}: </strong> : null}
          <InlineMarkdown text={n.text} />
        </p>
      ))}
    </div>
  );
}

function NavLink({
  module,
  label,
  sessionId,
  trackId,
}: {
  module: Module;
  label: string;
  sessionId?: string;
  trackId: TrackId;
}) {
  return (
    <Link
      href={contextBriefHref(module.id, sessionId, trackId)}
      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
    >
      {label}
    </Link>
  );
}

function BriefSection({
  id,
  title,
  children,
  defaultOpen = false,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section
      id={`section-${id}`}
      className="rounded-xl border border-slate-200 bg-white print:border-0 print:shadow-none"
    >
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-3 text-left lg:pointer-events-none lg:cursor-default"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <span className="text-slate-400 lg:hidden" aria-hidden="true">{open ? "−" : "+"}</span>
      </button>
      <div className={`px-4 pb-4 ${open ? "block" : "hidden lg:block"}`}>{children}</div>
    </section>
  );
}

function SectionBody({
  sectionKey,
  sections,
  trackId,
  sessionId,
}: {
  sectionKey: string;
  sections: NonNullable<Module["sections"]>;
  trackId: TrackId;
  sessionId?: string;
}) {
  if (sectionKey === "priorKnowledge") {
    return (
      <PriorKnowledgeSection
        prior={sections.priorKnowledge}
        trackId={trackId}
        sessionId={sessionId}
      />
    );
  }

  if (
    sectionKey === "connections" ||
    sectionKey === "likelyQuestions" ||
    sectionKey === "teachingEmphasis"
  ) {
    const items = sections[sectionKey] as string[];
    return (
      <ul className="list-disc space-y-2 pl-5 text-slate-700">
        {items.map((item, i) => (
          <li key={i}><InlineMarkdown text={item} /></li>
        ))}
      </ul>
    );
  }

  if (sectionKey === "misconceptions") {
    return (
      <ul className="space-y-3">
        {sections.misconceptions.map((m, i) => (
          <li key={i} className="rounded-lg bg-slate-50 p-3 print:break-inside-avoid">
            <p className="font-semibold text-slate-900"><InlineMarkdown text={m.myth} /></p>
            <p className="mt-1 text-sm text-slate-700">
              <InlineMarkdown text={m.clarification} />
            </p>
          </li>
        ))}
      </ul>
    );
  }

  const text = sections[sectionKey as keyof typeof sections];
  if (typeof text === "string") {
    return (
      <p className="text-slate-700 leading-relaxed">
        <InlineMarkdown text={text} />
      </p>
    );
  }

  return null;
}

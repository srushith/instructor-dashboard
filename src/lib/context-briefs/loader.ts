import { validateBriefsDocument } from "./schema";
import type { BriefsDocument, Module, Track, TrackId } from "./types";

let cachedDocument: BriefsDocument | null = null;

/** Lazy-load the full briefs JSON (server-only). */
export async function loadBriefsDocument(): Promise<BriefsDocument> {
  if (cachedDocument) return cachedDocument;
  const data = await import("@/content/instructor-context-briefs.json");
  cachedDocument = validateBriefsDocument(data.default) as BriefsDocument;
  return cachedDocument;
}

export function getTrack(doc: BriefsDocument, trackId: TrackId): Track | null {
  return doc.tracks.find((t) => t.id === trackId) ?? null;
}

export function getModuleById(
  doc: BriefsDocument,
  moduleId: string,
): Module | null {
  for (const track of doc.tracks) {
    const mod = track.modules.find((m) => m.id === moduleId);
    if (mod) return mod;
  }
  return null;
}

export function getModule(
  doc: BriefsDocument,
  trackId: TrackId,
  weekKey: string,
): Module | null {
  const track = getTrack(doc, trackId);
  if (!track) return null;
  const moduleId = track.moduleIndex[weekKey];
  if (!moduleId) return null;
  return getModuleById(doc, moduleId);
}

export function resolveShared(
  doc: BriefsDocument,
  module: Module,
): { source: Module; target: Module | null } {
  if (module.kind === "shared" && module.sharedWith) {
    const target = getModuleById(doc, module.sharedWith);
    return { source: module, target };
  }
  return { source: module, target: null };
}

export function getPrevNext(
  doc: BriefsDocument,
  trackId: TrackId,
  moduleId: string,
): { prev: Module | null; next: Module | null } {
  const track = getTrack(doc, trackId);
  if (!track) return { prev: null, next: null };
  const briefModules = track.modules.filter((m) => m.kind !== "orientation");
  const idx = briefModules.findIndex((m) => m.id === moduleId);
  if (idx === -1) return { prev: null, next: null };
  return {
    prev: idx > 0 ? briefModules[idx - 1] : null,
    next: idx < briefModules.length - 1 ? briefModules[idx + 1] : null,
  };
}

export function searchBriefs(doc: BriefsDocument, query: string): Module[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const results: Module[] = [];
  for (const track of doc.tracks) {
    for (const mod of track.modules) {
      const haystack = collectSearchText(mod).toLowerCase();
      if (haystack.includes(q)) results.push(mod);
    }
  }
  return results;
}

function collectSearchText(mod: Module): string {
  const parts = [mod.title, mod.subtitle ?? "", mod.code];
  if (mod.sections) {
    const s = mod.sections;
    parts.push(
      s.courseJourney,
      s.learnToday,
      s.preparesFor,
      s.oneMinuteRecap,
      ...s.connections,
      ...s.likelyQuestions,
      ...s.teachingEmphasis,
      ...s.misconceptions.flatMap((m) => [m.myth, m.clarification]),
      ...s.priorKnowledge.concepts.flatMap((c) => [c.label, c.text]),
      ...s.priorKnowledge.projects.flatMap((p) => [p.name, p.text, p.label]),
    );
  }
  if (mod.notes) parts.push(...mod.notes.map((n) => n.text));
  return parts.join(" ");
}

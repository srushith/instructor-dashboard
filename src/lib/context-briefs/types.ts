export type TrackId = "swe" | "em" | "pm";

export type ModuleKind = "brief" | "orientation" | "shared";

export type Phase =
  | "foundation"
  | "core"
  | "ops"
  | "capstone"
  | "interview-prep";

export type ProjectKind =
  | "project"
  | "assignment"
  | "post-class"
  | "optional"
  | "interview-case"
  | "capstone"
  | "capstone-option"
  | "rollup"
  | "other";

export interface Note {
  label: string | null;
  text: string;
}

export interface ProjectItem {
  label: string;
  name: string;
  weeks: string[];
  kind: ProjectKind;
  text: string;
  callbackLabel?: string;
  callback?: string;
}

export interface PriorKnowledge {
  intro: string | null;
  conceptsLabel: string;
  concepts: {
    label: string;
    weeks: string[];
    text: string;
  }[];
  projectsLabel: string;
  projects: ProjectItem[];
}

export interface BriefSections {
  courseJourney: string;
  priorKnowledge: PriorKnowledge;
  learnToday: string;
  preparesFor: string;
  connections: string[];
  likelyQuestions: string[];
  teachingEmphasis: string[];
  misconceptions: {
    myth: string;
    clarification: string;
  }[];
  oneMinuteRecap: string;
}

export interface Module {
  id: string;
  track: TrackId;
  order: number;
  code: string;
  title: string;
  subtitle: string | null;
  weekKey: string;
  weekLabel: string;
  weeks: string[];
  phase: Phase;
  kind: ModuleKind;
  group?: string;
  sharedWith?: string;
  notes?: Note[];
  sections?: BriefSections;
}

export interface Track {
  id: TrackId;
  name: string;
  shortName: string;
  heading: string;
  arc: string;
  groups: {
    id: string;
    title: string;
    intro: string[];
    notes?: Note[];
  }[];
  modules: Module[];
  moduleIndex: Record<string, string>;
}

export interface BriefsDocument {
  program: string;
  documentTitle: string;
  subtitle: string;
  version: string;
  sourceDocument: string;
  curriculumSheet: {
    title: string;
    url: string;
  };
  howToUse: string[];
  conventions: string[];
  trackMap: {
    header: string[];
    rows: string[][];
  };
  trackMapNote: string;
  sectionTitles: Record<keyof BriefSections, string>;
  tracks: Track[];
}

export type ModuleIndex = Record<TrackId, Record<string, string>>;

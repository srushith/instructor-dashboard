import { z } from "zod";

const trackIdSchema = z.enum(["swe", "em", "pm"]);
const moduleKindSchema = z.enum(["brief", "orientation", "shared"]);
const phaseSchema = z.enum([
  "foundation",
  "core",
  "ops",
  "capstone",
  "interview-prep",
]);
const projectKindSchema = z.enum([
  "project",
  "assignment",
  "post-class",
  "optional",
  "interview-case",
  "capstone",
  "capstone-option",
  "rollup",
  "other",
]);

const noteSchema = z.object({
  label: z.string().nullable(),
  text: z.string(),
});

const projectItemSchema = z.object({
  label: z.string(),
  name: z.string(),
  weeks: z.array(z.string()),
  kind: projectKindSchema,
  text: z.string(),
  callbackLabel: z.string().optional(),
  callback: z.string().optional(),
});

const priorKnowledgeSchema = z.object({
  intro: z.string().nullable(),
  conceptsLabel: z.string(),
  concepts: z.array(
    z.object({
      label: z.string(),
      weeks: z.array(z.string()),
      text: z.string(),
    }),
  ),
  projectsLabel: z.string(),
  projects: z.array(projectItemSchema),
});

const briefSectionsSchema = z.object({
  courseJourney: z.string(),
  priorKnowledge: priorKnowledgeSchema,
  learnToday: z.string(),
  preparesFor: z.string(),
  connections: z.array(z.string()),
  likelyQuestions: z.array(z.string()),
  teachingEmphasis: z.array(z.string()),
  misconceptions: z.array(
    z.object({
      myth: z.string(),
      clarification: z.string(),
    }),
  ),
  oneMinuteRecap: z.string(),
});

const moduleSchema = z.object({
  id: z.string(),
  track: trackIdSchema,
  order: z.number(),
  code: z.string(),
  title: z.string(),
  subtitle: z.string().nullable(),
  weekKey: z.string(),
  weekLabel: z.string(),
  weeks: z.array(z.string()),
  phase: phaseSchema,
  kind: moduleKindSchema,
  group: z.string().optional(),
  sharedWith: z.string().optional(),
  notes: z.array(noteSchema).optional(),
  sections: briefSectionsSchema.optional(),
});

export const briefsDocumentSchema = z.object({
  program: z.string(),
  documentTitle: z.string(),
  subtitle: z.string(),
  version: z.string(),
  sourceDocument: z.string(),
  curriculumSheet: z.object({
    title: z.string(),
    url: z.string(),
  }),
  howToUse: z.array(z.string()),
  conventions: z.array(z.string()),
  trackMap: z.object({
    header: z.array(z.string()),
    rows: z.array(z.array(z.string())),
  }),
  trackMapNote: z.string(),
  sectionTitles: z.object({
    courseJourney: z.string(),
    priorKnowledge: z.string(),
    learnToday: z.string(),
    preparesFor: z.string(),
    connections: z.string(),
    likelyQuestions: z.string(),
    teachingEmphasis: z.string(),
    misconceptions: z.string(),
    oneMinuteRecap: z.string(),
  }),
  tracks: z.array(
    z.object({
      id: trackIdSchema,
      name: z.string(),
      shortName: z.string(),
      heading: z.string(),
      arc: z.string(),
      groups: z.array(
        z.object({
          id: z.string(),
          title: z.string(),
          intro: z.array(z.string()),
          notes: z.array(noteSchema).optional(),
        }),
      ),
      modules: z.array(moduleSchema),
      moduleIndex: z.record(z.string(), z.string()),
    }),
  ),
});

export function validateBriefsDocument(data: unknown) {
  return briefsDocumentSchema.parse(data);
}

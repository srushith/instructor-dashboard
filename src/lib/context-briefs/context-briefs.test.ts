import { describe, expect, it } from "vitest";
import briefsJson from "@/content/instructor-context-briefs.json";
import { validateBriefsDocument } from "./schema";
import { normalizeWeekKey } from "./normalize-week-key";
import { resolveSessionContextBrief } from "./resolve-session";
import { contextBriefSessionOverrides } from "./session-overrides";
import { searchBriefs, getModule, loadBriefsDocument } from "./loader";
import type { ClassSession } from "@/lib/types";

function session(partial: Partial<ClassSession> & { id: string }): ClassSession {
  return {
    id: partial.id,
    cohort_id: partial.cohort_id ?? "c1",
    instructor_id: partial.instructor_id ?? "i1",
    week_number: partial.week_number ?? 5,
    week_label: partial.week_label ?? null,
    class_date: partial.class_date ?? "2026-08-01",
    drive_folder_url: null,
    curriculum_sheet_url: null,
    learner_background: null,
    rating: null,
    notes: null,
    created_at: "",
    updated_at: "",
    cohorts: partial.cohorts ?? { name: "SWE Batch", track: "swe" },
    profiles: null,
  };
}

describe("context briefs JSON schema", () => {
  it("validates the complete document", () => {
    const doc = validateBriefsDocument(briefsJson);
    expect(doc.tracks).toHaveLength(3);
    const modules = doc.tracks.flatMap((t) => t.modules);
    expect(modules).toHaveLength(45);
    expect(modules.filter((m) => m.kind === "brief")).toHaveLength(36);
    expect(modules.filter((m) => m.kind === "orientation")).toHaveLength(3);
    expect(modules.filter((m) => m.kind === "shared")).toHaveLength(6);
  });
});

describe("normalizeWeekKey", () => {
  it("normalizes week labels", () => {
    expect(normalizeWeekKey("W5")).toBe("W5");
    expect(normalizeWeekKey("Week 5")).toBe("W5");
    expect(normalizeWeekKey("8(a)")).toBe("W8a");
    expect(normalizeWeekKey("8A")).toBe("W8a");
    expect(normalizeWeekKey("8a")).toBe("W8a");
    expect(normalizeWeekKey("capstone")).toBe("capstone");
  });
});

describe("resolveSessionContextBrief", () => {
  it("resolves SWE Week 5", () => {
    const result = resolveSessionContextBrief(
      session({ id: "s1", week_number: 5, cohorts: { name: "SWE", track: "swe" } }),
    );
    expect(result).toEqual({ status: "found", moduleId: "swe-w05", trackId: "swe" });
  });

  it("resolves SWE Week 8(a)", () => {
    const result = resolveSessionContextBrief(
      session({
        id: "s2",
        week_number: 8,
        week_label: "8(a)",
        cohorts: { name: "SWE", track: "swe" },
      }),
    );
    expect(result).toEqual({ status: "found", moduleId: "swe-w08a", trackId: "swe" });
  });

  it("resolves EM Week 10", () => {
    const result = resolveSessionContextBrief(
      session({
        id: "s3",
        week_number: 10,
        cohorts: { name: "EM", track: "em" },
      }),
    );
    expect(result).toEqual({ status: "found", moduleId: "em-w10", trackId: "em" });
  });

  it("resolves SWE Capstone", () => {
    const result = resolveSessionContextBrief(
      session({
        id: "s4",
        week_number: 10,
        week_label: "capstone",
        cohorts: { name: "SWE", track: "swe" },
      }),
    );
    expect(result).toEqual({
      status: "found",
      moduleId: "swe-capstone",
      trackId: "swe",
    });
  });

  it("resolves PM Capstone", () => {
    const result = resolveSessionContextBrief(
      session({
        id: "s5",
        week_number: 8,
        week_label: "capstone",
        cohorts: { name: "PM", track: "pm" },
      }),
    );
    expect(result).toEqual({
      status: "found",
      moduleId: "pm-capstone",
      trackId: "pm",
    });
  });

  it("returns unmapped for unknown session", () => {
    const result = resolveSessionContextBrief(
      session({
        id: "s6",
        week_number: 99,
        cohorts: { name: "Unknown", track: null },
      }),
    );
    expect(result.status).toBe("unmapped");
  });

  it("returns none for override", () => {
    expect(contextBriefSessionOverrides["claude-code-floater-session"]).toBeNull();
    const result = resolveSessionContextBrief(
      session({ id: "claude-code-floater-session" }),
    );
    expect(result).toEqual({ status: "none" });
  });
});

describe("searchBriefs", () => {
  it('finds SnackStack modules', async () => {
    const doc = await loadBriefsDocument();
    const results = searchBriefs(doc, "SnackStack");
    const ids = results.map((m) => m.id).sort();
    expect(ids).toContain("swe-w05");
    expect(ids).toContain("swe-w07");
    expect(ids).toContain("swe-w08a");
    expect(ids).toContain("swe-w09");
    expect(ids).toContain("swe-w09a");
    expect(ids.length).toBeGreaterThanOrEqual(5);
  });
});

describe("shared EM modules", () => {
  it("EM Week 10 module links to SWE Week 12", async () => {
    const doc = await loadBriefsDocument();
    const em = getModule(doc, "em", "W10");
    expect(em?.id).toBe("em-w10");
    expect(em?.sharedWith).toBe("swe-w12");
  });
});

"use server";

import { revalidatePath } from "next/cache";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return profile;
}

export async function createCohort(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Cohort name is required" };

  const supabase = await createClient();
  const { error } = await supabase.from("cohorts").insert({ name });
  if (error) return { error: error.message };

  revalidatePath("/admin");
  return { success: true };
}

export async function createSession(formData: FormData) {
  await requireAdmin();

  const cohortId = String(formData.get("cohort_id") ?? "");
  const instructorId = String(formData.get("instructor_id") ?? "");
  const weekNumber = Number(formData.get("week_number"));
  const classDate = String(formData.get("class_date") ?? "");
  const driveFolderUrl = String(formData.get("drive_folder_url") ?? "").trim();
  const curriculumSheetUrl = String(formData.get("curriculum_sheet_url") ?? "").trim();
  const learnerBackground = String(formData.get("learner_background") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!cohortId || !instructorId || !weekNumber || !classDate) {
    return { error: "Cohort, instructor, week, and date are required" };
  }

  const rating = ratingRaw ? Number(ratingRaw) : null;

  const supabase = await createClient();
  const { error } = await supabase.from("class_sessions").insert({
    cohort_id: cohortId,
    instructor_id: instructorId,
    week_number: weekNumber,
    class_date: classDate,
    drive_folder_url: driveFolderUrl || null,
    curriculum_sheet_url: curriculumSheetUrl || null,
    learner_background: learnerBackground || null,
    rating,
    notes: notes || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateSession(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const cohortId = String(formData.get("cohort_id") ?? "");
  const instructorId = String(formData.get("instructor_id") ?? "");
  const weekNumber = Number(formData.get("week_number"));
  const classDate = String(formData.get("class_date") ?? "");
  const driveFolderUrl = String(formData.get("drive_folder_url") ?? "").trim();
  const curriculumSheetUrl = String(formData.get("curriculum_sheet_url") ?? "").trim();
  const learnerBackground = String(formData.get("learner_background") ?? "").trim();
  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  if (!id) return { error: "Session id is required" };

  const rating = ratingRaw ? Number(ratingRaw) : null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("class_sessions")
    .update({
      cohort_id: cohortId,
      instructor_id: instructorId,
      week_number: weekNumber,
      class_date: classDate,
      drive_folder_url: driveFolderUrl || null,
      curriculum_sheet_url: curriculumSheetUrl || null,
      learner_background: learnerBackground || null,
      rating,
      notes: notes || null,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteSession(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { error: "Session id is required" };

  const supabase = await createClient();
  const { error } = await supabase.from("class_sessions").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}

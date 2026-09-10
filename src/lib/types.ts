export type UserRole = "admin" | "instructor";

export type TrackId = "swe" | "em" | "pm";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
};

export type Cohort = {
  id: string;
  name: string;
  track: TrackId | null;
};

export type ClassSession = {
  id: string;
  cohort_id: string;
  instructor_id: string;
  week_number: number;
  week_label: string | null;
  class_date: string;
  drive_folder_url: string | null;
  curriculum_sheet_url: string | null;
  learner_background: string | null;
  rating: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  cohorts?: { name: string; track: TrackId | null } | null;
  profiles?: { full_name: string | null; email: string } | null;
};

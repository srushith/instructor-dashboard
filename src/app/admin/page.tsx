import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { SessionForm } from "@/components/admin/SessionForm";
import { CohortForm } from "@/components/admin/CohortForm";
import { AdminSessionList } from "@/components/admin/AdminSessionList";
import type { ClassSession, Cohort, Profile } from "@/lib/types";

export default async function AdminPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");
  if (profile.role !== "admin") redirect("/dashboard");

  const supabase = await createClient();

  const [{ data: cohorts }, { data: instructors }, { data: sessions }] =
    await Promise.all([
      supabase.from("cohorts").select("id, name").order("name"),
      supabase
        .from("profiles")
        .select("id, email, full_name, role")
        .order("full_name"),
      supabase
        .from("class_sessions")
        .select(
          "*, cohorts(name), profiles!class_sessions_instructor_id_fkey(full_name, email)",
        )
        .order("class_date", { ascending: false }),
    ]);

  const typedCohorts = (cohorts ?? []) as Cohort[];
  const typedInstructors = (instructors ?? []) as Profile[];
  const typedSessions = (sessions ?? []) as ClassSession[];

  return (
    <div className="min-h-full bg-slate-100">
      <Header profile={profile} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Admin panel</h1>
          <p className="mt-1 text-slate-600">
            Update weekly class data — drive folders, curriculum links, learner
            background, and post-class ratings.
          </p>
        </div>

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Cohorts</h2>
          <CohortForm />
          {typedCohorts.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-2">
              {typedCohorts.map((cohort) => (
                <li
                  key={cohort.id}
                  className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                >
                  {cohort.name}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mb-8">
          <SessionForm cohorts={typedCohorts} instructors={typedInstructors} />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            All sessions
          </h2>
          <AdminSessionList
            sessions={typedSessions}
            cohorts={typedCohorts}
            instructors={typedInstructors}
          />
        </section>

        <section className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-medium">Instructor onboarding</p>
          <p className="mt-1">
            Instructors appear here after they sign in with Google for the first
            time. Assign sessions to their account by selecting them in the form
            above.
          </p>
          <p className="mt-2">
            To make yourself admin, run in Supabase SQL Editor after first login:
          </p>
          <code className="mt-1 block rounded bg-white px-2 py-1 text-xs">
            update profiles set role = &apos;admin&apos; where email =
            &apos;your-email@gmail.com&apos;;
          </code>
        </section>
      </main>
    </div>
  );
}

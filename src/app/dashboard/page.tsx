import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { SessionCard } from "@/components/SessionCard";
import type { ClassSession } from "@/lib/types";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("class_sessions")
    .select(
      "*, cohorts(name), profiles!class_sessions_instructor_id_fkey(full_name, email)",
    )
    .eq("instructor_id", profile.id)
    .order("class_date", { ascending: true });

  const typedSessions = (sessions ?? []) as ClassSession[];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = typedSessions.filter((s) => s.class_date >= today);
  const past = typedSessions.filter((s) => s.class_date < today).reverse();
  const ratedCount = typedSessions.filter((s) => s.rating != null).length;
  const avgRating =
    ratedCount > 0
      ? (
          typedSessions
            .filter((s) => s.rating != null)
            .reduce((sum, s) => sum + (s.rating ?? 0), 0) / ratedCount
        ).toFixed(1)
      : null;

  return (
    <div className="min-h-full bg-slate-100">
      <Header profile={profile} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Your classes</h1>
          <p className="mt-1 text-slate-600">
            Content folders, curriculum sheets, learner background, and ratings for
            your assigned sessions.
          </p>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Upcoming" value={String(upcoming.length)} />
          <StatCard label="Completed" value={String(past.length)} />
          <StatCard
            label="Average rating"
            value={avgRating ?? "—"}
            hint={ratedCount > 0 ? `${ratedCount} rated sessions` : "No ratings yet"}
          />
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Upcoming</h2>
          {upcoming.length === 0 ? (
            <EmptyState message="No upcoming classes assigned to you." />
          ) : (
            <div className="grid gap-4">
              {upcoming.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Past sessions</h2>
          {past.length === 0 ? (
            <EmptyState message="No past sessions yet." />
          ) : (
            <div className="grid gap-4">
              {past.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-10 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

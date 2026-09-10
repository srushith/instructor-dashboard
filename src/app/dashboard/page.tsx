import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/Header";
import { SessionCard } from "@/components/SessionCard";
import { NextClassHero } from "@/components/context-briefs/NextClassHero";
import { getModuleById, loadBriefsDocument } from "@/lib/context-briefs/loader";
import { resolveSessionContextBrief } from "@/lib/context-briefs/resolve-session";
import { loadWeekBriefsByWeek } from "@/lib/week-briefs/loader";
import { getWeekBriefForSession } from "@/lib/week-briefs/resolve-week-label";
import type { ClassSession } from "@/lib/types";

export default async function DashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const supabase = await createClient();
  const { data: sessions } = await supabase
    .from("class_sessions")
    .select(
      "*, cohorts(name, track), profiles!class_sessions_instructor_id_fkey(full_name, email)",
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

  const [weekBriefs, briefsDoc] = await Promise.all([
    loadWeekBriefsByWeek(),
    loadBriefsDocument(),
  ]);

  const nextSession = upcoming[0] ?? null;
  let nextBriefModule = null;
  let nextResolution = null;
  let nextWeekBrief = null;

  if (nextSession) {
    nextResolution = resolveSessionContextBrief(nextSession);
    nextWeekBrief = getWeekBriefForSession(weekBriefs, nextSession);
    if (nextResolution.status === "found") {
      nextBriefModule = getModuleById(briefsDoc, nextResolution.moduleId);
    }
  }

  function sessionMeta(session: ClassSession) {
    const resolution = resolveSessionContextBrief(session);
    const weekBrief = getWeekBriefForSession(weekBriefs, session);
    const module =
      resolution.status === "found"
        ? getModuleById(briefsDoc, resolution.moduleId)
        : null;
    return { resolution, weekBrief, module };
  }

  return (
    <div className="min-h-full">
      <Header profile={profile} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient">Your classes</h1>
          <p className="mt-2 text-slate-400">
            Prep for each week with context briefs, teaching emphasis, likely questions,
            and learner background.
          </p>
        </div>

        {nextSession && (
          <NextClassHero
            session={nextSession}
            module={nextBriefModule}
            moduleId={
              nextResolution?.status === "found" ? nextResolution.moduleId : null
            }
            trackId={
              nextResolution?.status === "found" ? nextResolution.trackId : null
            }
            weekBrief={nextWeekBrief}
          />
        )}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <StatCard label="Upcoming" value={String(upcoming.length)} accent="cyan" />
          <StatCard label="Completed" value={String(past.length)} accent="violet" />
          <StatCard
            label="Average rating"
            value={avgRating ?? "—"}
            hint={ratedCount > 0 ? `${ratedCount} rated sessions` : "No ratings yet"}
            accent="amber"
          />
        </div>

        <section className="mb-10">
          <h2 className="mb-4 text-lg font-semibold text-white">Upcoming</h2>
          {upcoming.length === 0 ? (
            <EmptyState message="No upcoming classes assigned to you." />
          ) : (
            <div className="grid gap-4">
              {upcoming.map((session, index) => {
                const { resolution, weekBrief, module } = sessionMeta(session);
                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    module={module}
                    weekBrief={weekBrief}
                    featured={index === 0}
                    contextBriefModuleId={
                      resolution?.status === "found" ? resolution.moduleId : null
                    }
                    contextBriefTrackId={
                      resolution?.status === "found" ? resolution.trackId : null
                    }
                    contextBriefStatus={resolution?.status ?? "unmapped"}
                  />
                );
              })}
            </div>
          )}
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold text-white">Past sessions</h2>
          {past.length === 0 ? (
            <EmptyState message="No past sessions yet." />
          ) : (
            <div className="grid gap-4">
              {past.map((session) => {
                const { resolution, weekBrief, module } = sessionMeta(session);
                return (
                  <SessionCard
                    key={session.id}
                    session={session}
                    module={module}
                    weekBrief={weekBrief}
                    contextBriefModuleId={
                      resolution?.status === "found" ? resolution.moduleId : null
                    }
                    contextBriefTrackId={
                      resolution?.status === "found" ? resolution.trackId : null
                    }
                    contextBriefStatus={resolution?.status ?? "unmapped"}
                  />
                );
              })}
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
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent: "cyan" | "violet" | "amber";
}) {
  const colors = {
    cyan: "border-cyan-500/30 from-cyan-500/10",
    violet: "border-violet-500/30 from-violet-500/10",
    amber: "border-amber-500/30 from-amber-500/10",
  };

  return (
    <div
      className={`glass-card rounded-2xl border bg-gradient-to-br to-transparent p-4 ${colors[accent]}`}
    >
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="glass-card rounded-2xl border-dashed border-white/15 px-4 py-10 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}

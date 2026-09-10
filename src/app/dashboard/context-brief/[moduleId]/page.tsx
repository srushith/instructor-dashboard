import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { Header } from "@/components/Header";
import { ContextBriefView } from "@/components/context-briefs/ContextBriefView";
import {
  getModuleById,
  getPrevNext,
  loadBriefsDocument,
  resolveShared,
} from "@/lib/context-briefs/loader";
import type { TrackId } from "@/lib/types";

type PageProps = {
  params: Promise<{ moduleId: string }>;
  searchParams: Promise<{ session?: string; viewerTrack?: string }>;
};

export default async function ContextBriefPage({ params, searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const { moduleId } = await params;
  const { session: sessionId, viewerTrack } = await searchParams;

  const doc = await loadBriefsDocument();
  const module = getModuleById(doc, moduleId);

  if (!module) {
    return (
      <div className="min-h-full bg-slate-100">
        <Header profile={profile} />
        <main className="mx-auto max-w-2xl px-4 py-16 text-center">
          <h1 className="text-xl font-bold text-slate-900">
            We couldn&apos;t find a context brief for this class yet.
          </h1>
          <Link href="/dashboard" className="mt-4 inline-block text-indigo-600">
            ← Back to dashboard
          </Link>
        </main>
      </div>
    );
  }

  const trackId = module.track;
  const viewer = (viewerTrack as TrackId) ?? trackId;
  const { source, target } = resolveShared(doc, module);
  const displayModule =
    module.kind === "shared" && target?.sections ? target : module;
  const { prev, next } = getPrevNext(doc, trackId, module.id);

  return (
    <div className="min-h-full bg-slate-100">
      <Header profile={profile} />
      <div className="no-print border-b border-slate-200 bg-white px-4 py-2">
        <Link href="/dashboard" className="text-sm text-indigo-600 hover:text-indigo-800">
          ← Back to dashboard
        </Link>
      </div>
      <ContextBriefView
        doc={doc}
        module={module}
        displayModule={displayModule}
        trackId={trackId}
        viewerTrack={viewer}
        sessionId={sessionId}
        prev={prev}
        next={next}
        emSourceModule={module.kind === "shared" ? source : null}
      />
    </div>
  );
}

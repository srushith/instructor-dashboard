import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="app-shell flex min-h-full flex-1 items-center justify-center px-4 py-12">
      <div className="glass-card w-full max-w-md rounded-3xl p-8">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400">
            Agentic AI 2.0
          </p>
          <h1 className="mt-2 text-3xl font-bold text-gradient">Instructor Portal</h1>
          <p className="mt-3 text-sm text-slate-400">
            Context briefs, class prep, learner background, and session insights —
            all in one place.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            Sign-in failed. Please try again.
          </div>
        )}

        <GoogleSignInButton />

        <p className="mt-6 text-center text-xs text-slate-500">
          Sign in with Google. Contact ops if you need access.
        </p>
      </div>
    </div>
  );
}

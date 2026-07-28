import { GoogleSignInButton } from "@/components/GoogleSignInButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Instructor Portal</h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to view your class schedule, content links, learner background,
            and session ratings.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            Sign-in failed. Please try again.
          </div>
        )}

        <GoogleSignInButton />

        <p className="mt-6 text-center text-xs text-slate-500">
          Instructors and admins use Google sign-in. Contact ops if you need access.
        </p>
      </div>
    </div>
  );
}

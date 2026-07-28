export default function SetupPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-slate-100 px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-amber-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-bold text-slate-900">Supabase not configured</h1>
        <p className="mt-3 text-sm text-slate-600">
          Your <code className="rounded bg-slate-100 px-1">.env.local</code> file is
          missing or still has placeholder values.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-slate-700">
          <li>Create a project at supabase.com</li>
          <li>
            Copy <strong>Project URL</strong> and <strong>anon public key</strong> from
            Settings → API
          </li>
          <li>
            Edit <code className="rounded bg-slate-100 px-1">.env.local</code>:
            <pre className="mt-2 rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
              NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
              {"\n"}
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your-real-anon-key
            </pre>
          </li>
          <li>Restart the dev server (<code className="rounded bg-slate-100 px-1">npm run dev</code>)</li>
        </ol>
      </div>
    </div>
  );
}

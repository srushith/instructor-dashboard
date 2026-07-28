"use client";

import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

type HeaderProps = {
  profile: Profile;
};

export function Header({ profile }: HeaderProps) {
  const supabase = createClient();

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="text-lg font-semibold text-slate-900">
            Instructor Portal
          </p>
          <p className="text-sm text-slate-500">
            {profile.full_name ?? profile.email}
            {profile.role === "admin" && (
              <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                Admin
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {profile.role === "admin" && (
            <a
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              Admin panel
            </a>
          )}
          {profile.role === "admin" && (
            <a
              href="/dashboard"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              My classes
            </a>
          )}
          <button
            onClick={signOut}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

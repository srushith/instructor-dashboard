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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div>
          <p className="text-lg font-bold text-gradient">Instructor Portal</p>
          <p className="text-sm text-slate-400">
            {profile.full_name ?? profile.email}
            {profile.role === "admin" && (
              <span className="ml-2 rounded-full bg-violet-500/20 px-2 py-0.5 text-xs font-medium text-violet-300">
                Admin
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {profile.role === "admin" && (
            <>
              <a href="/admin" className="btn-ghost rounded-lg px-3 py-2 text-sm">
                Admin
              </a>
              <a href="/dashboard" className="btn-ghost rounded-lg px-3 py-2 text-sm">
                Classes
              </a>
            </>
          )}
          <button
            onClick={signOut}
            className="btn-ghost rounded-lg px-3 py-2 text-sm"
          >
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

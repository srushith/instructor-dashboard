# Instructor Portal

A web dashboard where instructors sign in with Google and view their assigned classes — content drive folder, curriculum sheet, learner background, and post-class ratings. Admins update this data weekly from an in-app panel.

## Features

- **Google sign-in** for instructors and admins
- **Instructor dashboard** — upcoming and past sessions with links and ratings
- **Admin panel** — add cohorts, create/edit weekly sessions, update ratings
- **Row-level security** — instructors only see their own sessions

## Tech stack

- Next.js (App Router)
- Supabase (Auth + PostgreSQL)
- Tailwind CSS
- Deploy on Vercel

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Open **SQL Editor** and run the full script in `supabase/schema.sql`.
3. Copy your project URL and anon key from **Settings → API**.

### 2. Enable Google OAuth

**In Supabase (Authentication → Providers → Google):**

1. Enable Google provider.
2. Add your Google OAuth client ID and secret (from Google Cloud Console).
3. Under **Authentication → URL Configuration**, set:
   - Site URL: `http://localhost:3000` (change to your Vercel URL after deploy)
   - Redirect URLs: `http://localhost:3000/auth/callback` and `https://your-domain.vercel.app/auth/callback`

**In Google Cloud Console:**

1. Create OAuth 2.0 credentials (Web application).
2. Authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`

### 3. Environment variables

Copy `.env.local.example` to `.env.local`:

```bash
cp .env.local.example .env.local
```

Fill in:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create your admin account

1. Sign in with Google once (creates your profile as `instructor`).
2. In Supabase SQL Editor, promote yourself to admin:

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@gmail.com';
```

3. Sign out and sign in again — you will land on the admin panel.

## Context briefs (Agentic AI 2.0)

Instructors see an **Open context brief** button on every session card. The next upcoming class highlights the **1-minute recap** at the top of the dashboard.

### Session → brief mapping

1. Cohort **track** (`swe`, `em`, `pm`) — set when creating a cohort in admin
2. Session **week label** — e.g. `Week 5`, `8(a)`, or `capstone` (optional; falls back to week number)
3. Resolves to the correct module in `src/content/instructor-context-briefs.json`

Run this SQL migration on Supabase if your project was created before context briefs:

```sql
-- see supabase/migrations/002_context_brief_fields.sql
```

### Updating context briefs

1. Replace content by re-parsing the Word doc:
   ```bash
   npm run generate:briefs
   ```
   Source file: `Instructor_Context_Briefs_Agentic_AI_2_0_v2.docx`
2. Do **not** edit brief text inside React components
3. Verify:
   ```bash
   npm test
   npm run lint
   npm run typecheck
   ```
4. Spot-check a few dashboard sessions (SWE Week 5, EM Week 10, capstone)

The ~264 KB JSON is lazy-loaded on the context brief page only — not bundled into the main dashboard client JS.

## Weekly workflow

1. **Before class** — In admin panel, add or edit the session row:
   - Week number, date, cohort, instructor
   - Content drive folder URL
   - Curriculum sheet URL
   - Learner background
2. **Instructor** — Logs in and sees everything on their dashboard.
3. **After class** — Edit the same row and add **rating** and **notes**.

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Add the same env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
4. Update Supabase Site URL and redirect URLs to your Vercel domain.

## Project structure

```
src/app/
  login/          # Google sign-in
  dashboard/      # Instructor view
  admin/          # Weekly data updates
  auth/callback/  # OAuth callback
supabase/
  schema.sql      # Database + RLS policies
```

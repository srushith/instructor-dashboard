-- Run this in the Supabase SQL Editor after creating your project.

create type user_role as enum ('admin', 'instructor');

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  full_name text,
  role user_role not null default 'instructor',
  created_at timestamptz not null default now()
);

create type public.track_id as enum ('swe', 'em', 'pm');

create table public.cohorts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  track public.track_id,
  created_at timestamptz not null default now()
);

create table public.class_sessions (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts(id) on delete cascade,
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  week_number int not null check (week_number > 0),
  week_label text,
  class_date date not null,
  drive_folder_url text,
  curriculum_sheet_url text,
  learner_background text,
  rating numeric(2,1) check (rating is null or (rating >= 0 and rating <= 5)),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index class_sessions_instructor_id_idx on public.class_sessions(instructor_id);
create index class_sessions_class_date_idx on public.class_sessions(class_date);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    'instructor'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger class_sessions_updated_at
  before update on public.class_sessions
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.cohorts enable row level security;
alter table public.class_sessions enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- Profiles
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Admins can update profiles"
  on public.profiles for update
  using (public.is_admin());

-- Cohorts
create policy "Authenticated users can read cohorts"
  on public.cohorts for select
  using (auth.uid() is not null);

create policy "Admins manage cohorts"
  on public.cohorts for all
  using (public.is_admin())
  with check (public.is_admin());

-- Class sessions
create policy "Instructors read own sessions"
  on public.class_sessions for select
  using (instructor_id = auth.uid() or public.is_admin());

create policy "Admins manage sessions"
  on public.class_sessions for all
  using (public.is_admin())
  with check (public.is_admin());

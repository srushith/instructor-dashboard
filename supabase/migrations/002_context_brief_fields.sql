-- Add track to cohorts and week_label to class_sessions for context brief resolution.

create type public.track_id as enum ('swe', 'em', 'pm');

alter table public.cohorts
  add column if not exists track public.track_id;

alter table public.class_sessions
  add column if not exists week_label text;

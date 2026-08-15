-- Run once in Supabase Dashboard -> SQL Editor.
create table if not exists public.user_work_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  profile_type text not null check (profile_type in ('company','influencer','other')),
  profile_data jsonb not null default '{}'::jsonb,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists user_work_profiles_type_idx on public.user_work_profiles(profile_type);
create index if not exists user_work_profiles_data_idx on public.user_work_profiles using gin(profile_data);
alter table public.user_work_profiles enable row level security;
revoke all on table public.user_work_profiles from anon, authenticated;
grant all on table public.user_work_profiles to service_role;
notify pgrst, 'reload schema';

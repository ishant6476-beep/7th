-- Run once in Supabase Dashboard -> SQL Editor.
-- Intake submissions are inserted only by the server-side Vercel function
-- using SUPABASE_SERVICE_ROLE_KEY. No public/anonymous table policy is created.

create extension if not exists pgcrypto;

create table if not exists public.marketing_intakes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  profile_type text not null check (profile_type in ('influencer', 'company', 'agency')),
  full_name text not null,
  email text not null,
  phone text not null,
  preferred_contact text not null,
  services text[] not null default '{}',
  details jsonb not null default '{}'::jsonb,
  consent boolean not null default false,
  status text not null default 'new' check (status in ('new', 'reviewing', 'contacted', 'qualified', 'proposal', 'won', 'lost', 'archived')),
  source text not null default 'website_chatbot',
  user_agent text
);

create index if not exists marketing_intakes_created_at_idx
  on public.marketing_intakes (created_at desc);
create index if not exists marketing_intakes_profile_type_idx
  on public.marketing_intakes (profile_type);
create index if not exists marketing_intakes_status_idx
  on public.marketing_intakes (status);
create index if not exists marketing_intakes_email_idx
  on public.marketing_intakes (lower(email));
create index if not exists marketing_intakes_services_gin_idx
  on public.marketing_intakes using gin (services);
create index if not exists marketing_intakes_details_gin_idx
  on public.marketing_intakes using gin (details);

alter table public.marketing_intakes enable row level security;

-- Keep the table private from browser clients. The service-role key bypasses RLS.
revoke all on table public.marketing_intakes from anon, authenticated;

grant all on table public.marketing_intakes to service_role;

create or replace function public.set_marketing_intakes_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists marketing_intakes_set_updated_at on public.marketing_intakes;
create trigger marketing_intakes_set_updated_at
before update on public.marketing_intakes
for each row execute function public.set_marketing_intakes_updated_at();

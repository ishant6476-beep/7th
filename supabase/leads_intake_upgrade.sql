-- Run once in Supabase Dashboard -> SQL Editor.
-- This keeps the existing website contact form and the new Influencer,
-- Company and Agency questionnaires together in public.leads.

create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text,
  company text,
  service text,
  budget text,
  message text not null,
  status text not null default 'new',
  notes text,
  follow_up_date date
);

alter table public.leads add column if not exists profile_type text;
alter table public.leads add column if not exists preferred_contact text;
alter table public.leads add column if not exists services text[] not null default '{}';
alter table public.leads add column if not exists intake_details jsonb not null default '{}'::jsonb;
alter table public.leads add column if not exists consent boolean not null default false;
alter table public.leads add column if not exists source text not null default 'website_contact';
alter table public.leads add column if not exists user_agent text;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_profile_type_idx on public.leads (profile_type);
create index if not exists leads_status_idx on public.leads (status);
create index if not exists leads_email_lower_idx on public.leads (lower(email));
create index if not exists leads_services_gin_idx on public.leads using gin (services);
create index if not exists leads_intake_details_gin_idx on public.leads using gin (intake_details);

alter table public.leads enable row level security;
grant insert on table public.leads to anon, authenticated;
grant all on table public.leads to service_role;

-- Permit the original browser contact form to create a lead, without granting
-- public read/update/delete access.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'leads'
      and policyname = 'public_can_submit_leads'
  ) then
    create policy public_can_submit_leads
      on public.leads
      for insert
      to anon, authenticated
      with check (
        char_length(coalesce(name, '')) between 2 and 200
        and char_length(coalesce(email, '')) between 3 and 254
        and char_length(coalesce(message, '')) between 1 and 6000
      );
  end if;
end
$$;

-- Ask PostgREST to recognize the newly added columns immediately.
notify pgrst, 'reload schema';

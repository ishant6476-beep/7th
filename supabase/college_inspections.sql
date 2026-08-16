-- Prime Polo EduEx: public college consultation submissions + private CRM records.
-- Run once in Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.college_inspections (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  student_name text not null,
  email text not null,
  phone text not null,
  whatsapp text not null,
  parent_name text not null,
  parent_phone text not null,
  city text not null,
  state text not null,
  pincode text not null,

  current_qualification text not null,
  desired_level text not null,
  preferred_course text not null,
  course_categories text[] not null default '{}',
  preferred_destination text not null,
  preferred_intake text not null,
  annual_budget text not null,

  loan_interest text not null,
  expected_loan_amount text,

  status text not null default 'new'
    check (status in ('new','reviewing','contacted','documents_pending','shortlisted','application_started','admitted','closed','not_qualified')),
  assigned_to text,
  staff_notes text,
  follow_up_date date,

  consent boolean not null default false,
  source text not null default 'eduex_public_form',
  form_data jsonb not null default '{}'::jsonb,
  user_agent text
);

create index if not exists college_inspections_created_idx on public.college_inspections(created_at desc);
create index if not exists college_inspections_status_idx on public.college_inspections(status);
create index if not exists college_inspections_email_idx on public.college_inspections(lower(email));
create index if not exists college_inspections_phone_idx on public.college_inspections(phone);
create index if not exists college_inspections_courses_idx on public.college_inspections using gin(course_categories);
create index if not exists college_inspections_data_idx on public.college_inspections using gin(form_data);

alter table public.college_inspections enable row level security;
revoke all on table public.college_inspections from anon, authenticated;
grant all on table public.college_inspections to service_role;

create or replace function public.set_college_inspections_updated_at()
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

drop trigger if exists college_inspections_updated_at on public.college_inspections;
create trigger college_inspections_updated_at
before update on public.college_inspections
for each row execute function public.set_college_inspections_updated_at();

notify pgrst, 'reload schema';

-- Prime Polo production schema. Run once in the Supabase SQL editor.
create extension if not exists pgcrypto;

do $$ begin
  create type public.user_role as enum ('company', 'influencer', 'freelancer', 'other');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.staff_role as enum ('admin', 'staff');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text,
  phone text,
  company text,
  avatar_url text,
  role public.user_role not null default 'other',
  created_at timestamptz not null default now()
);

create table if not exists public.staff_roles (
  id uuid primary key references auth.users(id) on delete cascade,
  role public.staff_role not null default 'staff',
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  company text,
  message text not null,
  budget text,
  service text,
  status text not null default 'new' check (status in ('new','contacted','qualified','proposal','won','lost')),
  assigned_staff uuid references public.staff_roles(id) on delete set null,
  notes text,
  follow_up_date date,
  created_at timestamptz not null default now()
);

create table if not exists public.chat_logs (
  id uuid primary key default gen_random_uuid(),
  user_message text not null,
  bot_reply text not null,
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on public.leads(created_at desc);
create index if not exists leads_status_idx on public.leads(status);
create index if not exists chat_logs_created_at_idx on public.chat_logs(created_at desc);

alter table public.profiles enable row level security;
alter table public.staff_roles enable row level security;
alter table public.leads enable row level security;
alter table public.chat_logs enable row level security;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.staff_roles where id = auth.uid());
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.staff_roles where id = auth.uid() and role = 'admin');
$$;

revoke all on function public.is_staff() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_staff() to authenticated;
grant execute on function public.is_admin() to authenticated;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "profiles_delete_own" on public.profiles;
create policy "profiles_delete_own" on public.profiles for delete to authenticated using (auth.uid() = id);

drop policy if exists "staff_roles_select_own" on public.staff_roles;
create policy "staff_roles_select_own" on public.staff_roles for select to authenticated using (auth.uid() = id);

drop policy if exists "leads_public_insert" on public.leads;
create policy "leads_public_insert" on public.leads for insert to anon, authenticated
  with check (status = 'new' and assigned_staff is null and notes is null and follow_up_date is null);
drop policy if exists "leads_staff_select" on public.leads;
create policy "leads_staff_select" on public.leads for select to authenticated using (public.is_staff());
drop policy if exists "leads_staff_update" on public.leads;
create policy "leads_staff_update" on public.leads for update to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "chat_logs_public_insert" on public.chat_logs;
create policy "chat_logs_public_insert" on public.chat_logs for insert to anon, authenticated with check (true);
drop policy if exists "chat_logs_staff_select" on public.chat_logs;
create policy "chat_logs_staff_select" on public.chat_logs for select to authenticated using (public.is_staff());

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  requested_role public.user_role;
begin
  requested_role := case
    when new.raw_user_meta_data ->> 'role' in ('company','influencer','freelancer','other')
      then (new.raw_user_meta_data ->> 'role')::public.user_role
    else 'other'::public.user_role
  end;

  insert into public.profiles (id, name, email, avatar_url, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.email,
    new.raw_user_meta_data ->> 'avatar_url',
    requested_role
  )
  on conflict (id) do update set
    name = coalesce(excluded.name, public.profiles.name),
    email = excluded.email,
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Allows an authenticated customer to delete only their own Auth account.
create or replace function public.delete_own_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_own_account() from public;
grant execute on function public.delete_own_account() to authenticated;

grant usage on schema public to anon, authenticated;
grant insert on public.leads, public.chat_logs to anon, authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select on public.staff_roles to authenticated;
grant select, update on public.leads to authenticated;
grant select on public.chat_logs to authenticated;
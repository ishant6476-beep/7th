-- Prime Polo Website Content Manager
-- Run once in Supabase Dashboard -> SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  draft_content jsonb not null default '{}'::jsonb,
  published_content jsonb not null default '{}'::jsonb,
  updated_by uuid references auth.users(id) on delete set null,
  published_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_content_history (
  id uuid primary key default gen_random_uuid(),
  content_id uuid not null references public.site_content(id) on delete cascade,
  content_key text not null,
  content jsonb not null,
  action text not null check (action in ('draft_saved','published','rolled_back')),
  changed_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.site_media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null unique,
  public_url text not null,
  content_type text,
  size_bytes bigint,
  alt_text text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists site_content_key_idx on public.site_content(content_key);
create index if not exists site_content_history_key_idx on public.site_content_history(content_key,created_at desc);
create index if not exists site_media_created_idx on public.site_media_assets(created_at desc);

alter table public.site_content enable row level security;
alter table public.site_content_history enable row level security;
alter table public.site_media_assets enable row level security;
revoke all on public.site_content,public.site_content_history,public.site_media_assets from anon,authenticated;
grant all on public.site_content,public.site_content_history,public.site_media_assets to service_role;

-- Public media bucket. Writes happen only through the authenticated server API.
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('site-media','site-media',true,5242880,array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update set public=true,file_size_limit=5242880,allowed_mime_types=array['image/jpeg','image/png','image/webp','image/gif'];

create or replace function public.set_site_content_updated_at()
returns trigger language plpgsql security invoker set search_path=public as $$
begin new.updated_at=now();return new;end;$$;
drop trigger if exists site_content_updated_at on public.site_content;
create trigger site_content_updated_at before update on public.site_content for each row execute function public.set_site_content_updated_at();

notify pgrst,'reload schema';

create extension if not exists pgcrypto;

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  topic text not null default '',
  audience text not null default '',
  goal text not null default '',
  brand_tone text not null default '',
  avoid text not null default '',
  platforms jsonb not null default '[]'::jsonb,
  assets jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.campaigns enable row level security;

-- The server route uses SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
-- Do not expose that key in browser code.

create extension if not exists pgcrypto;

create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
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

create index if not exists campaigns_user_updated_idx
  on public.campaigns(user_id, updated_at desc);

-- If the table already existed before authentication was added:
-- alter table public.campaigns add column if not exists user_id uuid references auth.users(id) on delete cascade;

create policy "Users can read their campaigns"
  on public.campaigns for select
  using (auth.uid() = user_id);

create policy "Users can insert their campaigns"
  on public.campaigns for insert
  with check (auth.uid() = user_id);

create policy "Users can update their campaigns"
  on public.campaigns for update
  using (auth.uid() = user_id);

create policy "Users can delete their campaigns"
  on public.campaigns for delete
  using (auth.uid() = user_id);

-- The server route uses SUPABASE_SERVICE_ROLE_KEY for database writes,
-- but verifies the signed-in Supabase user before every campaign operation.
-- Never expose SUPABASE_SERVICE_ROLE_KEY to browser code.

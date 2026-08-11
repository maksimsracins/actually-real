create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  verdict text not null,
  confidence_score numeric not null,
  confidence_band text not null,
  result jsonb not null,
  image_path text not null,
  created_at timestamptz not null default now()
);

create index if not exists scans_user_id_created_at_idx
  on public.scans (user_id, created_at desc);

-- RLS is on with zero policies: only the service_role key (used exclusively by
-- our backend, never shipped to the app) can read/write this table. The
-- mobile app never talks to Supabase directly for data, only for anonymous
-- auth, so there's no anon/authenticated policy to add.
alter table public.scans enable row level security;

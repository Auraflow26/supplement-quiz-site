-- Supple-MEANT demo store schema. Users read/write only their own rows (RLS).

create table if not exists public.quiz_responses (
  user_id uuid primary key references auth.users (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  step int not null default 0,
  completed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.blends (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  product text not null check (product in ('creamer', 'drops')),
  flavor text not null,
  packs text[] not null,
  detail jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists blends_user_created on public.blends (user_id, created_at desc);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  blend_id uuid not null references public.blends (id),
  plan text not null check (plan in ('subscription', 'one-time')),
  price_cents int not null check (price_cents > 0),
  shipping jsonb not null,
  billing jsonb not null,
  status text not null default 'placed' check (status in ('placed', 'mixed')),
  email_sent boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists orders_user_created on public.orders (user_id, created_at desc);

alter table public.quiz_responses enable row level security;
alter table public.blends enable row level security;
alter table public.orders enable row level security;

drop policy if exists "own quiz" on public.quiz_responses;
create policy "own quiz" on public.quiz_responses
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "own blends read" on public.blends;
create policy "own blends read" on public.blends
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "own blends insert" on public.blends;
create policy "own blends insert" on public.blends
  for insert to authenticated with check (auth.uid() = user_id);

drop policy if exists "own orders read" on public.orders;
create policy "own orders read" on public.orders
  for select to authenticated using (auth.uid() = user_id);
drop policy if exists "own orders insert" on public.orders;
create policy "own orders insert" on public.orders
  for insert to authenticated with check (
    auth.uid() = user_id
    and exists (select 1 from public.blends b where b.id = blend_id and b.user_id = auth.uid())
  );

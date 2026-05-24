-- ── Roles ──────────────────────────────────────────────────────────────
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can read their own roles"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid());

create policy "Admins can read all roles"
  on public.user_roles for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage roles"
  on public.user_roles for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ── Apps ───────────────────────────────────────────────────────────────
create table public.apps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  emoji text not null default '🤖',
  offer text not null,
  value_cents integer not null default 0,
  description text not null,
  affiliate_url text not null default '',
  badges text[] not null default array['FREE TODAY']::text[],
  active_date date not null default current_date,
  featured boolean not null default false,
  our_pick boolean not null default false,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.apps enable row level security;

create index idx_apps_active_date on public.apps(active_date) where active;
create index idx_apps_featured on public.apps(featured) where active;

-- Public can only see active apps scheduled today (or earlier; server fn filters)
create policy "Public can read active apps"
  on public.apps for select
  to anon, authenticated
  using (active = true);

create policy "Admins can manage apps"
  on public.apps for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ── Subscribers ────────────────────────────────────────────────────────
create table public.subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  industry text not null default 'All',
  source text not null default 'hero',
  confirmed boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.subscribers enable row level security;

-- Anyone can insert (signup), no one can read except admins
create policy "Anyone can subscribe"
  on public.subscribers for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read subscribers"
  on public.subscribers for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can manage subscribers"
  on public.subscribers for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- ── Unlocks ────────────────────────────────────────────────────────────
create table public.unlocks (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  app_id uuid not null references public.apps(id) on delete cascade,
  affiliate_url text not null default '',
  claimed_at timestamptz not null default now(),
  unique (email, app_id)
);

alter table public.unlocks enable row level security;

create index idx_unlocks_app_id on public.unlocks(app_id);
create index idx_unlocks_claimed_at on public.unlocks(claimed_at);

create policy "Anyone can claim (insert unlocks)"
  on public.unlocks for insert
  to anon, authenticated
  with check (true);

create policy "Admins can read unlocks"
  on public.unlocks for select
  to authenticated
  using (public.has_role(auth.uid(), 'admin'));

-- ── updated_at trigger for apps ────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger apps_touch_updated_at
  before update on public.apps
  for each row execute function public.touch_updated_at();

-- ── Seed today's apps ──────────────────────────────────────────────────
insert into public.apps (name, category, emoji, offer, value_cents, description, affiliate_url, badges, featured, our_pick, sort_order) values
  ('Descript Pro',   'Video',        '🎬', '14-Day Pro Free',       2400, 'AI video editor — remove filler words, clone your voice, and publish everywhere in one click.', 'https://descript.com', array['FREE TODAY','STAFF PICK'], true,  false, 0),
  ('Real Elite',     'Real Estate',  '🏠', 'Free Trial',            9700, 'AI-powered investor CRM — auto-score leads, analyze deals, and submit bulk offers from one dashboard.', 'https://realelite.example.com', array['FREE TODAY','WHITE LABEL','RESELLABLE'], false, true,  1),
  ('REVVEN',         'Content',      '⚡', 'Free Access',            7900, 'Create content, automate your brand, and monetize — the AI business suite built for entrepreneurs.', 'https://revven.example.com', array['FREE TODAY','WHITE LABEL','RESELLABLE'], false, true,  2),
  ('Copy.ai',        'Content',      '✍️', '7-Day Pro Free',         4900, 'Generate sales copy, email sequences, and social content in seconds with 90+ templates.', 'https://copy.ai', array['FREE TODAY'], false, false, 3),
  ('Gamma.app',      'Productivity', '📊', 'Free Starter',           1500, 'AI-generated presentations and documents — build a full deck in under 60 seconds.', 'https://gamma.app', array['FREE TODAY','NEW'], false, false, 4),
  ('Perplexity Pro', 'Productivity', '🧠', '1-Month Pro Free',       2000, 'AI-powered research engine with real-time web search, citations, and deep document analysis.', 'https://perplexity.ai', array['FREE TODAY','STAFF PICK'], false, false, 5);

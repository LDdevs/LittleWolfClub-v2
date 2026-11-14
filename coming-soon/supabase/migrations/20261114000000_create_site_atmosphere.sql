-- Global seasonal atmosphere settings for the Little Wolf Club website.
-- The application accesses this table through the server-side Supabase client.

create table if not exists public.site_atmosphere (
  id boolean primary key default true check (id = true),
  enabled boolean not null default true,
  mode text not null default 'automatic'
    check (mode in ('automatic', 'manual')),
  manual_theme text not null default 'autumn'
    check (manual_theme in (
      'spring', 'summer', 'autumn', 'winter',
      'halloween', 'christmas', 'easter', 'bonfire'
    )),
  intensity integer not null default 50
    check (intensity between 0 and 100),
  updated_at timestamptz not null default now()
);

insert into public.site_atmosphere (id)
values (true)
on conflict (id) do nothing;

alter table public.site_atmosphere enable row level security;

-- No public policies are added. Reads and writes are performed by the
-- server-side service client; the public API returns only these safe settings.

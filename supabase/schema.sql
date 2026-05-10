create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'lead_status') then
    create type public.lead_status as enum ('new', 'contacted', 'follow-up', 'closed');
  end if;
end $$;

create table if not exists public.callback_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  selected_property_id text,
  selected_property_title text,
  message text,
  status public.lead_status not null default 'new',
  source_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_visit_bookings (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  selected_property_id text not null,
  selected_property_title text,
  preferred_visit_date date not null,
  preferred_visit_time text not null,
  message text,
  status public.lead_status not null default 'new',
  source_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  inquiry_type text,
  message text,
  status public.lead_status not null default 'new',
  source_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.callback_requests enable row level security;
alter table public.site_visit_bookings enable row level security;
alter table public.contact_inquiries enable row level security;

alter table public.contact_inquiries
  alter column message drop not null;

revoke all on public.callback_requests from anon, authenticated;
revoke all on public.site_visit_bookings from anon, authenticated;
revoke all on public.contact_inquiries from anon, authenticated;

create index if not exists callback_requests_status_created_at_idx
  on public.callback_requests (status, created_at desc);

create index if not exists site_visit_bookings_status_created_at_idx
  on public.site_visit_bookings (status, created_at desc);

create index if not exists contact_inquiries_status_created_at_idx
  on public.contact_inquiries (status, created_at desc);

do $$
begin
  if not exists (select 1 from pg_type where typname = 'property_purpose') then
    create type public.property_purpose as enum ('buy', 'rent');
  end if;

  if not exists (select 1 from pg_type where typname = 'property_type') then
    create type public.property_type as enum ('apartment', 'villa', 'plot', 'commercial', 'office', 'retail');
  end if;
end $$;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  location text not null,
  address text,
  price bigint not null check (price >= 0),
  purpose public.property_purpose not null default 'buy',
  type public.property_type not null default 'apartment',
  bhk integer,
  bathrooms integer,
  parking integer,
  area_sq_ft integer,
  plot_size_sq_ft integer,
  highlights text[] not null default '{}',
  amenities text[] not null default '{}',
  images text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties enable row level security;

grant usage on schema public to anon, authenticated;
grant select on public.properties to anon, authenticated;

drop policy if exists "Published properties are readable" on public.properties;
create policy "Published properties are readable"
  on public.properties
  for select
  to anon, authenticated
  using (published = true);

create index if not exists properties_published_featured_idx
  on public.properties (published, featured, created_at desc);

create index if not exists properties_slug_idx
  on public.properties (slug);

insert into public.properties (
  slug,
  title,
  location,
  address,
  price,
  purpose,
  type,
  bhk,
  bathrooms,
  parking,
  area_sq_ft,
  highlights,
  amenities,
  images,
  featured,
  published
)
values
  (
    'crest-residence-prime',
    'Crest Residence',
    'Prime City Center',
    'Golf Link Extension',
    38500000,
    'buy',
    'villa',
    4,
    4,
    2,
    3200,
    array['Private terrace', 'Double-height lounge', 'Low-density gated community'],
    array['Clubhouse', 'Garden deck', 'Security', 'Power backup'],
    array['/assets/properties/crest-residence.jpg'],
    true,
    true
  ),
  (
    'skyline-villa-west',
    'Skyline Villa West',
    'West Avenue',
    'Near International School',
    29500000,
    'buy',
    'villa',
    3,
    3,
    2,
    2650,
    array['Corner villa', 'Warm evening facade', 'Move-in ready interiors'],
    array['Modular kitchen', 'Landscaped lawn', 'CCTV', 'Visitor parking'],
    array['/assets/properties/skyline-villa.jpg'],
    true,
    true
  ),
  (
    'signature-penthouse-north',
    'Signature Penthouse',
    'North Business District',
    'Metro Corridor',
    185000,
    'rent',
    'apartment',
    4,
    4,
    3,
    4100,
    array['Sky deck', 'Concierge lobby', 'Furnished luxury suite'],
    array['Pool', 'Gym', 'Private lift', 'Smart access'],
    array['/assets/properties/signature-penthouse.jpg'],
    true,
    true
  ),
  (
    'commerce-court-retail',
    'Commerce Court',
    'Financial High Street',
    'Main Boulevard',
    76000000,
    'buy',
    'commercial',
    null,
    2,
    6,
    5200,
    array['High-street frontage', 'Premium glass facade', 'Large display width'],
    array['Service lift', 'Power backup', 'Fire safety', 'Dedicated parking'],
    array['/assets/properties/commerce-court.jpg'],
    true,
    true
  )
on conflict (slug) do nothing;

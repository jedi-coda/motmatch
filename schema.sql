-- MOTmatch Garage Schema
-- Run this in Supabase SQL editor

create table if not exists garages (
  id              uuid primary key default gen_random_uuid(),
  site_number     text unique not null,
  slug            text unique not null,
  trading_name    text not null,
  address1        text,
  address2        text,
  address3        text,
  town            text,
  postcode        text,
  phone           text,
  class_1         int default 0,
  class_2         int default 0,
  class_3         int default 0,
  class_4         int default 0,
  class_5         int default 0,
  class_7         int default 0,
  is_independent  boolean default true,
  status          text default 'lead',       -- lead | claimed | active
  -- Claimed garage extras (filled in when they claim)
  owner_name      text,
  owner_email     text,
  owner_phone     text,
  website         text,
  description     text,
  opening_hours   jsonb,
  mot_price       numeric(6,2),
  service_price   numeric(6,2),
  claimed_at      timestamptz,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- Indexes for AI search queries
create index if not exists garages_postcode_idx on garages(postcode);
create index if not exists garages_town_idx on garages(lower(town));
create index if not exists garages_status_idx on garages(status);
create index if not exists garages_slug_idx on garages(slug);
create index if not exists garages_class4_idx on garages(class_4);

-- Full text search
alter table garages add column if not exists fts tsvector
  generated always as (
    to_tsvector('english', coalesce(trading_name,'') || ' ' || coalesce(town,'') || ' ' || coalesce(postcode,''))
  ) stored;
create index if not exists garages_fts_idx on garages using gin(fts);

-- Claim leads table (captures emails before claim is verified)
create table if not exists claim_leads (
  id            uuid primary key default gen_random_uuid(),
  garage_id     uuid references garages(id),
  site_number   text,
  garage_name   text,
  name          text not null,
  email         text not null,
  phone         text,
  message       text,
  created_at    timestamptz default now()
);

create index if not exists claim_leads_garage_idx on claim_leads(garage_id);
create index if not exists claim_leads_email_idx on claim_leads(email);

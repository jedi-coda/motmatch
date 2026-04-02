-- Migration: Add claimed fields to garages table
-- Run this in the Supabase SQL editor

alter table garages
  add column if not exists claimed          boolean default false,
  add column if not exists tagline          text,
  add column if not exists additional_services text[],
  add column if not exists google_rating    decimal(3,1),
  add column if not exists google_reviews_count integer;

-- Sync claimed boolean with existing status values
update garages set claimed = true where status in ('claimed', 'active');

-- Index for fast lookup of claimed garages
create index if not exists garages_claimed_idx on garages(claimed);

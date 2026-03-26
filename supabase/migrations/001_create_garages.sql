-- MOTmatch: garages table
-- Run via: supabase db push  OR  paste into Supabase SQL editor

CREATE TABLE IF NOT EXISTS garages (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name                   text        NOT NULL,
  address                text,
  town                   text,
  postcode               text        NOT NULL,
  phone                  text,
  email                  text,
  lat                    float,
  lng                    float,
  subscription_plan      text        NOT NULL DEFAULT 'none',
  ai_receptionist_enabled bool       NOT NULL DEFAULT false,
  website_enabled        bool        NOT NULL DEFAULT false,
  source                 text        NOT NULL DEFAULT 'csv_import',
  enrichment_status      text        NOT NULL DEFAULT 'pending'
                                     CHECK (enrichment_status IN ('pending', 'enriched', 'failed')),
  created_at             timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint used for upsert (skip duplicates on re-import)
CREATE UNIQUE INDEX IF NOT EXISTS idx_garages_postcode_phone
  ON garages (postcode, phone)
  WHERE phone IS NOT NULL AND phone <> '';

-- Fast postcode lookups / filtering
CREATE INDEX IF NOT EXISTS idx_garages_postcode
  ON garages (postcode);

-- Geo proximity queries
CREATE INDEX IF NOT EXISTS idx_garages_lat_lng
  ON garages (lat, lng);

-- Filter by enrichment status (used on admin page)
CREATE INDEX IF NOT EXISTS idx_garages_enrichment_status
  ON garages (enrichment_status);

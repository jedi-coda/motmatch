#!/usr/bin/env node
/**
 * scripts/import-brighton-leads.js
 * MOTmatch — Import Brighton (BN postcode) leads into Supabase
 *
 * Input:  data/brighton_leads.csv  (DVSA column names)
 * Output: Upserts into `garages` table (skips postcode+phone duplicates)
 *
 * Usage:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJ... \
 *   node scripts/import-brighton-leads.js
 *
 * Or add credentials to .env and run:
 *   node -r dotenv/config scripts/import-brighton-leads.js
 */

'use strict';

const fs               = require('fs');
const path             = require('path');
const Papa             = require('papaparse');
const { createClient } = require('@supabase/supabase-js');

try { require('dotenv').config(); } catch {}

const INPUT      = path.resolve(__dirname, '../data/brighton_leads.csv');
const BATCH_SIZE = 500;

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('ERROR: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false },
});

// Map DVSA CSV columns → garages table columns
function toRow(r) {
  const addressParts = [r.Address1, r.Address2, r.Address3].filter(Boolean);
  return {
    name:                    r.Trading_Name                  || null,
    address:                 addressParts.join(', ')         || null,
    town:                    r.Town                          || null,
    postcode:                r.Postcode                      || null,
    phone:                   r.Phone                         || null,
    email:                   null,   // not in DVSA source data
    lat:                     null,   // geocoding step not yet run
    lng:                     null,
    enrichment_status:       'pending',
    subscription_plan:       'none',
    ai_receptionist_enabled: false,
    website_enabled:         false,
    source:                  'csv_import',
  };
}

async function importBatch(rows, batchIndex) {
  const { error, count } = await supabase
    .from('garages')
    .upsert(rows, {
      onConflict:       'postcode,phone',
      ignoreDuplicates: true,
      count:            'exact',
    });

  if (error) {
    console.error(`  Batch ${batchIndex} FAILED: ${error.message}`);
    return { success: 0, failed: rows.length };
  }

  const inserted = count ?? rows.length;
  console.log(`  Batch ${batchIndex}: ${inserted} inserted / ${rows.length} sent`);
  return { success: inserted, failed: 0 };
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`ERROR: Input file not found: ${INPUT}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT, 'utf8');
  const { data: csvRows } = Papa.parse(raw, { header: true, skipEmptyLines: true });

  console.log(`Loaded ${csvRows.length} rows from ${INPUT}`);

  const dbRows = csvRows
    .map(toRow)
    .filter(r => r.name && r.postcode);

  console.log(`Importing ${dbRows.length} rows in batches of ${BATCH_SIZE}…\n`);

  let totalSuccess = 0;
  let totalFailed  = 0;
  let batchIndex   = 1;

  for (let i = 0; i < dbRows.length; i += BATCH_SIZE) {
    const batch  = dbRows.slice(i, i + BATCH_SIZE);
    const result = await importBatch(batch, batchIndex++);
    totalSuccess += result.success;
    totalFailed  += result.failed;
  }

  console.log('\n=== import complete ===');
  console.log(`  Rows inserted:    ${totalSuccess}`);
  console.log(`  Batches failed:   ${totalFailed}`);
  console.log(`  Total processed:  ${dbRows.length}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

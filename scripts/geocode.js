#!/usr/bin/env node
/**
 * scripts/geocode.js
 * MOTmatch — Step 2: Geocode garages via postcodes.io (free, no API key)
 *
 * Input:  /data/garages-clean.csv
 * Output: /data/garages-enriched.csv  (adds lat, lng, updates enrichment_status)
 *
 * Install deps: npm install papaparse node-fetch
 * (Node 18+ has native fetch — remove node-fetch import if so)
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const Papa = require('papaparse');

// Use native fetch (Node 18+) or node-fetch fallback
const fetchFn = globalThis.fetch ?? require('node-fetch');

const INPUT  = path.resolve(__dirname, '../data/garages-clean.csv');
const OUTPUT = path.resolve(__dirname, '../data/garages-enriched.csv');

const BATCH_SIZE  = 10;    // postcodes per request (max 100, kept low to be polite)
const BATCH_DELAY = 200;   // ms between batches
const LOG_EVERY   = 100;   // log progress every N rows

const POSTCODES_IO = 'https://api.postcodes.io/postcodes';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Bulk-lookup up to 100 postcodes in one POST.
 * Returns a Map of postcode → { lat, lng } | null
 */
async function lookupBatch(postcodes) {
  const result = new Map();

  try {
    const res = await fetchFn(POSTCODES_IO, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ postcodes }),
    });

    if (!res.ok) {
      console.warn(`  postcodes.io HTTP ${res.status} — marking batch as failed`);
      postcodes.forEach(p => result.set(p, null));
      return result;
    }

    const json = await res.json();

    for (const item of json.result ?? []) {
      const pc = item.query;
      if (item.result) {
        result.set(pc, {
          lat: item.result.latitude,
          lng: item.result.longitude,
        });
      } else {
        result.set(pc, null); // invalid / not found
      }
    }
  } catch (err) {
    console.warn(`  Network error: ${err.message} — marking batch as failed`);
    postcodes.forEach(p => result.set(p, null));
  }

  return result;
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`ERROR: Input file not found: ${INPUT}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(INPUT, 'utf8');
  const { data: rows } = Papa.parse(raw, { header: true, skipEmptyLines: true });

  console.log(`Loaded ${rows.length} rows from ${INPUT}`);

  const enriched = [...rows]; // copy — we'll mutate enrichment_status, lat, lng

  // Skip rows already marked 'failed' (e.g. no Trading_Name) — no point geocoding
  const toGeocode = enriched.filter(r => r.enrichment_status !== 'failed');
  const skipped   = enriched.length - toGeocode.length;

  console.log(`Geocoding ${toGeocode.length} rows (${skipped} pre-failed, skipping)`);

  let enrichedCount = 0;
  let failedCount   = skipped;

  // Process in batches
  for (let i = 0; i < toGeocode.length; i += BATCH_SIZE) {
    const batch     = toGeocode.slice(i, i + BATCH_SIZE);
    const postcodes = batch.map(r => r.postcode);

    const lookups = await lookupBatch(postcodes);

    for (const row of batch) {
      const geo = lookups.get(row.postcode);
      if (geo) {
        row.lat                = geo.lat;
        row.lng                = geo.lng;
        row.enrichment_status  = 'enriched';
        enrichedCount++;
      } else {
        row.lat                = '';
        row.lng                = '';
        row.enrichment_status  = 'failed';
        failedCount++;
      }
    }

    // Progress log every LOG_EVERY rows
    const processed = Math.min(i + BATCH_SIZE, toGeocode.length);
    if (processed % LOG_EVERY === 0 || processed === toGeocode.length) {
      console.log(`  Progress: ${processed}/${toGeocode.length} geocoded`);
    }

    // Rate-limit — pause between batches
    if (i + BATCH_SIZE < toGeocode.length) {
      await sleep(BATCH_DELAY);
    }
  }

  // Write output
  const csv = Papa.unparse(enriched, { header: true });
  fs.writeFileSync(OUTPUT, csv, 'utf8');

  console.log('\n=== geocode complete ===');
  console.log(`  Enriched (lat/lng found): ${enrichedCount}`);
  console.log(`  Failed (not found):       ${failedCount}`);
  console.log(`  Total rows out:           ${enriched.length}`);
  console.log(`  Output: ${OUTPUT}`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

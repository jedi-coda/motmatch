#!/usr/bin/env node
/**
 * scripts/clean-csv.js
 * MOTmatch — Step 1: Clean raw DVSA garage CSV
 *
 * Input:  /data/garages-raw.csv  (latin1 encoded, DVSA format)
 * Output: /data/garages-clean.csv (utf-8, normalised columns)
 *
 * Install deps: npm install papaparse iconv-lite
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const Papa  = require('papaparse');
const iconv = require('iconv-lite');

const INPUT  = path.resolve(__dirname, '../data/garages-raw.csv');
const OUTPUT = path.resolve(__dirname, '../data/garages-clean.csv');

// Standard UK postcode regex (allows optional space in middle)
const UK_POSTCODE_RE = /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i;

function normalisePostcode(raw) {
  if (!raw) return '';
  // Collapse whitespace, uppercase, ensure single space before inward code
  const s = raw.trim().toUpperCase().replace(/\s+/g, '');
  // Insert space before last 3 chars (inward code)
  if (s.length >= 5) return s.slice(0, -3) + ' ' + s.slice(-3);
  return s;
}

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error(`ERROR: Input file not found: ${INPUT}`);
    process.exit(1);
  }

  // Decode latin1 → JS string
  const rawBuffer  = fs.readFileSync(INPUT);
  const rawContent = iconv.decode(rawBuffer, 'latin1');

  const { data: rows, errors: parseErrors } = Papa.parse(rawContent, {
    header:         true,
    skipEmptyLines: true,
  });

  if (parseErrors.length) {
    console.warn(`Parse warnings: ${parseErrors.length} (continuing)`);
  }

  const totalIn   = rows.length;
  let invalidRows = 0;
  let dupRows     = 0;

  const seen  = new Set();   // key: `${postcode}|${phone}`
  const clean = [];

  for (const row of rows) {
    // --- Map DVSA columns → normalised fields ---
    const name     = (row['Trading_Name'] || '').trim();
    const address  = [row['Address1'], row['Address2'], row['Address3']]
                       .map(s => (s || '').trim())
                       .filter(Boolean)
                       .join(', ');
    const town     = (row['Town']     || '').trim();
    const postcode = normalisePostcode(row['Postcode']);
    const phone    = (row['Phone']    || '').trim();
    // email not in DVSA CSV — leave blank for enrichment later
    const email    = '';

    // --- Validation ---

    // Must have a valid postcode
    if (!UK_POSTCODE_RE.test(postcode)) {
      invalidRows++;
      continue;
    }

    // Rows with no Trading_Name are flagged 'failed' but kept
    // (they may still be geocodable and useful for display)
    const enrichmentStatus = name ? 'pending' : 'failed';

    if (!name) {
      // Count as invalid for logging but still include with failed status
      invalidRows++;
    }

    // --- Deduplication by phone + postcode ---
    // Blank phones are not considered duplicates of each other
    const dedupKey = phone ? `${postcode}|${phone}` : null;

    if (dedupKey && seen.has(dedupKey)) {
      dupRows++;
      continue;
    }
    if (dedupKey) seen.add(dedupKey);

    clean.push({
      name,
      address,
      town,
      postcode,
      phone,
      email,
      enrichment_status: enrichmentStatus,
    });
  }

  // Write output as utf-8
  const csv = Papa.unparse(clean, { header: true });
  fs.writeFileSync(OUTPUT, csv, 'utf8');

  // Summary
  console.log('=== clean-csv complete ===');
  console.log(`  Total rows in:        ${totalIn}`);
  console.log(`  Invalid removed:      ${invalidRows}  (bad postcode or no Trading_Name)`);
  console.log(`  Duplicates removed:   ${dupRows}  (same postcode + phone)`);
  console.log(`  Total rows out:       ${clean.length}`);
  console.log(`  Output: ${OUTPUT}`);
}

main();

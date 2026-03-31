require('dotenv').config({ path: '.env.local' })
// scripts/import-garages.js
// Run: node scripts/import-garages.js brighton   (imports brighton_leads.csv)
//      node scripts/import-garages.js all        (imports independents_clean.csv)

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const { parse } = require('csv-parse/sync')

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

function makeSlug(tradingName, town, siteNumber) {
  const combined = `${tradingName} ${town}`.toLowerCase()
  const slug = combined
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
  return `${slug}-${siteNumber.toLowerCase()}`
}

async function importCSV(filePath) {
  console.log(`\nImporting: ${filePath}`)
  const raw = fs.readFileSync(filePath, 'utf8')
  const rows = parse(raw, { columns: true, skip_empty_lines: true })
  console.log(`Rows found: ${rows.length}`)

  const garages = rows.map(r => ({
    site_number:    r.Site_Number?.trim(),
    slug:           makeSlug(r.Trading_Name, r.Town, r.Site_Number?.trim()),
    trading_name:   r.Trading_Name?.trim(),
    address1:       r.Address1?.trim() || null,
    address2:       r.Address2?.trim() || null,
    address3:       r.Address3?.trim() || null,
    town:           r.Town?.trim() || null,
    postcode:       r.Postcode?.trim() || null,
    phone:          r.Phone?.trim() || null,
    class_1:        parseInt(r.Class_1) || 0,
    class_2:        parseInt(r.Class_2) || 0,
    class_3:        parseInt(r.Class_3) || 0,
    class_4:        parseInt(r.Class_4) || 0,
    class_5:        parseInt(r.Class_5) || 0,
    class_7:        parseInt(r.Class_7) || 0,
    is_independent: r.is_independent === 'True',
    status:         r.status?.trim() || 'lead',
  }))

  // Batch upsert in chunks of 500
  const CHUNK = 500
  let imported = 0
  for (let i = 0; i < garages.length; i += CHUNK) {
    const chunk = garages.slice(i, i + CHUNK)
    const { error } = await supabase
      .from('garages')
      .upsert(chunk, { onConflict: 'site_number' })
    if (error) {
      console.error(`Error at chunk ${i}:`, error.message)
    } else {
      imported += chunk.length
      process.stdout.write(`\r  Imported: ${imported}/${garages.length}`)
    }
  }
  console.log(`\nDone! ${imported} garages imported.`)
}

const mode = process.argv[2]
if (mode === 'brighton') {
  importCSV(path.join(__dirname,'/data/brighton_leads.csv'))
} else if (mode === 'all') {
  importCSV(path.join(__dirname,'/data/independents_clean.csv'))
} else {
  console.log('Usage: node scripts/import-garages.js brighton|all')
}

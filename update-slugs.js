require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

async function updateSlugs() {
  console.log('Fetching all garages...')
  
  let updated = 0
  let from = 0
  const BATCH = 1000

  while (true) {
    const { data, error } = await supabase
      .from('garages')
      .select('id, site_number')
      .range(from, from + BATCH - 1)

    if (error) { console.error(error); break }
    if (!data.length) break

    // Update each row's slug to lowercase site_number
    const updates = data.map(row => ({
      id: row.id,
      slug: row.site_number.toLowerCase()
    }))

    for (const u of updates) {
      const { error: err } = await supabase
        .from('garages')
        .update({ slug: u.slug })
        .eq('id', u.id)
      if (err) console.error(`Error updating ${u.slug}:`, err.message)
      else updated++
    }

    process.stdout.write(`\r  Updated: ${updated}`)
    from += BATCH
    if (data.length < BATCH) break
  }

  console.log(`\nDone! ${updated} slugs updated.`)
}

updateSlugs()

import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const body = await request.json()
    const { garage_id, site_number, garage_name, name, email, phone } = body

    if (!name || !email) {
      return Response.json({ error: 'Name and email required' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY
    )

    // Save claim lead
    const { error: leadError } = await supabase
      .from('claim_leads')
      .insert({
        garage_id,
        site_number,
        garage_name,
        name,
        email,
        phone: phone || null,
        message: 'Free page claim',
      })

    if (leadError) throw leadError

    // Mark garage as claimed
    await supabase
      .from('garages')
      .update({
        claimed: true,
        status: 'claimed',
        owner_name: name,
        owner_email: email,
        owner_phone: phone || null,
        claimed_at: new Date().toISOString(),
      })
      .eq('id', garage_id)

    // Notify hello@motmatch.co.uk via Formspree
    try {
      await fetch('https://formspree.io/f/mzdkbpzp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _subject: `New claim: ${garage_name} (${site_number})`,
          garage: garage_name,
          site_number,
          name,
          email,
          phone: phone || '—',
        }),
      })
    } catch {
      // Non-fatal — claim is saved, notification is best-effort
    }

    return Response.json({ success: true })
  } catch (err) {
    console.error('Claim error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

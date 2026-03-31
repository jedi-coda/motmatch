import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const body = await request.json()
    const { garage_id, site_number, garage_name, name, email, phone, plan } = body

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
        message: plan === 'pro' ? 'Interested in Pro package' : 'Free listing claim',
      })

    if (leadError) throw leadError

    // Update garage status to 'claimed' if pro, 'pending' if free
    await supabase
      .from('garages')
      .update({ status: plan === 'pro' ? 'claimed' : 'pending' })
      .eq('id', garage_id)

    return Response.json({ success: true })
  } catch (err) {
    console.error('Claim error:', err)
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}

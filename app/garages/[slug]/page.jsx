import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import ClaimPageClient from './ClaimPageClient'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Supabase env vars not set')
  return createClient(url, key)
}

export async function generateMetadata({ params }) {
  const supabase = getSupabase()
  const { data: garage } = await supabase
    .from('garages')
    .select('trading_name, town, postcode')
    .eq('slug', params.slug)
    .single()

  if (!garage) return { title: 'Garage Not Found' }

  return {
    title: `${garage.trading_name} — Claim Your Free Listing | MOTmatch`,
    description: `${garage.trading_name} in ${garage.town}. Claim your free MOTmatch listing and start getting more bookings today.`,
  }
}

export default async function GarageClaimPage({ params }) {
  const supabase = getSupabase()
  const { data: garage, error } = await supabase
    .from('garages')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!garage || error) notFound()

  return <ClaimPageClient garage={garage} />
}

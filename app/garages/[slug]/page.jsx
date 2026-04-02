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
    .select('trading_name, town, postcode, status, claimed, tagline')
    .eq('slug', params.slug)
    .single()

  if (!garage) return { title: 'Garage Not Found' }

  const isClaimed = garage.claimed === true || garage.status === 'claimed' || garage.status === 'active'

  if (isClaimed) {
    const tagline = garage.tagline || `MOT Testing & Vehicle Repairs in ${garage.town}`
    return {
      title: `${garage.trading_name} — ${garage.town} | MOTmatch`,
      description: `${garage.trading_name} in ${garage.town}. ${tagline}. Book your MOT today.`,
    }
  }

  return {
    title: `${garage.trading_name} — Claim Your Free Page | MOTmatch`,
    description: `${garage.trading_name} in ${garage.town}. Claim your free MOTmatch page and get an AI receptionist to answer your calls — free for 5 days.`,
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

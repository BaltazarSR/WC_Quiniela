import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const GET = withAuth(async () => {
  const { data, error } = await supabase
    .from('tournament_settings')
    .select('default_round_id')
    .eq('id', 1)
    .maybeSingle()

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch settings.' }, { status: 500 })
  }

  return NextResponse.json({ defaultRoundId: data?.default_round_id ?? 8 })
})

import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const GET = withAuth(async () => {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id, kickoff_utc, home_score, away_score, is_final,
      home_team:home_team_id(id, name, img_code, comment),
      away_team:away_team_id(id, name, img_code, comment),
      round:round_id(id, name)
    `)
    .in('round_id', [8, 2, 3, 4, 5, 6])
    .order('id', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch bracket.' }, { status: 500 })
  }

  return NextResponse.json(data)
})

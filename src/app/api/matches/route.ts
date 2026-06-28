import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const GET = withAuth(async (_req, { session }) => {
  const { data: matches, error } = await supabase
    .from('matches')
    .select(`
      id, kickoff_utc, home_score, away_score, is_final, is_unlocked,
      home_team:home_team_id(id, name, img_code, comment),
      away_team:away_team_id(id, name, img_code, comment),
      round:round_id(id, name),
      stadium:stadium_id(id, name, place, gmt_offset),
      group:group_id(id, name, short_name)
    `)
    .order('kickoff_utc', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch matches.' }, { status: 500 })
  }

  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('user_id', session.userId)

  const predMap = new Map((predictions ?? []).map((p) => [p.match_id, p]))

  const result = matches.map((m) => ({
    ...m,
    prediction: predMap.get(m.id) ?? null,
  }))

  return NextResponse.json(result)
})

import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const GET = withAuth(async (_req, { session }) => {
  const [{ data: matches, error }, { data: predictions }, { data: settings }] = await Promise.all([
    supabase
      .from('matches')
      .select(`
        id, kickoff_utc, home_score, away_score, is_final, is_unlocked,
        home_team:home_team_id(id, name, img_code, comment),
        away_team:away_team_id(id, name, img_code, comment),
        round:round_id(id, name),
        stadium:stadium_id(id, name, place, gmt_offset),
        group:group_id(id, name, short_name)
      `)
      .order('kickoff_utc', { ascending: true }),
    supabase.from('predictions').select('*').eq('user_id', session.userId),
    supabase.from('tournament_settings').select('default_round_id').eq('id', 1).maybeSingle(),
  ])

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch matches.' }, { status: 500 })
  }

  const predMap = new Map((predictions ?? []).map((p) => [p.match_id, p]))

  const result = matches.map((m) => ({
    ...m,
    prediction: predMap.get(m.id) ?? null,
  }))

  return NextResponse.json({ matches: result, defaultRoundId: settings?.default_round_id ?? 8 })
})

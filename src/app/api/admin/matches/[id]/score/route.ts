import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'
import { calculatePoints } from '@/lib/scoring'

export const POST = withAdmin(async (req: NextRequest, { params }) => {
  const id = params?.id ? parseInt(params.id, 10) : null
  if (!id || isNaN(id)) return NextResponse.json({ error: 'Missing match id.' }, { status: 400 })

  const { homeScore, awayScore, isFinal, homeTeamId, awayTeamId } = await req.json()

  if (homeScore == null || awayScore == null) {
    return NextResponse.json({ error: 'Scores are required.' }, { status: 400 })
  }

  const updatePayload: Record<string, unknown> = {
    home_score: homeScore,
    away_score: awayScore,
    is_final: isFinal ?? false,
  }

  if (homeTeamId != null) updatePayload.home_team_id = homeTeamId
  if (awayTeamId != null) updatePayload.away_team_id = awayTeamId

  const { error: updateError } = await supabase
    .from('matches')
    .update(updatePayload)
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update match.' }, { status: 500 })
  }

  if (isFinal) {
    const { data: predictions } = await supabase
      .from('predictions')
      .select('id, home_goals, away_goals')
      .eq('match_id', id)

    if (predictions?.length) {
      for (const p of predictions) {
        await supabase
          .from('predictions')
          .update({ points_earned: calculatePoints(p.home_goals, p.away_goals, homeScore, awayScore) })
          .eq('id', p.id)
      }
    }
  }

  return NextResponse.json({ ok: true })
})

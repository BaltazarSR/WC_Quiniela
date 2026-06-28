import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'
import { calculatePoints } from '@/lib/scoring'

export const POST = withAdmin(async (req: NextRequest, { params }) => {
  const id = params?.id ? parseInt(params.id, 10) : null
  if (!id || isNaN(id)) return NextResponse.json({ error: 'Missing match id.' }, { status: 400 })

  const { homeScore, awayScore, isFinal, homeTeamId, awayTeamId, advancingTeamId } = await req.json()

  if (homeScore == null || awayScore == null) {
    return NextResponse.json({ error: 'Scores are required.' }, { status: 400 })
  }

  const updatePayload: Record<string, unknown> = {
    home_score: homeScore,
    away_score: awayScore,
    is_final: isFinal ?? false,
    advancing_team_id: homeScore === awayScore ? (advancingTeamId ?? null) : null,
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
    const actualAdvancingTeamId = homeScore === awayScore ? (advancingTeamId ?? null) : null

    const { data: predictions } = await supabase
      .from('predictions')
      .select('id, home_goals, away_goals, advancing_team_id')
      .eq('match_id', id)

    if (predictions?.length) {
      await Promise.all(
        predictions.map((p) =>
          supabase
            .from('predictions')
            .update({
              points_earned: calculatePoints(
                p.home_goals,
                p.away_goals,
                homeScore,
                awayScore,
                p.advancing_team_id,
                actualAdvancingTeamId
              ),
            })
            .eq('id', p.id)
        )
      )
    }
  }

  return NextResponse.json({ ok: true })
})

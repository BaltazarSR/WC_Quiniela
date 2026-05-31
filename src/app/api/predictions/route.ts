import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'
import { isPredictionLocked } from '@/lib/scoring'

export const POST = withAuth(async (req: NextRequest, { session }) => {
  const { matchId, homeGoals, awayGoals } = await req.json()

  if (!matchId || homeGoals == null || awayGoals == null) {
    return NextResponse.json({ error: 'Missing fields.' }, { status: 400 })
  }

  if (!Number.isInteger(homeGoals) || !Number.isInteger(awayGoals) || homeGoals < 0 || awayGoals < 0) {
    return NextResponse.json({ error: 'Goals must be non-negative integers.' }, { status: 400 })
  }

  const { data: match } = await supabase
    .from('matches')
    .select('kickoff_utc, is_final, is_unlocked')
    .eq('id', matchId)
    .single()

  if (!match) {
    return NextResponse.json({ error: 'Match not found.' }, { status: 404 })
  }

  if (match.is_final || !match.is_unlocked || isPredictionLocked(match.kickoff_utc)) {
    return NextResponse.json({ error: 'Predictions are closed for this match.' }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('predictions')
    .upsert(
      {
        user_id: session.userId,
        match_id: matchId,
        home_goals: homeGoals,
        away_goals: awayGoals,
        submitted_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,match_id' }
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to save prediction.' }, { status: 500 })
  }

  return NextResponse.json(data)
})

import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const POST = withAdmin(async (req: NextRequest, { params }) => {
  const id = params?.id ? parseInt(params.id, 10) : null
  if (!id || isNaN(id)) return NextResponse.json({ error: 'Missing match id.' }, { status: 400 })

  const { homeTeamId, awayTeamId } = await req.json()

  if (homeTeamId == null && awayTeamId == null) {
    return NextResponse.json({ error: 'No team IDs provided.' }, { status: 400 })
  }

  if (homeTeamId != null && awayTeamId != null && homeTeamId === awayTeamId) {
    return NextResponse.json({ error: 'Home and away teams must be different.' }, { status: 400 })
  }

  const payload: Record<string, unknown> = {}
  if (homeTeamId != null) payload.home_team_id = homeTeamId
  if (awayTeamId != null) payload.away_team_id = awayTeamId

  const { error } = await supabase.from('matches').update(payload).eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Failed to update teams.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
})

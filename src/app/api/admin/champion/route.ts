import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const POST = withAdmin(async (req: NextRequest) => {
  const { teamId } = await req.json()

  if (teamId !== null && (!Number.isInteger(teamId) || teamId <= 0)) {
    return NextResponse.json({ error: 'teamId must be a positive integer or null.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('tournament_settings')
    .upsert({ id: 1, champion_team_id: teamId ?? null })

  if (error) {
    return NextResponse.json({ error: 'Failed to update champion.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
})

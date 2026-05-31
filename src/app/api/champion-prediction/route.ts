import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const GET = withAuth(async (_req, { session }) => {
  const [{ data: pred }, { data: firstMatch }, { data: settings }] = await Promise.all([
    supabase
      .from('champion_predictions')
      .select('team_id, team:team_id(name, img_code)')
      .eq('user_id', session.userId)
      .maybeSingle(),
    supabase
      .from('matches')
      .select('kickoff_utc')
      .order('kickoff_utc', { ascending: true })
      .limit(1)
      .single(),
    supabase
      .from('tournament_settings')
      .select('champion_team_id, champion_team:champion_team_id(name, img_code)')
      .eq('id', 1)
      .maybeSingle(),
  ])

  const isLocked = firstMatch ? new Date(firstMatch.kickoff_utc) <= new Date() : false
  const predTeam = pred?.team as unknown as { name: string; img_code: string | null } | null
  const champTeam = settings?.champion_team as unknown as { name: string; img_code: string | null } | null

  return NextResponse.json(
    {
      prediction: pred
        ? { team_id: pred.team_id, team_name: predTeam?.name ?? '', team_img_code: predTeam?.img_code ?? null }
        : null,
      is_locked: isLocked,
      champion_team_id: settings?.champion_team_id ?? null,
      champion_team_name: champTeam?.name ?? null,
      champion_team_img_code: champTeam?.img_code ?? null,
    },
    { headers: { 'Cache-Control': 'private, max-age=30, stale-while-revalidate=60' } }
  )
})

export const POST = withAuth(async (req: NextRequest, { session }) => {
  const { teamId } = await req.json()
  if (!teamId || typeof teamId !== 'number' || !Number.isInteger(teamId)) {
    return NextResponse.json({ error: 'teamId must be an integer.' }, { status: 400 })
  }

  const { data: firstMatch } = await supabase
    .from('matches')
    .select('kickoff_utc')
    .order('kickoff_utc', { ascending: true })
    .limit(1)
    .single()

  if (firstMatch && new Date(firstMatch.kickoff_utc) <= new Date()) {
    return NextResponse.json({ error: 'Champion predictions are closed.' }, { status: 409 })
  }

  const { error } = await supabase
    .from('champion_predictions')
    .upsert(
      { user_id: session.userId, team_id: teamId, submitted_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )

  if (error) {
    return NextResponse.json({ error: 'Failed to save prediction.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
})

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function checkToken(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.replace('Bearer ', '')
  return !!process.env.VILLAIN_TOKEN && token === process.env.VILLAIN_TOKEN
}

export async function GET(req: NextRequest) {
  if (!checkToken(req)) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 401 })
  }

  const [{ data: predictions }, { data: champPreds }, { data: settings }] = await Promise.all([
    supabase.from('predictions').select('user_id, points_earned'),
    supabase.from('champion_predictions').select('user_id, team_id'),
    supabase.from('tournament_settings').select('champion_team_id').eq('id', 1).maybeSingle(),
  ])

  const champTeamId = settings?.champion_team_id ?? null

  // Sum points per user
  const pointsMap = new Map<string, number>()
  for (const p of predictions ?? []) {
    pointsMap.set(p.user_id, (pointsMap.get(p.user_id) ?? 0) + (p.points_earned ?? 0))
  }
  // Add champion bonus
  for (const cp of champPreds ?? []) {
    if (champTeamId != null && cp.team_id === champTeamId) {
      pointsMap.set(cp.user_id, (pointsMap.get(cp.user_id) ?? 0) + 15)
    }
  }

  const activeIds = [...new Set([
    ...(predictions ?? []).map((p) => p.user_id),
    ...(champPreds ?? []).map((c) => c.user_id),
  ])]

  if (activeIds.length === 0) {
    return NextResponse.json([])
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('id, username, is_nuked')
    .in('id', activeIds)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch players.' }, { status: 500 })
  }

  const result = (users ?? [])
    .map((u) => ({ ...u, total_points: pointsMap.get(u.id) ?? 0 }))
    .sort((a, b) => b.total_points - a.total_points)

  return NextResponse.json(result)
}

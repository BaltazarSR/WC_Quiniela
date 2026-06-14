import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const GET = withAuth(async (_req, { session }) => {
  const { data: allMatches, error: matchError } = await supabase
    .from('matches')
    .select(`
      id, kickoff_utc, home_score, away_score, is_final, is_unlocked,
      home_team:home_team_id(id, name, img_code, comment),
      away_team:away_team_id(id, name, img_code, comment),
      round:round_id(id, name),
      group:group_id(id, name, short_name)
    `)
    .order('kickoff_utc', { ascending: true })

  if (matchError) {
    return NextResponse.json({ error: 'Failed to fetch matches.' }, { status: 500 })
  }

  const matches = allMatches ?? []
  if (matches.length === 0) return NextResponse.json([])

  const lockCutoff = Date.now() - 5 * 60 * 1000
  const lockedIds = new Set(
    matches
      .filter((m) => !m.is_unlocked || new Date(m.kickoff_utc).getTime() <= lockCutoff)
      .map((m) => m.id)
  )

  const matchIds = matches.map((m) => m.id)

  // Fetch all picks for locked matches + only the current user's picks for open matches
  const [{ data: allPicks }, { data: myPicks }] = await Promise.all([
    supabase
      .from('predictions')
      .select('match_id, user_id, home_goals, away_goals, points_earned, users(username)')
      .in('match_id', [...lockedIds]),
    supabase
      .from('predictions')
      .select('match_id, user_id, home_goals, away_goals, points_earned, users(username)')
      .eq('user_id', session.userId)
      .in('match_id', matchIds),
  ])

  const picksMap = new Map<
    number,
    Array<{
      username: string
      home_goals: number
      away_goals: number
      points_earned: number | null
      is_me: boolean
    }>
  >()

  for (const m of matches) picksMap.set(m.id, [])

  // For locked matches: add all picks
  for (const p of allPicks ?? []) {
    const usersField = p.users as unknown as { username: string } | null
    picksMap.get(p.match_id)!.push({
      username: usersField?.username ?? 'Unknown',
      home_goals: p.home_goals,
      away_goals: p.away_goals,
      points_earned: p.points_earned,
      is_me: p.user_id === session.userId,
    })
  }

  // For open matches: add only the current user's pick (avoid duplicating locked ones)
  for (const p of myPicks ?? []) {
    if (lockedIds.has(p.match_id)) continue
    const usersField = p.users as unknown as { username: string } | null
    picksMap.get(p.match_id)!.push({
      username: usersField?.username ?? 'Unknown',
      home_goals: p.home_goals,
      away_goals: p.away_goals,
      points_earned: p.points_earned,
      is_me: true,
    })
  }

  for (const picks of picksMap.values()) {
    picks.sort((a, b) => {
      if (a.is_me && !b.is_me) return -1
      if (!a.is_me && b.is_me) return 1
      return a.username.localeCompare(b.username)
    })
  }

  const result = matches.map((m) => ({
    ...m,
    is_locked: lockedIds.has(m.id),
    picks: picksMap.get(m.id) ?? [],
  }))

  return NextResponse.json(result)
})

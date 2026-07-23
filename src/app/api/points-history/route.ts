import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'
import { ROUND_ORDER, MatchSlot, UserMeta, PointsHistoryResponse } from '@/lib/types'

export const GET = withAuth(async () => {
  const [
    { data: matches },
    { data: predictions },
    { data: champPreds },
    { data: settings },
  ] = await Promise.all([
    supabase
      .from('matches')
      .select(
        'id, kickoff_utc, round_id, home_score, away_score, home_team:teams!home_team_id(name, img_code), away_team:teams!away_team_id(name, img_code), round:rounds!round_id(name)'
      )
      .eq('is_final', true)
      .order('kickoff_utc', { ascending: true }),
    supabase
      .from('predictions')
      .select('user_id, match_id, points_earned, users(username)')
      .not('points_earned', 'is', null),
    supabase.from('champion_predictions').select('user_id, team_id'),
    supabase
      .from('tournament_settings')
      .select('champion_team_id, champion_team:teams!champion_team_id(name, img_code)')
      .eq('id', 1)
      .maybeSingle(),
  ])

  if (!matches) {
    return NextResponse.json({ matches: [], users: [] } satisfies PointsHistoryResponse)
  }

  // Sort matches by ROUND_ORDER then kickoff_utc within each round
  const sortedMatches = [...matches].sort((a, b) => {
    const ro =
      ROUND_ORDER.indexOf(a.round_id as (typeof ROUND_ORDER)[number]) -
      ROUND_ORDER.indexOf(b.round_id as (typeof ROUND_ORDER)[number])
    if (ro !== 0) return ro
    return new Date(a.kickoff_utc).getTime() - new Date(b.kickoff_utc).getTime()
  })

  // Build slots
  const slots: MatchSlot[] = []
  let lastRoundId: number | null = null
  for (const m of sortedMatches) {
    const ht = m.home_team as unknown as { name: string; img_code: string | null } | null
    const at = m.away_team as unknown as { name: string; img_code: string | null } | null
    const r = m.round as unknown as { name: string } | null
    slots.push({
      match_id: m.id,
      round_id: m.round_id,
      round_name: r?.name ?? '',
      kickoff_utc: m.kickoff_utc,
      is_round_start: m.round_id !== lastRoundId,
      home_team_name: ht?.name ?? null,
      away_team_name: at?.name ?? null,
      home_img_code: ht?.img_code ?? null,
      away_img_code: at?.img_code ?? null,
      home_score: m.home_score,
      away_score: m.away_score,
      is_champion_slot: false,
      champion_team_name: null,
      champion_img_code: null,
    })
    lastRoundId = m.round_id
  }

  // Collect all users from predictions
  const userMap = new Map<string, string>()
  for (const p of predictions ?? []) {
    const u = p.users as unknown as { username: string } | null
    if (u) userMap.set(p.user_id, u.username)
  }

  // predMap: matchId -> Map<userId, points_earned>
  const predMap = new Map<number, Map<string, number>>()
  for (const p of predictions ?? []) {
    if (!predMap.has(p.match_id)) predMap.set(p.match_id, new Map())
    predMap.get(p.match_id)!.set(p.user_id, p.points_earned ?? 0)
  }

  const champTeamId = settings?.champion_team_id ?? null
  const champTeamField = settings?.champion_team as unknown as {
    name: string
    img_code: string | null
  } | null

  // Add a synthetic champion slot once the Final (round_id = 6) is finalized
  const hasFinalFinished = sortedMatches.some((m) => m.round_id === 6)
  const hasChampion = champTeamId != null && hasFinalFinished

  if (hasChampion) {
    slots.push({
      match_id: -1,
      round_id: 6,
      round_name: 'Final',
      kickoff_utc: sortedMatches[sortedMatches.length - 1]?.kickoff_utc ?? '',
      is_round_start: false,
      home_team_name: null,
      away_team_name: null,
      home_img_code: null,
      away_img_code: null,
      home_score: null,
      away_score: null,
      is_champion_slot: true,
      champion_team_name: champTeamField?.name ?? null,
      champion_img_code: champTeamField?.img_code ?? null,
    })
  }

  // Build per-user cumulative arrays
  const users: UserMeta[] = []
  for (const [userId, username] of userMap) {
    let running = 0
    const cumulative: number[] = []
    for (const slot of slots) {
      if (slot.is_champion_slot) {
        const cp = (champPreds ?? []).find((c) => c.user_id === userId)
        if (cp && cp.team_id === champTeamId) running += 10
      } else {
        running += predMap.get(slot.match_id)?.get(userId) ?? 0
      }
      cumulative.push(running)
    }
    users.push({ user_id: userId, username, cumulative })
  }

  return NextResponse.json({ matches: slots, users } satisfies PointsHistoryResponse)
})

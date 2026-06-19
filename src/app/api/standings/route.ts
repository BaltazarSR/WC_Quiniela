import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

type TeamRow = { id: number; name: string; img_code: string | null }
type GroupRow = { id: number; name: string; short_name: string }

export interface TeamStat {
  id: number
  name: string
  img_code: string | null
  mp: number
  w: number
  d: number
  l: number
  gf: number
  ga: number
  gd: number
  pts: number
}

export interface GroupStanding {
  id: number
  name: string
  short_name: string
  teams: TeamStat[]
}

export const GET = withAuth(async () => {
  const [teamGroupsResult, matchesResult] = await Promise.all([
    supabase
      .from('team_groups')
      .select('team:team_id(id, name, img_code), group:group_id(id, name, short_name)'),
    supabase
      .from('matches')
      .select('home_team_id, away_team_id, home_score, away_score, group_id')
      .eq('round_id', 1)
      .eq('is_final', true),
  ])

  if (teamGroupsResult.error) {
    return NextResponse.json({ error: 'Failed to fetch standings.' }, { status: 500 })
  }

  const groupMap = new Map<
    number,
    { id: number; name: string; short_name: string; teams: Map<number, TeamStat> }
  >()

  for (const tg of teamGroupsResult.data ?? []) {
    const team = tg.team as unknown as TeamRow
    const group = tg.group as unknown as GroupRow

    if (!groupMap.has(group.id)) {
      groupMap.set(group.id, {
        id: group.id,
        name: group.name,
        short_name: group.short_name,
        teams: new Map(),
      })
    }

    groupMap.get(group.id)!.teams.set(team.id, {
      id: team.id,
      name: team.name,
      img_code: team.img_code,
      mp: 0,
      w: 0,
      d: 0,
      l: 0,
      gf: 0,
      ga: 0,
      gd: 0,
      pts: 0,
    })
  }

  for (const match of matchesResult.data ?? []) {
    const g = groupMap.get(match.group_id)
    if (!g) continue
    const home = g.teams.get(match.home_team_id)
    const away = g.teams.get(match.away_team_id)
    if (!home || !away || match.home_score == null || match.away_score == null) continue

    const hs = match.home_score as number
    const as_ = match.away_score as number

    home.mp++
    away.mp++
    home.gf += hs
    home.ga += as_
    away.gf += as_
    away.ga += hs

    if (hs > as_) {
      home.w++
      home.pts += 3
      away.l++
    } else if (hs < as_) {
      away.w++
      away.pts += 3
      home.l++
    } else {
      home.d++
      home.pts++
      away.d++
      away.pts++
    }

    home.gd = home.gf - home.ga
    away.gd = away.gf - away.ga
  }

  const result: GroupStanding[] = Array.from(groupMap.values())
    .sort((a, b) => a.id - b.id)
    .map((g) => ({
      id: g.id,
      name: g.name,
      short_name: g.short_name,
      teams: Array.from(g.teams.values()).sort(
        (a, b) =>
          b.pts - a.pts ||
          b.gd - a.gd ||
          b.gf - a.gf ||
          a.name.localeCompare(b.name),
      ),
    }))

  return NextResponse.json(result)
})

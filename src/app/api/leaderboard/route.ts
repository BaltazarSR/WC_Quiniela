import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const GET = withAuth(async () => {
  const [
    { data: predictions, error },
    { data: settings },
    { data: champPreds },
  ] = await Promise.all([
    supabase.from('predictions').select('user_id, points_earned, users(username, is_nuked)'),
    supabase
      .from('tournament_settings')
      .select('champion_team_id')
      .eq('id', 1)
      .maybeSingle(),
    supabase
      .from('champion_predictions')
      .select('user_id, team_id, team:team_id(name, img_code), users(username, is_nuked)'),
  ])

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch leaderboard.' }, { status: 500 })
  }

  const totals = new Map<
    string,
    {
      username: string
      total_points: number
      exact_scores: number
      correct_results: number
      predictions_count: number
      champion_team: string | null
      champion_team_img_code: string | null
      champion_correct: boolean | null
      is_nuked: boolean
    }
  >()

  for (const p of predictions ?? []) {
    const usersField = p.users as unknown as { username: string; is_nuked: boolean } | null
    const username = usersField?.username ?? 'Unknown'
    if (!totals.has(p.user_id)) {
      totals.set(p.user_id, {
        username,
        total_points: 0,
        exact_scores: 0,
        correct_results: 0,
        predictions_count: 0,
        champion_team: null,
        champion_team_img_code: null,
        champion_correct: null,
        is_nuked: usersField?.is_nuked ?? false,
      })
    }
    const entry = totals.get(p.user_id)!
    entry.predictions_count++
    if (p.points_earned != null) {
      entry.total_points += p.points_earned
      if (p.points_earned === 3) entry.exact_scores++
      if (p.points_earned === 1) entry.correct_results++
    }
  }

  // Include users who have a champion pick but no match predictions yet
  for (const cp of champPreds ?? []) {
    if (!totals.has(cp.user_id)) {
      const usersField = cp.users as unknown as { username: string; is_nuked: boolean } | null
      totals.set(cp.user_id, {
        username: usersField?.username ?? 'Unknown',
        total_points: 0,
        exact_scores: 0,
        correct_results: 0,
        predictions_count: 0,
        champion_team: null,
        champion_team_img_code: null,
        champion_correct: null,
        is_nuked: usersField?.is_nuked ?? false,
      })
    }
  }

  const champTeamId = settings?.champion_team_id ?? null

  for (const cp of champPreds ?? []) {
    const entry = totals.get(cp.user_id)
    if (!entry) continue
    const teamField = cp.team as unknown as { name: string; img_code: string | null } | null
    entry.champion_team = teamField?.name ?? null
    entry.champion_team_img_code = teamField?.img_code ?? null
    if (champTeamId != null) {
      entry.champion_correct = cp.team_id === champTeamId
      if (entry.champion_correct) entry.total_points += 10
    }
  }

  const sorted = [...totals.values()].sort((a, b) => {
    if (b.total_points !== a.total_points) return b.total_points - a.total_points
    if (b.exact_scores !== a.exact_scores) return b.exact_scores - a.exact_scores
    return b.predictions_count - a.predictions_count
  })

  return NextResponse.json(sorted)
})

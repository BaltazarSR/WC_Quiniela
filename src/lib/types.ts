export interface Team {
  id: number
  name: string
  img_code: string | null
  comment: string | null
}

export interface Group {
  id: number
  name: string
  short_name: string
}

export interface Round {
  id: number
  name: string
}

export interface Stadium {
  id: number
  name: string
  place: string
  gmt_offset: number
}

export interface Match {
  id: number
  kickoff_utc: string
  home_team: Team
  away_team: Team
  round: Round
  stadium: Stadium
  group: Group | null
  home_score: number | null
  away_score: number | null
  advancing_team_id: number | null
  is_final: boolean
  is_unlocked: boolean
}

export interface Prediction {
  id: string
  user_id: string
  match_id: number
  home_goals: number
  away_goals: number
  advancing_team_id: number | null
  points_earned: number | null
  submitted_at: string
}

export interface MatchWithPrediction extends Match {
  prediction: Prediction | null
}

export interface LeaderboardEntry {
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

export interface ChampionData {
  prediction: {
    team_id: number
    team_name: string
    team_img_code: string | null
  } | null
  is_locked: boolean
  champion_team_id: number | null
  champion_team_name: string | null
  champion_team_img_code: string | null
}

export interface MatchPick {
  username: string
  home_goals: number
  away_goals: number
  advancing_team_id: number | null
  points_earned: number | null
  is_me: boolean
}

export interface MatchWithPicks extends Match {
  picks: MatchPick[]
  is_locked: boolean
}

// Round IDs in display order
export const ROUND_ORDER = [1, 8, 2, 3, 4, 5, 6] as const

export const ELIMINATION_ROUND_IDS = [8, 2, 3, 4, 5, 6] as const

export const ROUND_LABELS: Record<number, string> = {
  1: 'Group Stage',
  8: 'Round of 32',
  2: 'Round of 16',
  3: 'Quarter-Finals',
  4: 'Semi-Finals',
  5: 'Third Place',
  6: 'Final',
}

export interface MatchSlot {
  match_id: number
  round_id: number
  round_name: string
  kickoff_utc: string
  is_round_start: boolean
  home_team_name: string | null
  away_team_name: string | null
  home_img_code: string | null
  away_img_code: string | null
  home_score: number | null
  away_score: number | null
  is_champion_slot: boolean
  champion_team_name: string | null
  champion_img_code: string | null
}

export interface UserMeta {
  user_id: string
  username: string
  cumulative: number[]
}

export interface PointsHistoryResponse {
  matches: MatchSlot[]
  users: UserMeta[]
}

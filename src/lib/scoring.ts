export function calculatePoints(
  predHome: number,
  predAway: number,
  actualHome: number,
  actualAway: number,
  predAdvancingTeamId?: number | null,
  actualAdvancingTeamId?: number | null
): number {
  if (actualAdvancingTeamId != null) {
    // Elimination round that ended in a draw — advancing team determines winner
    if (predHome !== predAway) return 0
    const exactScore = predHome === actualHome
    const correctTeam = predAdvancingTeamId === actualAdvancingTeamId
    if (exactScore && correctTeam) return 3
    if (exactScore || correctTeam) return 1
    return 0
  }
  if (predHome === actualHome && predAway === actualAway) return 3
  const predResult = Math.sign(predHome - predAway)
  const actualResult = Math.sign(actualHome - actualAway)
  if (predResult === actualResult) return 1
  return 0
}

export function isPredictionLocked(kickoffUtc: string): boolean {
  return Date.now() >= new Date(kickoffUtc).getTime() - 5 * 60 * 1000
}

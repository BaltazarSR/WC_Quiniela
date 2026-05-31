export function calculatePoints(
  predHome: number,
  predAway: number,
  actualHome: number,
  actualAway: number
): number {
  if (predHome === actualHome && predAway === actualAway) return 3
  const predResult = Math.sign(predHome - predAway)
  const actualResult = Math.sign(actualHome - actualAway)
  if (predResult === actualResult) return 1
  return 0
}

export function isPredictionLocked(kickoffUtc: string): boolean {
  return Date.now() >= new Date(kickoffUtc).getTime() - 5 * 60 * 1000
}

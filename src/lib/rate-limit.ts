const store = new Map<string, { count: number; reset: number }>()

export function checkRateLimit(
  ip: string,
  limit = 5,
  windowMs = 15 * 60 * 1000
): boolean {
  const now = Date.now()
  const entry = store.get(ip)

  if (!entry || now > entry.reset) {
    store.set(ip, { count: 1, reset: now + windowMs })
    return true
  }

  if (entry.count >= limit) return false
  entry.count++
  return true
}

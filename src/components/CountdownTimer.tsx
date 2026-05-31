'use client'

import { useEffect, useState } from 'react'

function formatCountdown(ms: number): string {
  if (ms <= 0) return 'Locked'
  const totalSeconds = Math.floor(ms / 1000)
  const days = Math.floor(totalSeconds / 86400)
  const hours = Math.floor((totalSeconds % 86400) / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m ${seconds}s`
}

export function CountdownTimer({ kickoffUtc }: { kickoffUtc: string }) {
  const lockTime = new Date(kickoffUtc).getTime() - 5 * 60 * 1000
  const [msLeft, setMsLeft] = useState(lockTime - Date.now())

  useEffect(() => {
    const id = setInterval(() => setMsLeft(lockTime - Date.now()), 1000)
    return () => clearInterval(id)
  }, [lockTime])

  if (msLeft <= 0) return null

  const urgent = msLeft < 30 * 60 * 1000

  return (
    <span
      style={{
        fontSize: '11px',
        fontWeight: 500,
        color: urgent ? '#fbbf24' : 'rgba(255,255,255,0.40)',
        fontFamily: 'ui-monospace, monospace',
      }}
    >
      Closes in {formatCountdown(msLeft)}
    </span>
  )
}

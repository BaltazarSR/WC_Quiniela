'use client'

import { useEffect, useState } from 'react'

export function NukeBanner() {
  const [isNuked, setIsNuked] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setIsNuked(data.isNuked ?? false))
  }, [])

  useEffect(() => {
    function onResist() { setIsNuked(false) }
    window.addEventListener('nuke-resist', onResist)
    return () => window.removeEventListener('nuke-resist', onResist)
  }, [])

  if (!isNuked) return null

  return (
    <>
      <style>{`
        @keyframes vignette-pulse {
          0%, 100% { box-shadow: inset 0 0 120px rgba(239,68,68,0.22); }
          50%       { box-shadow: inset 0 0 180px rgba(239,68,68,0.38); }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 60,
          animation: 'vignette-pulse 3s ease-in-out infinite',
        }}
      />
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'

export function NukeBanner() {
  const [isNuked, setIsNuked] = useState(false)
  const [resisting, setResisting] = useState(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => setIsNuked(data.isNuked ?? false))
  }, [])

  async function handleResist() {
    setResisting(true)
    await fetch('/api/nuke/resist', { method: 'POST' })
    setIsNuked(false)
    setResisting(false)
  }

  if (!isNuked) return null

  return (
    <>
      <style>{`
        @keyframes banner-scanline {
          0%   { background-position: 0 0; }
          100% { background-position: 0 4px; }
        }
        @keyframes banner-flicker {
          0%, 95%, 100% { opacity: 1; }
          96%            { opacity: 0.85; }
          97%            { opacity: 1; }
          98%            { opacity: 0.9; }
        }
        @keyframes resist-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.20); }
          50%       { box-shadow: 0 0 0 4px rgba(255,255,255,0.00); }
        }
      `}</style>
      <div
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.12) 0px, rgba(0,0,0,0.12) 1px, transparent 1px, transparent 4px), #1a0000',
          borderBottom: '1px solid rgba(239,68,68,0.40)',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          animation: 'banner-flicker 8s ease-in-out infinite',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <img src="/radiation.svg" alt="" style={{ width: '16px', height: '16px', flexShrink: 0, opacity: 0.9 }} />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: 'rgba(239,68,68,0.90)',
              letterSpacing: '0.04em',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            Glass the chingó, ni pedo.
          </span>
        </div>

        <button
          onClick={handleResist}
          disabled={resisting}
          style={{
            flexShrink: 0,
            padding: '5px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.06)',
            color: 'rgba(255,255,255,0.80)',
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '0.12em',
            cursor: resisting ? 'default' : 'pointer',
            textTransform: 'uppercase',
            opacity: resisting ? 0.5 : 1,
            animation: 'resist-pulse 2s ease-in-out infinite',
            transition: 'background 150ms',
          }}
        >
          {resisting ? '…' : 'Para Argentina mejor'}
        </button>
      </div>
    </>
  )
}

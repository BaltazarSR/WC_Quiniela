'use client'

import { useEffect, useState } from 'react'

interface VillainPlayer {
  id: string
  username: string
  is_nuked: boolean
  total_points: number
}

const AVATARS: Record<string, string> = {
  'c5056f46-06e1-44b9-9dd4-05aba2c66fc4': '/balta.png',
  '97718112-fdca-4bc9-9c05-6d3e0d819cdc': '/pelon.png',
  '6e6d0a29-d2c1-48c3-8661-27375fbe95b8': '/temo.png',
  '1aa44a7e-544d-4e9f-b8c7-50a1fdfe5322': '/julio.png',
  '9ee8b864-578f-4ea1-b3e7-88c2769bab7c': '/mickey.png',
}

const LAST_SEEN: Record<string, string> = {
  'c5056f46-06e1-44b9-9dd4-05aba2c66fc4': 'Pls no',
  '97718112-fdca-4bc9-9c05-6d3e0d819cdc': 'Ni se va a dar cuenta por estar en guardia',
  '6e6d0a29-d2c1-48c3-8661-27375fbe95b8': 'Súper se arma',
  '1aa44a7e-544d-4e9f-b8c7-50a1fdfe5322': 'Estaría cagado',
  '9ee8b864-578f-4ea1-b3e7-88c2769bab7c': 'Solo esta jugando para divertise',
}

const THREAT_LEVELS = [
  { label: 'CRITICAL', color: '#ef4444', glow: 'rgba(239,68,68,0.22)' },
  { label: 'HIGH',     color: '#f97316', glow: 'rgba(249,115,22,0.18)' },
  { label: 'MODERATE', color: '#eab308', glow: 'rgba(234,179,8,0.18)'  },
  { label: 'LOW',      color: '#60a5fa', glow: 'rgba(96,165,250,0.15)' },
  { label: 'MINIMAL',  color: '#22c55e', glow: 'rgba(34,197,94,0.15)'  },
]

function getThreat(rank: number) {
  return THREAT_LEVELS[Math.min(rank, THREAT_LEVELS.length - 1)]
}

export default function VillainPage() {
  const [code, setCode] = useState('')
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [players, setPlayers] = useState<VillainPlayer[]>([])
  const [loading, setLoading] = useState(false)
  const [nuking, setNuking] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [hoveredNuke, setHoveredNuke] = useState<string | null>(null)
  const [glitchingId, setGlitchingId] = useState<string | null>(null)
  const [screenFlash, setScreenFlash] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [briefingOpen, setBriefingOpen] = useState(false)

  async function handleSubmitCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/villain/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    if (res.ok) {
      setToken(code)
    } else {
      setError('Wrong codes. Access denied.')
      setCode('')
    }
  }

  async function fetchPlayers(t: string) {
    const res = await fetch('/api/villain/players', {
      headers: { Authorization: `Bearer ${t}` },
    })
    setPlayers(await res.json())
  }

  useEffect(() => {
    if (!token) return
    setLoading(true)
    fetchPlayers(token).finally(() => setLoading(false))
  }, [token])

  async function handleNuke(userId: string) {
    if (!token) return

    // Fire animations immediately
    setGlitchingId(userId)
    setScreenFlash(true)
    setShaking(true)
    setTimeout(() => setGlitchingId(null), 900)
    setTimeout(() => setScreenFlash(false), 700)
    setTimeout(() => setShaking(false), 600)

    setNuking(userId)
    await fetch('/api/villain/nuke', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userId }),
    })
    await fetchPlayers(token)
    setNuking(null)
  }

  if (!token) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#080808',
          padding: '24px',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: '320px', width: '100%' }}>
          <img src="/radiation.svg" alt="" style={{ width: '52px', height: '52px', display: 'block', margin: '0 auto 12px' }} />
          <h1
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.50)',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Control Room
          </h1>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.20)', marginBottom: '32px', letterSpacing: '0.04em' }}>
            Authorized personnel only
          </p>
          <form onSubmit={handleSubmitCode} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="..."
              autoFocus
              style={{
                width: '100%',
                padding: '13px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                letterSpacing: '0.18em',
                textAlign: 'center',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {error && (
              <p style={{ color: '#ef4444', fontSize: '12px', margin: 0 }}>{error}</p>
            )}
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '13px',
                background: '#7f1d1d',
                border: '1px solid #991b1b',
                borderRadius: '8px',
                color: '#fca5a5',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.16em',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    )
  }

  const nukedPlayer = players.find((p) => p.is_nuked)

  return (
    <div style={{ position: 'relative' }}>
      <style>{`
        @keyframes threat-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.35; }
        }
        @keyframes nuke-shake {
          0%,100% { transform: translateX(0); }
          20%     { transform: translateX(-3px) rotate(-1deg); }
          40%     { transform: translateX(3px) rotate(1deg); }
          60%     { transform: translateX(-2px); }
          80%     { transform: translateX(2px); }
        }
        @keyframes card-glitch {
          0%   { transform: none; filter: none; }
          8%   { transform: skewX(-10deg) translateX(8px) scaleY(1.02); filter: hue-rotate(90deg) saturate(4) brightness(1.8); }
          16%  { transform: skewX(7deg) translateX(-10px); filter: hue-rotate(220deg) saturate(3) brightness(0.6); }
          24%  { transform: none; filter: brightness(4); }
          32%  { transform: skewX(-12deg) translateX(6px); filter: hue-rotate(310deg) saturate(5) brightness(1.5); }
          40%  { transform: skewX(5deg) translateX(-7px) scaleY(0.98); filter: brightness(0.3) saturate(0); }
          48%  { transform: none; filter: none; }
          60%  { transform: skewX(-4deg) translateX(3px); filter: hue-rotate(90deg) brightness(1.3); }
          70%  { transform: none; filter: none; }
          100% { transform: none; filter: none; }
        }
        @keyframes screen-flash {
          0%   { opacity: 0; }
          8%   { opacity: 0.55; }
          20%  { opacity: 0.05; }
          32%  { opacity: 0.40; }
          48%  { opacity: 0; }
          65%  { opacity: 0.15; }
          80%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes container-shake {
          0%,100% { transform: translate(0, 0) rotate(0deg); }
          10%     { transform: translate(-10px, -2px) rotate(-0.5deg); }
          20%     { transform: translate(10px, 2px) rotate(0.5deg); }
          30%     { transform: translate(-8px, 1px) rotate(-0.3deg); }
          40%     { transform: translate(8px, -1px) rotate(0.3deg); }
          50%     { transform: translate(-5px, 0px); }
          60%     { transform: translate(5px, 1px); }
          70%     { transform: translate(-3px, 0px); }
          80%     { transform: translate(3px, -1px); }
          90%     { transform: translate(-1px, 0px); }
        }
      `}</style>

      {/* Full-screen red flash overlay */}
      {screenFlash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(220, 30, 30, 0.55)',
            pointerEvents: 'none',
            zIndex: 9999,
            animation: 'screen-flash 700ms ease-out forwards',
          }}
        />
      )}

      <div
        style={{
          minHeight: '100vh',
          background: '#080808',
          padding: '48px 24px',
          maxWidth: '480px',
          margin: '0 auto',
          animation: shaking ? 'container-shake 600ms ease-out forwards' : 'none',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <img src="/radiation.svg" alt="" style={{ width: '40px', height: '40px', display: 'block', margin: '0 auto 10px' }} />
          <h1
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.22em',
              color: 'rgba(255,255,255,0.50)',
              textTransform: 'uppercase',
              marginBottom: '8px',
            }}
          >
            Nuclear Control Room
          </h1>
          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            {nukedPlayer ? (
              <>
                <img src="/radiation.svg" alt="" style={{ width: '11px', height: '11px' }} />
                {nukedPlayer.username} has been nuked
              </>
            ) : 'Chíngate a alguien, solo tienes una nuke.'}
          </p>
        </div>

        {/* Mission Briefing */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setBriefingOpen(o => !o)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 14px',
              borderRadius: briefingOpen ? '10px 10px 0 0' : '10px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderBottom: briefingOpen ? '1px solid rgba(255,255,255,0.04)' : '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.03)',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.40)',
              textAlign: 'left',
            }}
          >
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              ▸ Mission Briefing
            </span>
            <span style={{ fontSize: '10px', display: 'inline-block', transition: 'transform 200ms', transform: briefingOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              ▾
            </span>
          </button>

          {briefingOpen && (
            <div
              style={{
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px',
                background: 'rgba(255,255,255,0.02)',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              {[
                'El jugador elegido ve un mensaje de burla en cada página de la app.',
                'Sus predicciones quedan completamente bloqueadas hasta que resista.',
                'Su lugar en el ranking aparece marcado para que todos lo vean.',
                'Puede resistir por su cuenta y quitarse la nuke él solo.',
                'Solo una nuke a la vez. Nukear a otro libera al objetivo actual.',
              ].map((text) => (
                <div key={text} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(239,68,68,0.50)', flexShrink: 0, marginTop: '3px', letterSpacing: '0.05em' }}>—</span>
                  <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.5 }}>{text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.22)', fontSize: '12px' }}>
            Loading targets…
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {players.map((player, rank) => {
              const avatar = AVATARS[player.id]
              const lastSeen = LAST_SEEN[player.id]
              const threat = getThreat(rank)
              const isNuking = nuking === player.id
              const isHovered = hoveredId === player.id
              const isNukeHovered = hoveredNuke === player.id
              const isGlitching = glitchingId === player.id

              return (
                <div
                  key={player.id}
                  onMouseEnter={() => setHoveredId(player.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    border: player.is_nuked
                      ? '1px solid rgba(239,68,68,0.40)'
                      : isHovered
                        ? `1px solid ${threat.color}50`
                        : '1px solid rgba(255,255,255,0.07)',
                    background: player.is_nuked
                      ? 'rgba(239,68,68,0.06)'
                      : isHovered
                        ? threat.glow
                        : 'rgba(255,255,255,0.02)',
                    boxShadow: isHovered && !player.is_nuked ? `0 0 20px ${threat.glow}` : 'none',
                    transition: 'border-color 200ms, background 200ms, box-shadow 200ms',
                    animation: isGlitching ? 'card-glitch 900ms ease-out forwards' : 'none',
                  }}
                >
                  {/* Avatar */}
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={player.username}
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          display: 'block',
                          border: player.is_nuked ? '2px solid rgba(239,68,68,0.55)' : `2px solid ${threat.color}55`,
                          filter: player.is_nuked ? 'grayscale(50%) brightness(0.8)' : 'none',
                          transition: 'filter 300ms',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '50%',
                          background: 'rgba(255,255,255,0.06)',
                          border: `2px solid ${threat.color}55`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          fontWeight: 700,
                          color: 'rgba(255,255,255,0.30)',
                        }}
                      >
                        {player.username[0].toUpperCase()}
                      </div>
                    )}
                    {player.is_nuked && (
                      <img
                        src="/radiation.svg"
                        alt=""
                        style={{
                          position: 'absolute',
                          bottom: '-2px',
                          right: '-2px',
                          width: '16px',
                          height: '16px',
                          background: '#080808',
                          borderRadius: '50%',
                          padding: '2px',
                        }}
                      />
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 600,
                        color: player.is_nuked ? '#fca5a5' : '#fff',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        marginBottom: '3px',
                        transition: 'color 300ms',
                      }}
                    >
                      {player.username}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          letterSpacing: '0.12em',
                          color: player.is_nuked ? 'rgba(239,68,68,0.70)' : threat.color,
                          animation: threat.label === 'CRITICAL' && !player.is_nuked
                            ? 'threat-pulse 1.4s ease-in-out infinite'
                            : 'none',
                        }}
                      >
                        {player.is_nuked ? '☠ NUKED' : `▲ ${threat.label}`}
                      </span>
                      <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.18)', fontWeight: 500 }}>
                        {player.total_points} pts
                      </span>
                    </div>

                    {lastSeen && !player.is_nuked && (
                      <div
                        style={{
                          fontSize: '10px',
                          color: 'rgba(255,255,255,0.28)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          fontStyle: 'italic',
                        }}
                      >
                        {lastSeen}
                      </div>
                    )}
                  </div>

                  {/* Nuke button */}
                  <button
                    onClick={() => handleNuke(player.id)}
                    disabled={isNuking}
                    onMouseEnter={() => setHoveredNuke(player.id)}
                    onMouseLeave={() => setHoveredNuke(null)}
                    style={{
                      flexShrink: 0,
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: player.is_nuked
                        ? '1px solid rgba(239,68,68,0.40)'
                        : isNukeHovered
                          ? '1px solid rgba(239,68,68,0.60)'
                          : '1px solid rgba(239,68,68,0.22)',
                      background: player.is_nuked
                        ? 'rgba(239,68,68,0.12)'
                        : isNukeHovered
                          ? 'rgba(239,68,68,0.10)'
                          : 'transparent',
                      color: player.is_nuked || isNukeHovered ? '#fca5a5' : 'rgba(239,68,68,0.55)',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.10em',
                      cursor: isNuking ? 'default' : 'pointer',
                      textTransform: 'uppercase',
                      opacity: isNuking ? 0.4 : 1,
                      animation: isNukeHovered && !isNuking && !player.is_nuked
                        ? 'nuke-shake 0.4s ease-in-out'
                        : 'none',
                      transition: 'border-color 150ms, background 150ms, color 150ms',
                    }}
                  >
                    {isNuking ? '…' : player.is_nuked ? 'Deactivate' : 'Nuke'}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

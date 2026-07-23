'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SoccerIcon } from '@/components/icons'
import { getFlagUrl } from '@/lib/flags'
import { ResistSection } from '@/components/ResistSection'
import type { LeaderboardEntry } from '@/lib/types'

function ChampionCell({ entry, flagSize = 18, mexicoMode = false }: { entry: LeaderboardEntry; flagSize?: number; mexicoMode?: boolean }) {
  const valueStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '21px',
    gap: '4px',
  }
  const imgCode = mexicoMode ? 'MX' : entry.champion_team_img_code
  const teamName = mexicoMode ? 'Mexico' : entry.champion_team
  if (!mexicoMode && !entry.champion_team) {
    return <div style={{ ...valueStyle, fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.20)' }}>–</div>
  }
  return (
    <div style={valueStyle}>
      {getFlagUrl(imgCode) && (
        <img
          src={getFlagUrl(imgCode)!}
          alt={teamName ?? ''}
          style={{ width: `${flagSize}px`, height: `${Math.round(flagSize * 0.75)}px`, display: 'block', borderRadius: '2px', opacity: !mexicoMode && entry.champion_correct === false ? 0.4 : 1 }}
        />
      )}
      {!mexicoMode && entry.champion_correct === true && (
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>✓</span>
      )}
      {!mexicoMode && entry.champion_correct === false && (
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.25)' }}>✗</span>
      )}
    </div>
  )
}

const CUCARACHAS = [
  { top: '8%',  dir: 'ltr', size: 110, duration: 7,  delay: 0   },
  { top: '18%', dir: 'rtl', size: 95,  duration: 9,  delay: 1.5 },
  { top: '30%', dir: 'ltr', size: 125, duration: 6,  delay: 0.5 },
  { top: '42%', dir: 'rtl', size: 88,  duration: 11, delay: 2   },
  { top: '55%', dir: 'ltr', size: 118, duration: 8,  delay: 1   },
  { top: '65%', dir: 'rtl', size: 102, duration: 7,  delay: 3   },
  { top: '75%', dir: 'ltr', size: 95,  duration: 10, delay: 0.8 },
  { top: '85%', dir: 'rtl', size: 110, duration: 6,  delay: 2.5 },
  { top: '24%', dir: 'ltr', size: 80,  duration: 12, delay: 4   },
  { top: '48%', dir: 'rtl', size: 130, duration: 7,  delay: 1.2 },
  { top: '70%', dir: 'ltr', size: 102, duration: 9,  delay: 3.5 },
  { top: '90%', dir: 'rtl', size: 90,  duration: 8,  delay: 0.3 },
] as const

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'rgba(255,255,255,0.30)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [mexicoMode, setMexicoMode] = useState(false)
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)
  const [isNuked, setIsNuked] = useState(false)
  const [riddle, setRiddle] = useState<string | null>(null)
  const [penalty, setPenalty] = useState(0)
  const [splashed, setSplashed] = useState<Set<number>>(new Set())
  const [splats, setSplats] = useState<Array<{ id: number; x: number; y: number; size: number; dir: string }>>([])
  const splatIdRef = useRef(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (mexicoMode) {
      audio.currentTime = 0
      audio.play()
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [mexicoMode])

  useEffect(() => {
    if (!mexicoMode) {
      setSplashed(new Set())
      setSplats([])
      setPenalty(0)
    }
  }, [mexicoMode])

  function handleSquish(i: number, e: React.MouseEvent<HTMLImageElement>) {
    if (splashed.has(i)) return
    setSplashed(prev => new Set(prev).add(i))
    setPenalty(p => p + 3)
    const id = splatIdRef.current++
    const c = CUCARACHAS[i]
    setSplats(prev => [...prev, { id, x: e.clientX, y: e.clientY, size: c.size, dir: c.dir }])
    setTimeout(() => setSplats(prev => prev.filter(s => s.id !== id)), 900)
  }

  function fetchLeaderboard() {
    Promise.all([
      fetch('/api/leaderboard').then((r) => r.json()),
      fetch('/api/auth/me').then((r) => r.json()),
    ])
      .then(([leaderboardData, meData]) => {
        setEntries(leaderboardData)
        setCurrentUsername(meData.username ?? null)
        setIsNuked(meData.isNuked ?? false)
        setRiddle(meData.riddle ?? null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchLeaderboard()
    window.addEventListener('nuke-resist', fetchLeaderboard)
    return () => window.removeEventListener('nuke-resist', fetchLeaderboard)
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '80px', color: 'rgba(255,255,255,0.30)' }}>
        Loading…
      </div>
    )
  }

  const medalColors = ['#fbbf24', '#94a3b8', '#cd7c2f']

  const displayEntries = [...entries]
    .map(e => ({
      ...e,
      total_points: e.username === currentUsername ? e.total_points - penalty : e.total_points,
    }))
    .sort((a, b) => b.total_points - a.total_points)

  const ranks: number[] = []
  for (let i = 0; i < displayEntries.length; i++) {
    if (i === 0) { ranks.push(1); continue }
    const curr = displayEntries[i]
    const prev = displayEntries[i - 1]
    if (curr.total_points === prev.total_points) {
      ranks.push(ranks[i - 1])
    } else {
      ranks.push(i + 1)
    }
  }

  return (
    <div>
      <style>{`
        @keyframes nuke-glow {
          0%, 100% { box-shadow: 0 0 8px rgba(239,68,68,0.10); }
          50%       { box-shadow: 0 0 20px rgba(239,68,68,0.28); }
        }
        @keyframes nuke-badge-pulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.5; }
        }
      `}</style>
      <audio ref={audioRef} src="/cucaracha_song.mp3" loop />

      {mexicoMode && (
        <>
          <style>{`
            @keyframes cucaracha-ltr {
              from { transform: translateX(-120px); }
              to   { transform: translateX(calc(100vw + 120px)); }
            }
            @keyframes cucaracha-rtl {
              from { transform: translateX(calc(100vw + 120px)) scaleX(-1); }
              to   { transform: translateX(-120px) scaleX(-1); }
            }
            @keyframes cucaracha-splat-ltr {
              0%   { transform: scaleX(1)    scaleY(1);    opacity: 1; }
              15%  { transform: scaleX(1.3)  scaleY(1.2);  opacity: 1; }
              40%  { transform: scaleX(1.9)  scaleY(0.22); filter: hue-rotate(320deg) saturate(2) brightness(0.45); opacity: 1; }
              75%  { transform: scaleX(2.3)  scaleY(0.10); opacity: 0.5; }
              100% { transform: scaleX(2.6)  scaleY(0.06); opacity: 0; }
            }
            @keyframes cucaracha-splat-rtl {
              0%   { transform: scaleX(-1)   scaleY(1);    opacity: 1; }
              15%  { transform: scaleX(-1.3) scaleY(1.2);  opacity: 1; }
              40%  { transform: scaleX(-1.9) scaleY(0.22); filter: hue-rotate(320deg) saturate(2) brightness(0.45); opacity: 1; }
              75%  { transform: scaleX(-2.3) scaleY(0.10); opacity: 0.5; }
              100% { transform: scaleX(-2.6) scaleY(0.06); opacity: 0; }
            }
            @keyframes score-float {
              0%   { opacity: 1; transform: translateX(-50%) translateY(0); }
              100% { opacity: 0; transform: translateX(-50%) translateY(-64px); }
            }
          `}</style>
          <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
            {CUCARACHAS.map((c, i) => (
              <img
                key={i}
                src="/cucaracha.gif"
                alt=""
                onClick={(e) => handleSquish(i, e)}
                style={{
                  position: 'absolute',
                  top: c.top,
                  width: `${c.size}px`,
                  cursor: 'crosshair',
                  pointerEvents: splashed.has(i) ? 'none' : 'auto',
                  opacity: splashed.has(i) ? 0 : 1,
                  transition: 'opacity 0.08s',
                  animation: `cucaracha-${c.dir} ${c.duration}s ${c.delay}s linear infinite backwards`,
                }}
              />
            ))}

            {splats.map((splat) => (
              <div
                key={splat.id}
                style={{
                  position: 'fixed',
                  left: splat.x,
                  top: splat.y,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
              >
                <img
                  src="/cucaracha.gif"
                  alt=""
                  style={{
                    display: 'block',
                    width: `${splat.size}px`,
                    animation: `cucaracha-splat-${splat.dir} 0.85s ease-out forwards`,
                  }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '-36px',
                    left: 0,
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#ef4444',
                    textShadow: '0 1px 8px rgba(0,0,0,1)',
                    whiteSpace: 'nowrap',
                    animation: 'score-float 0.85s ease-out forwards',
                  }}
                >
                  -3 pts
                </span>
              </div>
            ))}
          </div>
        </>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1
          style={{
            fontSize: '10px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: 'rgba(255,255,255,0.40)',
            margin: 0,
          }}
        >
          Leaderboard
        </h1>
        <a
          href="/race"
          style={{
            fontSize: '10px',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            color: 'rgba(255,255,255,0.40)',
            textDecoration: 'none',
            padding: '5px 10px',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '6px',
          }}
        >
          Race ↗
        </a>
      </div>

      {entries.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.30)', textAlign: 'center', paddingTop: '40px' }}>
          No scores yet. Predictions will be scored when matches end.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {displayEntries.map((entry, idx) => {
          const rank = ranks[idx]
          return (
          <motion.div
            key={entry.username}
            layout
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              border: entry.is_nuked
                ? '1px solid rgba(239,68,68,0.35)'
                : '1px solid rgba(255,255,255,0.07)',
              background: entry.is_nuked
                ? 'rgba(239,68,68,0.06)'
                : rank === 1 ? 'rgba(251,191,36,0.04)' : 'rgba(255,255,255,0.02)',
              gap: '12px',
              animation: entry.is_nuked ? 'nuke-glow 2s ease-in-out infinite' : 'none',
            }}
          >
            {/* Rank + username */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
              {entry.is_nuked ? (
                <img src="/radiation.svg" alt="" style={{ width: '18px', height: '18px', flexShrink: 0, opacity: 0.8 }} />
              ) : (
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 700,
                    color: rank <= 3 ? medalColors[rank - 1] : 'rgba(255,255,255,0.30)',
                    width: '24px',
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  {rank}
                </span>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: entry.is_nuked ? 'rgba(239,68,68,0.60)' : '#fff',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    textDecoration: entry.is_nuked ? 'line-through rgba(239,68,68,0.50)' : 'none',
                  }}
                >
                  {entry.username}
                </span>
                {entry.is_nuked && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '8px',
                      fontWeight: 800,
                      letterSpacing: '0.16em',
                      color: '#ef4444',
                      textTransform: 'uppercase',
                      animation: 'nuke-badge-pulse 1.6s ease-in-out infinite',
                    }}
                  >
                    Nuked
                  </div>
                )}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0, opacity: entry.is_nuked ? 0.45 : 1, transition: 'opacity 300ms' }}>
              {/* Exact */}
              <div style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Exact</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: entry.is_nuked ? '#fca5a5' : '#4ade80' }}>{entry.exact_scores}</div>
              </div>

              {/* Correct */}
              <div style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Correct</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: entry.is_nuked ? '#fca5a5' : '#fbbf24' }}>{entry.correct_results}</div>
              </div>

              {/* Champion — mobile compact */}
              <div className="block sm:hidden" style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Champ</div>
                <ChampionCell entry={entry} flagSize={13} mexicoMode={mexicoMode} />
              </div>

              {/* Champion — desktop */}
              <div className="hidden sm:block" style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Champion</div>
                <ChampionCell entry={entry} mexicoMode={mexicoMode} />
              </div>

              {/* Picks — desktop only */}
              <div className="hidden sm:block" style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Picks</div>
                <div style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.50)' }}>
                  {entry.predictions_count}
                </div>
              </div>

              {/* Points */}
              <div style={{ minWidth: '52px', textAlign: 'right' }}>
                <div style={labelStyle}>Points</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: entry.is_nuked ? '#fca5a5' : '#fff', lineHeight: 1 }}>
                  {entry.total_points}
                </div>
              </div>
            </div>
          </motion.div>
        )})}
      </div>

      <p
        style={{
          marginTop: '24px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.20)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <SoccerIcon color="rgba(255,255,255,0.20)" size={11} />
        Exact score = 3 pts · Correct result = 1 pt · Champion = 10 pts
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
        <button
          onClick={() => setMexicoMode(m => !m)}
          style={{
            padding: '5px 10px',
            borderRadius: '6px',
            border: mexicoMode ? '1px solid #006847' : '1px solid rgba(255,255,255,0.10)',
            background: mexicoMode ? 'rgba(0,104,71,0.20)' : 'rgba(255,255,255,0.04)',
            color: mexicoMode ? '#4ade80' : 'rgba(255,255,255,0.40)',
            fontSize: '8px',
            fontWeight: 700,
            letterSpacing: '0.10em',
            cursor: 'pointer',
            transition: 'all 200ms',
            whiteSpace: 'nowrap',
          }}
        >
          {mexicoMode ? 'VIVA MÉXICO' : 'IMAGINEMOS COSAS CHINGONAS'}
        </button>
      </div>

      {isNuked && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '24px', paddingBottom: '24px' }}>
          <ResistSection riddle={riddle} />
        </div>
      )}
    </div>
  )
}

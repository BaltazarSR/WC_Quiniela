'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { getFlagUrl } from '@/lib/flags'
import { PLAYER_AVATARS, PLAYER_COLORS } from '@/lib/players'
import { ROUND_LABELS } from '@/lib/types'
import type { MatchSlot, PointsHistoryResponse, UserMeta } from '@/lib/types'

const PADDING = { top: 40, right: 16, bottom: 48, left: 40 }
const VIEW_W = 600
const VIEW_H = 380
const PLOT_W = VIEW_W - PADDING.left - PADDING.right
const PLOT_H = VIEW_H - PADDING.top - PADDING.bottom

function xScale(i: number, total: number) {
  return PADDING.left + (i / Math.max(total - 1, 1)) * PLOT_W
}

function yScale(pts: number, maxPts: number) {
  return PADDING.top + PLOT_H - (pts / Math.max(maxPts, 1)) * PLOT_H
}

const SHORT_ROUND_LABELS: Record<number, string> = {
  1: 'GS', 8: 'R32', 2: 'R16', 3: 'QF', 4: 'SF', 5: '3rd', 6: 'Final',
}

const FALLBACK_COLORS = ['#498B36', '#3B82F6', '#F59E0B', '#EC4899', '#9C0D15']

type PlayState = 'idle' | 'playing' | 'paused' | 'finished'

const buttonBase: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'transparent',
  color: '#fff',
  fontSize: '11px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  cursor: 'pointer',
  WebkitFontSmoothing: 'antialiased',
  textTransform: 'uppercase',
}

function colorOf(userId: string, idx: number) {
  return PLAYER_COLORS[userId] ?? FALLBACK_COLORS[idx % FALLBACK_COLORS.length]
}

function Flag({ imgCode, name, size = 18 }: { imgCode: string | null; name: string | null; size?: number }) {
  const url = getFlagUrl(imgCode)
  if (!url) return null
  return (
    <img
      src={url}
      alt={name ?? ''}
      style={{ width: `${size}px`, height: `${Math.round(size * 0.75)}px`, display: 'block', borderRadius: '2px', flexShrink: 0 }}
    />
  )
}

function MatchEventCard({ slot, index }: { slot: MatchSlot; index: number }) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 3 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        marginTop: '10px',
        padding: '12px 14px',
        borderRadius: '10px',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
        textAlign: 'center',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      {slot.is_champion_slot ? (
        <>
          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#fbbf24', marginBottom: '6px' }}>
            🏆 Campeon
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', fontSize: '14px', fontWeight: 700, color: '#fff' }}>
            <Flag imgCode={slot.champion_img_code} name={slot.champion_team_name} size={18} />
            {slot.champion_team_name ?? '—'}
          </div>
        </>
      ) : (
        <>
          <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)', marginBottom: '6px' }}>
            {ROUND_LABELS[slot.round_id] ?? slot.round_name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#fff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'flex-end', minWidth: 0 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slot.home_team_name ?? '—'}</span>
              <Flag imgCode={slot.home_img_code} name={slot.home_team_name} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 700, flexShrink: 0 }}>
              {slot.home_score ?? '–'}
              <span style={{ color: 'rgba(255,255,255,0.30)', margin: '0 4px' }}>–</span>
              {slot.away_score ?? '–'}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1, justifyContent: 'flex-start', minWidth: 0 }}>
              <Flag imgCode={slot.away_img_code} name={slot.away_team_name} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{slot.away_team_name ?? '—'}</span>
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

function PlayerSidebar({
  users,
  currentMatchIndex,
  scoringEvents,
}: {
  users: UserMeta[]
  currentMatchIndex: number
  scoringEvents: Record<string, number>
}) {
  const sorted = [...users].sort(
    (a, b) => (b.cumulative[currentMatchIndex] ?? 0) - (a.cumulative[currentMatchIndex] ?? 0)
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {sorted.map((u, rank) => {
        const pts = u.cumulative[currentMatchIndex] ?? 0
        const delta = scoringEvents[u.user_id] ?? 0
        const color = colorOf(u.user_id, users.findIndex((x) => x.user_id === u.user_id))
        const avatar = PLAYER_AVATARS[u.user_id]

        return (
          <motion.div
            key={u.user_id}
            layout
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            {/* Card */}
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 9px',
                borderRadius: '10px',
                background: delta > 0 ? `${color}14` : 'rgba(255,255,255,0.02)',
                border: `1px solid ${delta > 0 ? `${color}30` : 'rgba(255,255,255,0.05)'}`,
                transition: 'background 0.3s, border-color 0.3s',
              }}
            >
              {/* Rank */}
              <span style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.25)', width: '10px', textAlign: 'center', flexShrink: 0 }}>
                {rank + 1}
              </span>

              {/* Avatar */}
              {avatar ? (
                <img
                  src={avatar}
                  alt={u.username}
                  style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', display: 'block', border: `2px solid ${color}60`, flexShrink: 0 }}
                />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                  {u.username[0]?.toUpperCase() ?? '?'}
                </div>
              )}

              {/* Name */}
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.80)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {u.username}
              </span>

              {/* Points */}
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {pts}
              </span>
            </div>

            {/* +N badge slot — always present so layout is stable */}
            <div style={{ width: '32px', flexShrink: 0, alignSelf: 'stretch', position: 'relative', pointerEvents: 'none' }}>
              <AnimatePresence>
                {delta > 0 && (
                  <motion.span
                    key={`badge-${u.user_id}-${currentMatchIndex}`}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: color,
                      whiteSpace: 'nowrap',
                      WebkitFontSmoothing: 'antialiased',
                    }}
                  >
                    +{delta}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function RacePage() {
  const [data, setData] = useState<PointsHistoryResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [playState, setPlayState] = useState<PlayState>('idle')
  const [displayIndex, setDisplayIndex] = useState(0)   // continuous float
  const [speed, setSpeed] = useState<1 | 2 | 4>(1)
  const [scoringEvents, setScoringEvents] = useState<Record<string, number>>({})
  const animRef = useRef<{ raf: number | null; index: number; lastTime: number }>({ raf: null, index: 0, lastTime: 0 })
  const lastTriggeredRef = useRef(-1)
  const scoreTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dataRef = useRef(data)
  const speedRef = useRef(speed)
  useEffect(() => { dataRef.current = data }, [data])
  useEffect(() => { speedRef.current = speed }, [speed])

  useEffect(() => {
    fetch('/api/points-history')
      .then((r) => r.json())
      .then((d: PointsHistoryResponse) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  // Fire scoring events whenever the integer part of displayIndex crosses a new match
  useEffect(() => {
    const intIdx = Math.floor(displayIndex)
    if (intIdx <= lastTriggeredRef.current || intIdx === 0 || !data) return
    lastTriggeredRef.current = intIdx
    const events: Record<string, number> = {}
    for (const u of data.users) {
      const d = (u.cumulative[intIdx] ?? 0) - (u.cumulative[intIdx - 1] ?? 0)
      if (d > 0) events[u.user_id] = d
    }
    setScoringEvents(events)
    if (scoreTimerRef.current) clearTimeout(scoreTimerRef.current)
    scoreTimerRef.current = setTimeout(() => setScoringEvents({}), 900)
  }, [displayIndex, data])

  const totalMatches = data?.matches.length ?? 0

  useEffect(() => {
    const anim = animRef.current
    if (playState !== 'playing') {
      if (anim.raf) cancelAnimationFrame(anim.raf)
      anim.raf = null
      return
    }
    anim.lastTime = performance.now()

    function tick(now: number) {
      const dt = now - anim.lastTime
      anim.lastTime = now
      // advance 1 unit per 900ms at 1x speed
      anim.index = Math.min(anim.index + (dt / 900) * speedRef.current, totalMatches - 1)
      setDisplayIndex(anim.index)
      if (anim.index >= totalMatches - 1) {
        setPlayState('finished')
        return
      }
      anim.raf = requestAnimationFrame(tick)
    }

    anim.raf = requestAnimationFrame(tick)
    return () => {
      if (anim.raf) cancelAnimationFrame(anim.raf)
      anim.raf = null
    }
  }, [playState, totalMatches])

  const titleStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    color: 'rgba(255,255,255,0.40)',
    marginBottom: '16px',
  }

  if (loading) {
    return (
      <div>
        <h1 style={titleStyle}>Race</h1>
        <p style={{ color: 'rgba(255,255,255,0.30)', textAlign: 'center', paddingTop: '80px' }}>Loading...</p>
      </div>
    )
  }

  if (!data || data.matches.length === 0 || data.users.length === 0) {
    return (
      <div>
        <h1 style={titleStyle}>Race</h1>
        <p style={{ color: 'rgba(255,255,255,0.30)', textAlign: 'center', paddingTop: '80px' }}>No finalized matches yet.</p>
      </div>
    )
  }

  const slots = data.matches
  const users = data.users
  const maxPts = Math.max(1, ...users.map((u) => u.cumulative[u.cumulative.length - 1] ?? 0))
  const ticks = Array.from(new Set([0, maxPts / 4, maxPts / 2, (3 * maxPts) / 4, maxPts].map(Math.round)))
  const intIndex = Math.floor(displayIndex)
  const currentSlot = slots[intIndex]

  function handlePlayButton() {
    if (playState === 'playing') {
      setPlayState('paused')
    } else if (playState === 'paused') {
      setPlayState('playing')
    } else {
      animRef.current.index = 0
      lastTriggeredRef.current = -1
      setDisplayIndex(0)
      setPlayState('playing')
    }
  }

  const playLabel = playState === 'playing' ? 'Pause' : playState === 'paused' ? 'Resume' : playState === 'finished' ? 'Replay' : 'Play'

  return (
    <div style={{ WebkitFontSmoothing: 'antialiased' }}>
      <h1 style={titleStyle}>Race</h1>

      {/* Chart + sidebar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>

        {/* Chart */}
        <div style={{ flex: 1, minWidth: 0, borderRadius: '12px', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', padding: '6px' }}>
          <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} style={{ width: '100%', height: 'auto', display: 'block' }}>

            {/* Y-axis gridlines + labels */}
            {ticks.map((t) => (
              <g key={t}>
                <line x1={PADDING.left} x2={PADDING.left + PLOT_W} y1={yScale(t, maxPts)} y2={yScale(t, maxPts)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
                <text x={PADDING.left - 6} y={yScale(t, maxPts) + 3} textAnchor="end" style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.28)' }}>{t}</text>
              </g>
            ))}

            {/* Round boundary lines + labels */}
            {slots.map((s, i) =>
              s.is_round_start ? (
                <g key={`round-${i}`}>
                  <line x1={xScale(i, totalMatches)} x2={xScale(i, totalMatches)} y1={PADDING.top} y2={PADDING.top + PLOT_H} stroke="rgba(255,255,255,0.09)" strokeWidth={1} strokeDasharray="3 5" />
                  <text x={xScale(i, totalMatches) + 3} y={PADDING.top - 8} style={{ fontSize: '8px', fill: 'rgba(255,255,255,0.28)' }}>
                    {SHORT_ROUND_LABELS[s.round_id] ?? s.round_name}
                  </text>
                </g>
              ) : null
            )}

            {/* Baseline */}
            <line x1={PADDING.left} x2={PADDING.left + PLOT_W} y1={PADDING.top + PLOT_H} y2={PADDING.top + PLOT_H} stroke="rgba(255,255,255,0.10)" strokeWidth={1} />

            {/* Current position indicator */}
            <line
              x1={xScale(displayIndex, totalMatches)}
              x2={xScale(displayIndex, totalMatches)}
              y1={PADDING.top}
              y2={PADDING.top + PLOT_H}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
            />

            {/* Player lines — last segment interpolated for smooth drawing */}
            {users.map((u, idx) => {
              const floor = Math.floor(displayIndex)
              const frac = displayIndex - floor
              const pts: string[] = []
              for (let i = 0; i <= floor && i < u.cumulative.length; i++) {
                pts.push(`${xScale(i, totalMatches)},${yScale(u.cumulative[i] ?? 0, maxPts)}`)
              }
              if (frac > 0 && floor + 1 < u.cumulative.length) {
                const y0 = u.cumulative[floor] ?? 0
                const y1 = u.cumulative[floor + 1] ?? 0
                pts.push(`${xScale(displayIndex, totalMatches)},${yScale(y0 + (y1 - y0) * frac, maxPts)}`)
              }
              return (
                <polyline
                  key={u.user_id}
                  points={pts.join(' ')}
                  fill="none"
                  stroke={colorOf(u.user_id, idx)}
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  opacity={0.9}
                />
              )
            })}

            {/* Floating +N badges on the chart */}
            <AnimatePresence>
              {users.map((u, idx) => {
                const delta = scoringEvents[u.user_id] ?? 0
                if (delta <= 0) return null
                const pts = u.cumulative[intIndex] ?? 0
                const cx = xScale(intIndex, totalMatches)
                const cy = yScale(pts, maxPts)
                const color = colorOf(u.user_id, idx)
                return (
                  <motion.g
                    key={`svgbadge-${u.user_id}-${intIndex}`}
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -22 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                  >
                    <text
                      x={cx}
                      y={cy - 8}
                      textAnchor="middle"
                      style={{ fontSize: '10px', fontWeight: 800, fill: color, pointerEvents: 'none' }}
                    >
                      +{delta}
                    </text>
                  </motion.g>
                )
              })}
            </AnimatePresence>
          </svg>
        </div>

        {/* Sidebar (card + 32px badge slot) */}
        <div style={{ width: '182px', flexShrink: 0 }}>
          <PlayerSidebar users={users} currentMatchIndex={intIndex} scoringEvents={scoringEvents} />
        </div>
      </div>

      {/* Match event card */}
      {currentSlot && <MatchEventCard slot={currentSlot} index={intIndex} />}

      {/* Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '14px', paddingBottom: '24px' }}>
        <button onClick={handlePlayButton} style={{ ...buttonBase, minWidth: '86px' }}>
          {playLabel}
        </button>
        {([1, 2, 4] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSpeed(s)}
            style={{ ...buttonBase, ...(speed === s ? { background: 'rgba(255,255,255,0.10)' } : { color: 'rgba(255,255,255,0.40)' }) }}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  )
}

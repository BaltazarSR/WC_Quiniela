'use client'

import { useEffect, useState } from 'react'
import { SoccerIcon } from '@/components/icons'
import { getFlagUrl } from '@/lib/flags'
import type { LeaderboardEntry } from '@/lib/types'

function ChampionCell({ entry, flagSize = 18 }: { entry: LeaderboardEntry; flagSize?: number }) {
  const valueStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '21px',
    gap: '4px',
  }
  if (!entry.champion_team) {
    return <div style={{ ...valueStyle, fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.20)' }}>–</div>
  }
  return (
    <div style={valueStyle}>
      {getFlagUrl(entry.champion_team_img_code) && (
        <img
          src={getFlagUrl(entry.champion_team_img_code)!}
          alt={entry.champion_team}
          style={{ width: `${flagSize}px`, height: `${Math.round(flagSize * 0.75)}px`, display: 'block', borderRadius: '2px', opacity: entry.champion_correct === false ? 0.4 : 1 }}
        />
      )}
      {entry.champion_correct === true && (
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#4ade80' }}>✓</span>
      )}
      {entry.champion_correct === false && (
        <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.25)' }}>✗</span>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '10px',
  color: 'rgba(255,255,255,0.30)',
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
}

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/leaderboard')
      .then((r) => r.json())
      .then((data) => {
        setEntries(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '80px', color: 'rgba(255,255,255,0.30)' }}>
        Loading…
      </div>
    )
  }

  const medalColors = ['#fbbf24', '#94a3b8', '#cd7c2f']

  const ranks: number[] = []
  for (let i = 0; i < entries.length; i++) {
    if (i === 0) { ranks.push(1); continue }
    const curr = entries[i]
    const prev = entries[i - 1]
    if (curr.total_points === prev.total_points) {
      ranks.push(ranks[i - 1])
    } else {
      ranks.push(i + 1)
    }
  }

  return (
    <div>
      <h1
        style={{
          fontSize: '10px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.18em',
          color: 'rgba(255,255,255,0.40)',
          marginBottom: '16px',
        }}
      >
        Leaderboard
      </h1>

      {entries.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.30)', textAlign: 'center', paddingTop: '40px' }}>
          No scores yet. Predictions will be scored when matches end.
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {entries.map((entry, idx) => {
          const rank = ranks[idx]
          return (
          <div
            key={entry.username}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.07)',
              background: rank === 1 ? 'rgba(251,191,36,0.04)' : 'rgba(255,255,255,0.02)',
              gap: '12px',
              transition: 'all 150ms',
            }}
          >
            {/* Rank + username */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
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
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#fff',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {entry.username}
              </span>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              {/* Exact */}
              <div style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Exact</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#4ade80' }}>{entry.exact_scores}</div>
              </div>

              {/* Correct */}
              <div style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Correct</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#fbbf24' }}>{entry.correct_results}</div>
              </div>

              {/* Champion — mobile compact */}
              <div className="block sm:hidden" style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Champ</div>
                <ChampionCell entry={entry} flagSize={13} />
              </div>

              {/* Champion — desktop */}
              <div className="hidden sm:block" style={{ textAlign: 'center' }}>
                <div style={labelStyle}>Champion</div>
                <ChampionCell entry={entry} />
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
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  {entry.total_points}
                </div>
              </div>
            </div>
          </div>
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
        Exact score = 3 pts · Correct result = 1 pt · Champion = 15 pts
      </p>
    </div>
  )
}

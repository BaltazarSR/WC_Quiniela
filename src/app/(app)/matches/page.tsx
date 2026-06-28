'use client'

import { useEffect, useState, useCallback } from 'react'
import { MatchCard } from '@/components/MatchCard'
import { ChampionCard } from '@/components/ChampionCard'
import type { MatchWithPrediction } from '@/lib/types'

type Filter = 1 | 2 | 3 | 4 | 5 | 6 | 8

const FILTER_OPTIONS: { value: Filter; label: string }[] = [
  { value: 1, label: 'Groups' },
  { value: 8, label: 'R32' },
  { value: 2, label: 'R16' },
  { value: 3, label: 'QF' },
  { value: 4, label: 'SF' },
  { value: 5, label: '3rd' },
  { value: 6, label: 'Final' },
]

function groupMatchesByDate(matches: MatchWithPrediction[]) {
  const groups = new Map<string, MatchWithPrediction[]>()
  for (const m of matches) {
    const date = new Intl.DateTimeFormat(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }).format(new Date(m.kickoff_utc))
    if (!groups.has(date)) groups.set(date, [])
    groups.get(date)!.push(m)
  }
  return groups
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<MatchWithPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>(8)

  useEffect(() => {
    fetch('/api/matches')
      .then((r) => r.json())
      .then((data) => {
        setMatches(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handlePredictionSaved = useCallback(
    (matchId: number, homeGoals: number, awayGoals: number) => {
      setMatches((prev) =>
        prev.map((m) =>
          m.id === matchId
            ? {
                ...m,
                prediction: m.prediction
                  ? { ...m.prediction, home_goals: homeGoals, away_goals: awayGoals }
                  : {
                      id: '',
                      user_id: '',
                      match_id: matchId,
                      home_goals: homeGoals,
                      away_goals: awayGoals,
                      points_earned: null,
                      submitted_at: new Date().toISOString(),
                    },
              }
            : m
        )
      )
    },
    []
  )

  const filtered = matches.filter((m) => m.round.id === filter)

  const predictionCount = matches.filter((m) => m.prediction).length
  const scoredCount = matches.filter((m) => m.prediction?.points_earned != null).length
  const totalPoints = matches.reduce((s, m) => s + (m.prediction?.points_earned ?? 0), 0)

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '80px', color: 'rgba(255,255,255,0.30)' }}>
        Loading matches…
      </div>
    )
  }

  const byDate = groupMatchesByDate(filtered)

  return (
    <div>
      <ChampionCard />

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Predictions', value: `${predictionCount} / ${matches.length}` },
          { label: 'Completed', value: scoredCount },
          { label: 'Points', value: totalPoints },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              flex: 1,
              minWidth: '90px',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.06)',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: '4px',
              }}
            >
              {s.label}
            </div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#fff' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Stage filter */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '24px',
          overflowX: 'auto',
          paddingBottom: '4px',
        }}
        className="scrollbar-hide"
      >
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            style={{
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid',
              borderColor: filter === opt.value ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)',
              background: filter === opt.value ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: filter === opt.value ? '#fff' : 'rgba(255,255,255,0.40)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 150ms',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Match list — always grouped by date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {[...byDate.entries()].map(([date, dayMatches]) => (
          <section key={date}>
            <h2
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: '12px',
              }}
            >
              {date}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {dayMatches.map((m) => (
                <MatchCard key={m.id} match={m} onPredictionSaved={handlePredictionSaved} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.30)', paddingTop: '40px' }}>
          No matches in this stage yet.
        </p>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import type { MatchWithPrediction } from '@/lib/types'
import { getFlagUrl } from '@/lib/flags'

export default function HistoryPage() {
  const [matches, setMatches] = useState<MatchWithPrediction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/matches')
      .then((r) => r.json())
      .then((data: MatchWithPrediction[]) => {
        setMatches(data.filter((m) => m.prediction != null))
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

  const totalPoints = matches.reduce((s, m) => s + (m.prediction?.points_earned ?? 0), 0)
  const scored = matches.filter((m) => m.prediction?.points_earned != null)
  const exact = scored.filter((m) => m.prediction?.points_earned === 3).length
  const correct = scored.filter((m) => m.prediction?.points_earned === 1).length

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
        My Predictions
      </h1>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { label: 'Total picks', value: matches.length },
          { label: 'Exact results', value: exact },
          { label: 'Correct results', value: correct },
          { label: 'Total points', value: totalPoints },
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

      {matches.length === 0 && (
        <p style={{ color: 'rgba(255,255,255,0.30)', textAlign: 'center', paddingTop: '40px' }}>
          You haven&apos;t made any predictions yet. Go to Matches to start!
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {matches.map((m) => {
          const pred = m.prediction!
          const pts = pred.points_earned
          const isFinal = m.is_final
          const homeFlag = getFlagUrl(m.home_team.img_code)
          const awayFlag = getFlagUrl(m.away_team.img_code)

          return (
            <div
              key={m.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {/* Match info */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    color: 'rgba(255,255,255,0.30)',
                    marginBottom: '4px',
                  }}
                >
                  M{m.id}
                  {m.group ? ` · Group ${m.group.short_name}` : ` · ${m.round.name}`}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  {homeFlag && (
                    <img src={homeFlag} alt={m.home_team.name} style={{ width: '20px', height: 'auto', borderRadius: '2px' }} />
                  )}
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{m.home_team.name}</span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.30)' }}>vs</span>
                  {awayFlag && (
                    <img src={awayFlag} alt={m.away_team.name} style={{ width: '20px', height: 'auto', borderRadius: '2px' }} />
                  )}
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{m.away_team.name}</span>
                </div>
              </div>

              {/* Prediction + result */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: '10px',
                      color: 'rgba(255,255,255,0.30)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.10em',
                      marginBottom: '2px',
                    }}
                  >
                    Your pick
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', fontFamily: 'ui-monospace, monospace' }}>
                    {pred.home_goals} – {pred.away_goals}
                  </div>
                </div>

                {isFinal && m.home_score != null && (
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        fontSize: '10px',
                        color: 'rgba(255,255,255,0.30)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.10em',
                        marginBottom: '2px',
                      }}
                    >
                      Result
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.60)', fontFamily: 'ui-monospace, monospace' }}>
                      {m.home_score} – {m.away_score}
                    </div>
                  </div>
                )}

                {/* Points badge */}
                <div
                  style={{
                    minWidth: '48px',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    textAlign: 'center',
                    background:
                      pts === 3 ? 'rgba(74,222,128,0.12)'
                      : pts === 1 ? 'rgba(251,191,36,0.12)'
                      : pts === 0 ? 'rgba(255,255,255,0.05)'
                      : 'rgba(255,255,255,0.03)',
                    color:
                      pts === 3 ? '#4ade80'
                      : pts === 1 ? '#fbbf24'
                      : pts === 0 ? 'rgba(255,255,255,0.30)'
                      : 'rgba(255,255,255,0.20)',
                  }}
                >
                  <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em' }}>
                    {pts != null ? `${pts} pt${pts !== 1 ? 's' : ''}` : 'Pending'}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

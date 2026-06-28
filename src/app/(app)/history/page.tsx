'use client'

import { useEffect, useState } from 'react'
import type { MatchWithPicks } from '@/lib/types'
import { getFlagUrl, getCountryCode, shortenTeamName } from '@/lib/flags'
import { CheckIcon, CloseIcon, ChevronDownIcon, SoccerIcon } from '@/components/icons'

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

function PickRow({
  username,
  home_goals,
  away_goals,
  points_earned,
  is_me,
}: {
  username: string
  home_goals: number
  away_goals: number
  points_earned: number | null
  is_me: boolean
}) {
  const pts = points_earned

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        borderRadius: '8px',
        background: is_me ? 'rgba(255,255,255,0.04)' : 'transparent',
        gap: '8px',
      }}
    >
      <span
        style={{
          fontSize: '13px',
          fontWeight: is_me ? 700 : 400,
          color: is_me ? '#fff' : 'rgba(255,255,255,0.60)',
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {username}
        {is_me && (
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontWeight: 500, marginLeft: '6px' }}>
            you
          </span>
        )}
      </span>

      <span
        style={{
          fontSize: '14px',
          fontWeight: 700,
          color: is_me ? '#fff' : 'rgba(255,255,255,0.55)',
          fontFamily: 'ui-monospace, monospace',
          flexShrink: 0,
          minWidth: '44px',
          textAlign: 'center',
        }}
      >
        {home_goals} – {away_goals}
      </span>

      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />

      <div style={{ width: '56px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexShrink: 0 }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            background:
              pts === 3 ? 'rgba(74,222,128,0.12)'
              : pts === 1 ? 'rgba(251,191,36,0.12)'
              : pts === 0 ? 'rgba(255,255,255,0.04)'
              : 'transparent',
            color:
              pts === 3 ? '#4ade80'
              : pts === 1 ? '#fbbf24'
              : pts === 0 ? 'rgba(255,255,255,0.25)'
              : 'rgba(255,255,255,0.20)',
          }}
        >
          {pts === 3 ? <><SoccerIcon size={11} color="#4ade80" /> 3</> : pts === 1 ? <><CheckIcon size={11} color="#fbbf24" /> 1</> : pts === 0 ? <><CloseIcon size={11} color="rgba(255,255,255,0.25)" /> 0</> : '–'}
        </span>
      </div>
    </div>
  )
}

function MatchPickCard({ match }: { match: MatchWithPicks }) {
  const [open, setOpen] = useState(false)

  const homeFlag = getFlagUrl(match.home_team.img_code)
  const awayFlag = getFlagUrl(match.away_team.img_code)
  const homeCode = getCountryCode(match.home_team.img_code)
  const awayCode = getCountryCode(match.away_team.img_code)

  const hasFinalScore = match.is_final && match.home_score != null && match.away_score != null
  const myPick = match.picks.find((p) => p.is_me)
  const myPts = myPick?.points_earned

  return (
    <div
      style={{
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
        overflow: 'hidden',
      }}
    >
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 14px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          gap: '10px',
          textAlign: 'left',
        }}
      >
        {/* Left: match label + teams */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.13em',
              color: 'rgba(255,255,255,0.30)',
              marginBottom: '4px',
            }}
          >
            M{match.id}
            {match.group ? ` · Group ${match.group.short_name}` : ` · ${match.round.name}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap', overflow: 'hidden' }}>
            {homeFlag && (
              <img src={homeFlag} alt={match.home_team.name} style={{ width: '18px', height: 'auto', borderRadius: '2px', flexShrink: 0 }} />
            )}
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap' }}>
              <span className="hidden sm:inline">{match.home_team.name}</span>
              <span className="sm:hidden">{homeCode ?? shortenTeamName(match.home_team.name)}</span>
            </span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.30)', flexShrink: 0 }}>vs</span>
            {awayFlag && (
              <img src={awayFlag} alt={match.away_team.name} style={{ width: '18px', height: 'auto', borderRadius: '2px', flexShrink: 0 }} />
            )}
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span className="hidden sm:inline">{match.away_team.name}</span>
              <span className="sm:hidden">{awayCode ?? shortenTeamName(match.away_team.name)}</span>
            </span>
          </div>
        </div>

        {/* Right: result/pick + pts + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
          {hasFinalScore ? (
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
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 700,
                  fontFamily: 'ui-monospace, monospace',
                  color: 'rgba(255,255,255,0.70)',
                }}
              >
                {match.home_score} – {match.away_score}
              </div>
            </div>
          ) : (
            <span
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.10em',
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              Pending
            </span>
          )}

          {myPts != null && (
            <div style={{ width: '1px', height: '28px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
          )}

          {myPts != null && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '6px',
                background:
                  myPts === 3 ? 'rgba(74,222,128,0.12)'
                  : myPts === 1 ? 'rgba(251,191,36,0.12)'
                  : 'rgba(255,255,255,0.05)',
                color:
                  myPts === 3 ? '#4ade80'
                  : myPts === 1 ? '#fbbf24'
                  : 'rgba(255,255,255,0.30)',
              }}
            >
              {myPts === 3 ? <><SoccerIcon size={11} color="#4ade80" /> 3</> : myPts === 1 ? <><CheckIcon size={11} color="#fbbf24" /> 1</> : <><CloseIcon size={11} color="rgba(255,255,255,0.30)" /> 0</>}
            </span>
          )}

          <ChevronDownIcon
            color="rgba(255,255,255,0.35)"
            size={16}
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms',
            }}
          />
        </div>
      </button>

      {/* Expanded picks list */}
      {open && (
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '6px 2px 8px',
          }}
        >
          {match.picks.length === 0 ? (
            <p
              style={{
                fontSize: '12px',
                color: 'rgba(255,255,255,0.25)',
                textAlign: 'center',
                padding: '12px 0',
              }}
            >
              No prediction yet
            </p>
          ) : (
            <>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  padding: '4px 12px 6px',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.25)',
                }}
              >
                <span>Player</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{ textAlign: 'center', width: '44px' }}>Pick</span>
                  <div style={{ width: '1px', height: '12px', background: 'rgba(255,255,255,0.08)' }} />
                  <span style={{ textAlign: 'center', width: '56px' }}>Pts</span>
                </div>
              </div>
              {match.picks.map((pick) => (
                <PickRow key={pick.username} {...pick} />
              ))}
              {!match.is_locked && (
                <p
                  style={{
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.20)',
                    textAlign: 'center',
                    padding: '8px 12px 4px',
                  }}
                >
                  Other picks visible once the match locks
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  const [matches, setMatches] = useState<MatchWithPicks[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter | null>(null)

  useEffect(() => {
    Promise.all([
      fetch('/api/picks').then((r) => r.json()),
      fetch('/api/settings').then((r) => r.json()).catch(() => ({ defaultRoundId: 8 })),
    ]).then(([picksData, settings]: [MatchWithPicks[], { defaultRoundId: number }]) => {
      setMatches(picksData)
      setFilter((settings.defaultRoundId ?? 8) as Filter)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading || filter === null) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '80px', color: 'rgba(255,255,255,0.30)' }}>
        Loading…
      </div>
    )
  }

  const filtered = matches.filter(
    (m) => m.round.id === filter && m.picks.some((p) => p.is_me)
  )

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
        All Picks
      </h1>

      {/* Stage filter */}
      <div
        style={{
          display: 'flex',
          gap: '6px',
          marginBottom: '20px',
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

      {filtered.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.30)', textAlign: 'center', paddingTop: '40px' }}>
          No picks in this stage yet.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {filtered.map((m) => (
            <MatchPickCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  )
}

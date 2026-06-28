'use client'

import { useState, useEffect } from 'react'
import { CountdownTimer } from './CountdownTimer'
import { SoccerIcon, PinIcon, LockIcon } from './icons'
import type { MatchWithPrediction } from '@/lib/types'
import { ELIMINATION_ROUND_IDS } from '@/lib/types'
import { isPredictionLocked } from '@/lib/scoring'
import { getFlagUrl, getCountryCode, shortenTeamName } from '@/lib/flags'

function formatKickoff(utc: string): string {
  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  }).format(new Date(utc))
}

interface Props {
  match: MatchWithPrediction
  onPredictionSaved: (matchId: number, homeGoals: number, awayGoals: number, advancingTeamId: number | null) => void
}

export function MatchCard({ match, onPredictionSaved }: Props) {
  const adminLocked = !match.is_unlocked
  const [timeClosed, setTimeClosed] = useState(false)
  const locked = adminLocked || timeClosed

  const [homeGoals, setHomeGoals] = useState(match.prediction?.home_goals ?? '')
  const [awayGoals, setAwayGoals] = useState(match.prediction?.away_goals ?? '')
  const [advancingTeamId, setAdvancingTeamId] = useState<number | ''>(match.prediction?.advancing_team_id ?? '')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (adminLocked) {
      setTimeClosed(false)
      return
    }
    const lockTime = new Date(match.kickoff_utc).getTime() - 5 * 60 * 1000
    const delay = lockTime - Date.now()
    if (delay <= 0) {
      setTimeClosed(true)
      return
    }
    setTimeClosed(false)
    // setTimeout overflows for delays > ~24.8 days (32-bit limit), so poll instead
    const id = setInterval(() => {
      if (Date.now() >= lockTime) setTimeClosed(true)
    }, 60_000)
    return () => clearInterval(id)
  }, [match.kickoff_utc, match.is_unlocked, adminLocked])

  const hasFinalScore = match.is_final && match.home_score != null && match.away_score != null
  const hasPrediction = match.prediction != null
  const pointsEarned = match.prediction?.points_earned

  const isElim = (ELIMINATION_ROUND_IDS as readonly number[]).includes(match.round.id)
  const predIsTie = homeGoals !== '' && awayGoals !== '' && Number(homeGoals) === Number(awayGoals)
  const showAdvancing = isElim && !locked && !hasFinalScore && predIsTie

  async function handleSave() {
    if (homeGoals === '' || awayGoals === '') return
    if (isElim && predIsTie && advancingTeamId === '') return
    setSaveError('')
    setSaving(true)

    const res = await fetch('/api/predictions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        matchId: match.id,
        homeGoals: Number(homeGoals),
        awayGoals: Number(awayGoals),
        advancingTeamId: isElim && predIsTie ? Number(advancingTeamId) : null,
      }),
    })

    setSaving(false)

    if (!res.ok) {
      const d = await res.json()
      setSaveError(d.error ?? 'Failed to save.')
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
    onPredictionSaved(
      match.id,
      Number(homeGoals),
      Number(awayGoals),
      isElim && predIsTie ? Number(advancingTeamId) : null
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '52px',
    height: '44px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.06)',
    border: '2px solid rgba(255,255,255,0.12)',
    color: '#fff',
    fontSize: '20px',
    fontWeight: 700,
    textAlign: 'center',
    outline: 'none',
    transition: 'border-color 150ms',
    cursor: locked || hasFinalScore ? 'not-allowed' : 'text',
    opacity: locked || hasFinalScore ? 0.5 : 1,
  }

  const homeFlag = getFlagUrl(match.home_team.img_code)
  const awayFlag = getFlagUrl(match.away_team.img_code)
  const homeCode = getCountryCode(match.home_team.img_code)
  const awayCode = getCountryCode(match.away_team.img_code)

  // Advancing team for the final result display
  const actualAdvancingTeam =
    hasFinalScore && match.home_score === match.away_score && match.advancing_team_id != null
      ? match.advancing_team_id === match.home_team.id
        ? match.home_team
        : match.away_team
      : null

  // User's predicted advancing team (for locked-but-not-final display)
  const predAdvancingTeam =
    isElim && locked && !hasFinalScore && match.prediction?.advancing_team_id != null
      ? match.prediction.advancing_team_id === match.home_team.id
        ? match.home_team
        : match.away_team
      : null

  return (
    <div
      style={{
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        padding: '16px',
        transition: 'border-color 150ms',
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '14px',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              color: 'rgba(255,255,255,0.40)',
            }}
          >
            Match {match.id}
          </span>
          {match.group && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: '10px' }}>·</span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                  color: 'rgba(255,255,255,0.40)',
                }}
              >
                Group {match.group.short_name}
              </span>
            </>
          )}
        </div>

        {/* Status badge */}
        {hasFinalScore ? (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color:
                pointsEarned === 3
                  ? '#4ade80'
                  : pointsEarned === 1
                  ? '#fbbf24'
                  : pointsEarned === 0 && hasPrediction
                  ? 'rgba(255,255,255,0.30)'
                  : 'rgba(255,255,255,0.40)',
              padding: '3px 8px',
              borderRadius: '6px',
              background:
                pointsEarned === 3
                  ? 'rgba(74,222,128,0.10)'
                  : pointsEarned === 1
                  ? 'rgba(251,191,36,0.10)'
                  : 'rgba(255,255,255,0.05)',
            }}
          >
            {pointsEarned != null ? (
              pointsEarned === 3 ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <SoccerIcon color="#4ade80" size={10} />
                  3 pts
                </span>
              ) : pointsEarned === 1 ? '✓ 1 pt' : '✗ 0 pts'
            ) : 'Final'}
          </span>
        ) : adminLocked ? (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.30)',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.05)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <LockIcon color="rgba(255,255,255,0.30)" size={10} />
            Locked
          </span>
        ) : timeClosed ? (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(251,191,36,0.70)',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(251,191,36,0.08)',
            }}
          >
            Closed
          </span>
        ) : (
          <CountdownTimer kickoffUtc={match.kickoff_utc} />
        )}
      </div>

      {/* Teams + score/prediction row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        {/* Home team */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '8px',
            minWidth: 0,
          }}
        >
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
            <span className="hidden sm:inline">{match.home_team.name}</span>
            <span className="sm:hidden">{homeCode ?? shortenTeamName(match.home_team.name)}</span>
          </span>
          {homeFlag && (
            <img
              src={homeFlag}
              alt={match.home_team.name}
              style={{ width: '24px', height: 'auto', borderRadius: '2px', flexShrink: 0 }}
            />
          )}
        </div>

        {/* Score/input area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <input
            type="number"
            min={0}
            max={99}
            value={homeGoals}
            disabled={locked || hasFinalScore}
            onChange={(e) => {
              const v = e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
              setHomeGoals(v)
              setSaved(false)
              if (v !== awayGoals) setAdvancingTeamId('')
            }}
            style={inputStyle}
            onFocus={(e) => !locked && !hasFinalScore && (e.target.style.borderColor = 'rgba(255,255,255,0.30)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
          <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '16px' }}>–</span>
          <input
            type="number"
            min={0}
            max={99}
            value={awayGoals}
            disabled={locked || hasFinalScore}
            onChange={(e) => {
              const v = e.target.value === '' ? '' : Math.max(0, Number(e.target.value))
              setAwayGoals(v)
              setSaved(false)
              if (homeGoals !== v) setAdvancingTeamId('')
            }}
            style={inputStyle}
            onFocus={(e) => !locked && !hasFinalScore && (e.target.style.borderColor = 'rgba(255,255,255,0.30)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>

        {/* Away team */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '8px',
            minWidth: 0,
          }}
        >
          {awayFlag && (
            <img
              src={awayFlag}
              alt={match.away_team.name}
              style={{ width: '24px', height: 'auto', borderRadius: '2px', flexShrink: 0 }}
            />
          )}
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
            <span className="hidden sm:inline">{match.away_team.name}</span>
            <span className="sm:hidden">{awayCode ?? shortenTeamName(match.away_team.name)}</span>
          </span>
        </div>
      </div>

      {/* Who advances? — shown when predicting a tie in an elimination round */}
      {showAdvancing && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.13em',
              color: 'rgba(255,255,255,0.35)',
              marginBottom: '8px',
            }}
          >
            Who advances?
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[match.home_team, match.away_team].map((team) => {
              const flag = getFlagUrl(team.img_code)
              const code = getCountryCode(team.img_code)
              const selected = advancingTeamId === team.id
              return (
                <button
                  key={team.id}
                  onClick={() => { setAdvancingTeamId(team.id); setSaved(false) }}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selected ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.10)',
                    background: selected ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: selected ? '#fff' : 'rgba(255,255,255,0.45)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 150ms',
                  }}
                >
                  {flag && (
                    <img src={flag} alt={team.name} style={{ width: '18px', height: 'auto', borderRadius: '2px', flexShrink: 0 }} />
                  )}
                  <span className="hidden sm:inline">{team.name}</span>
                  <span className="sm:hidden">{code ?? shortenTeamName(team.name)}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Locked advancing team pick (locked but not yet final) */}
      {predAdvancingTeam && (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.40)',
          }}
        >
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.10em', fontSize: '10px' }}>Advances:</span>
          {getFlagUrl(predAdvancingTeam.img_code) && (
            <img src={getFlagUrl(predAdvancingTeam.img_code)!} alt={predAdvancingTeam.name} style={{ width: '16px', height: 'auto', borderRadius: '2px' }} />
          )}
          <span style={{ color: 'rgba(255,255,255,0.60)', fontWeight: 600 }}>
            <span className="hidden sm:inline">{predAdvancingTeam.name}</span>
            <span className="sm:hidden">{getCountryCode(predAdvancingTeam.img_code) ?? shortenTeamName(predAdvancingTeam.name)}</span>
          </span>
        </div>
      )}

      {/* Sub-result row: show actual score (and advancing team) when match is final */}
      {hasFinalScore && (
        <div
          style={{
            marginTop: '10px',
            paddingTop: '10px',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.40)',
            textAlign: 'center',
          }}
        >
          Result:{' '}
          <span style={{ color: 'rgba(255,255,255,0.70)', fontFamily: 'ui-monospace, monospace' }}>
            {match.home_score} – {match.away_score}
          </span>
          {actualAdvancingTeam && (
            <span style={{ marginLeft: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              ·
              {getFlagUrl(actualAdvancingTeam.img_code) && (
                <img src={getFlagUrl(actualAdvancingTeam.img_code)!} alt={actualAdvancingTeam.name} style={{ width: '14px', height: 'auto', borderRadius: '2px', marginLeft: '6px' }} />
              )}
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>
                <span className="hidden sm:inline">{actualAdvancingTeam.name}</span>
                <span className="sm:hidden">{getCountryCode(actualAdvancingTeam.img_code) ?? shortenTeamName(actualAdvancingTeam.name)}</span>
                {' '}advances
              </span>
            </span>
          )}
        </div>
      )}

      {/* Footer row: venue + time + save button */}
      <div
        style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            color: 'rgba(255,255,255,0.30)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            minWidth: 0,
            overflow: 'hidden',
          }}
        >
          <PinIcon color="#ef4444" size={11} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {match.stadium.name} · {formatKickoff(match.kickoff_utc)}
          </span>
        </span>

        {!hasFinalScore && !locked && (
          <button
            onClick={handleSave}
            disabled={saving || homeGoals === '' || awayGoals === '' || (isElim && predIsTie && advancingTeamId === '')}
            style={{
              flexShrink: 0,
              height: '32px',
              padding: '0 14px',
              borderRadius: '8px',
              border: 'none',
              background: saved
                ? 'rgba(74,222,128,0.15)'
                : 'linear-gradient(to right, #042C8F, #498B36)',
              color: saved ? '#4ade80' : '#fff',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              cursor: saving || homeGoals === '' || awayGoals === '' || (isElim && predIsTie && advancingTeamId === '') ? 'not-allowed' : 'pointer',
              opacity: saving || homeGoals === '' || awayGoals === '' || (isElim && predIsTie && advancingTeamId === '') ? 0.5 : 1,
              transition: 'all 150ms',
            }}
          >
            {saving ? '…' : saved ? '✓ Saved' : 'Save'}
          </button>
        )}

      </div>

      {saveError && (
        <p style={{ marginTop: '8px', fontSize: '12px', color: '#ff6b6b', textAlign: 'center' }}>
          {saveError}
        </p>
      )}
    </div>
  )
}

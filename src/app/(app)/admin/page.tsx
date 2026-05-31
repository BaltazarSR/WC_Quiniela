'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDownIcon, LockIcon } from '@/components/icons'
import type { MatchWithPrediction, Team } from '@/lib/types'
import { ROUND_ORDER, ROUND_LABELS } from '@/lib/types'
import { getFlagUrl } from '@/lib/flags'
import { isPredictionLocked } from '@/lib/scoring'

interface ScoreState {
  homeScore: string
  awayScore: string
  isFinal: boolean
  saving: boolean
  saved: boolean
  error: string
}

interface TeamState {
  homeTeamId: number
  awayTeamId: number
  isUnlocked: boolean
  toggling: boolean
  saving: boolean
  saved: boolean
  error: string
}

const KNOCKOUT_ROUNDS = [8, 2, 3, 4, 5, 6]

function SelectWrap({ flex, children }: { flex?: number | string; children: React.ReactNode }) {
  return (
    <div style={{ position: 'relative', flex }}>
      {children}
      <ChevronDownIcon
        color="rgba(255,255,255,0.40)"
        size={14}
        style={{
          position: 'absolute',
          right: '9px',
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<'scores' | 'teams'>('scores')
  const [matches, setMatches] = useState<MatchWithPrediction[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [scoreStates, setScoreStates] = useState<Record<number, ScoreState>>({})
  const [teamStates, setTeamStates] = useState<Record<number, TeamState>>({})
  const [roundFilter, setRoundFilter] = useState<number>(0)
  const [teamRoundFilter, setTeamRoundFilter] = useState<number>(0)
  const [champTeamId, setChampTeamId] = useState<number | null>(null)
  const [champSelectId, setChampSelectId] = useState<number | ''>('')
  const [champSaving, setChampSaving] = useState(false)
  const [champSaved, setChampSaved] = useState(false)
  const [champError, setChampError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/matches').then((r) => r.json()),
      fetch('/api/teams').then((r) => r.json()),
      fetch('/api/champion-prediction').then((r) => r.json()).catch(() => null),
    ]).then(([matchData, teamData, champData]: [MatchWithPrediction[], Team[], { champion_team_id: number | null } | null]) => {
      setMatches(matchData)
      setTeams(teamData)
      if (champData?.champion_team_id != null) {
        setChampTeamId(champData.champion_team_id)
        setChampSelectId(champData.champion_team_id)
      }

      const scores: Record<number, ScoreState> = {}
      const tms: Record<number, TeamState> = {}

      for (const m of matchData) {
        scores[m.id] = {
          homeScore: m.home_score?.toString() ?? '',
          awayScore: m.away_score?.toString() ?? '',
          isFinal: m.is_final,
          saving: false,
          saved: false,
          error: '',
        }
        tms[m.id] = {
          homeTeamId: m.home_team.id,
          awayTeamId: m.away_team.id,
          isUnlocked: m.is_unlocked,
          toggling: false,
          saving: false,
          saved: false,
          error: '',
        }
      }

      setScoreStates(scores)
      setTeamStates(tms)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function updateScore(id: number, patch: Partial<ScoreState>) {
    setScoreStates((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  function updateTeam(id: number, patch: Partial<TeamState>) {
    setTeamStates((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }))
  }

  async function handleSaveScore(match: MatchWithPrediction) {
    const s = scoreStates[match.id]
    if (!s || s.homeScore === '' || s.awayScore === '') return

    updateScore(match.id, { saving: true, error: '' })

    const res = await fetch(`/api/admin/matches/${match.id}/score`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        homeScore: Number(s.homeScore),
        awayScore: Number(s.awayScore),
        isFinal: s.isFinal,
      }),
    })

    if (!res.ok) {
      const d = await res.json()
      updateScore(match.id, { saving: false, error: d.error ?? 'Failed.' })
      return
    }

    updateScore(match.id, { saving: false, saved: true })
    setTimeout(() => updateScore(match.id, { saved: false }), 2000)
    setMatches((prev) =>
      prev.map((m) =>
        m.id === match.id
          ? { ...m, home_score: Number(s.homeScore), away_score: Number(s.awayScore), is_final: s.isFinal }
          : m
      )
    )
  }

  async function handleSaveTeams(match: MatchWithPrediction) {
    const t = teamStates[match.id]
    if (!t) return

    updateTeam(match.id, { saving: true, error: '' })

    const res = await fetch(`/api/admin/matches/${match.id}/teams`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ homeTeamId: t.homeTeamId, awayTeamId: t.awayTeamId }),
    })

    if (!res.ok) {
      const d = await res.json()
      updateTeam(match.id, { saving: false, error: d.error ?? 'Failed.' })
      return
    }

    updateTeam(match.id, { saving: false, saved: true })
    setTimeout(() => updateTeam(match.id, { saved: false }), 2000)

    setMatches((prev) =>
      prev.map((m) => {
        if (m.id !== match.id) return m
        return {
          ...m,
          home_team: teams.find((tm) => tm.id === t.homeTeamId) ?? m.home_team,
          away_team: teams.find((tm) => tm.id === t.awayTeamId) ?? m.away_team,
        }
      })
    )
  }

  async function handleSetChampion() {
    if (!champSelectId) return
    setChampError('')
    setChampSaving(true)
    const res = await fetch('/api/admin/champion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: Number(champSelectId) }),
    })
    setChampSaving(false)
    if (!res.ok) {
      const d = await res.json()
      setChampError(d.error ?? 'Failed.')
      return
    }
    setChampTeamId(Number(champSelectId))
    setChampSaved(true)
    setTimeout(() => setChampSaved(false), 2000)
  }

  async function handleClearChampion() {
    setChampError('')
    setChampSaving(true)
    const res = await fetch('/api/admin/champion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: null }),
    })
    setChampSaving(false)
    if (!res.ok) return
    setChampTeamId(null)
    setChampSelectId('')
  }

  async function handleToggleUnlock(match: MatchWithPrediction) {
    const t = teamStates[match.id]
    if (!t || t.toggling) return
    const next = !t.isUnlocked
    updateTeam(match.id, { toggling: true })
    const res = await fetch(`/api/admin/matches/${match.id}/open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isUnlocked: next }),
    })
    if (!res.ok) {
      updateTeam(match.id, { toggling: false, error: 'Failed to update.' })
      return
    }
    updateTeam(match.id, { isUnlocked: next, toggling: false })
    router.refresh()
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', paddingTop: '80px', color: 'rgba(255,255,255,0.30)' }}>
        Loading…
      </div>
    )
  }

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 16px',
    borderRadius: '8px',
    border: '1px solid',
    borderColor: active ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.08)',
    background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
    color: active ? '#fff' : 'rgba(255,255,255,0.40)',
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '0.10em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'all 150ms',
  })

  const inputS: React.CSSProperties = {
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
  }

  const selectS: React.CSSProperties = {
    height: '36px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#fff',
    fontSize: '13px',
    padding: '0 28px 0 10px',
    outline: 'none',
    cursor: 'pointer',
    width: '100%',
    appearance: 'none',
    WebkitAppearance: 'none',
  }

  // ── Scores tab ────────────────────────────────────────────────
  if (tab === 'scores') {
    const filtered = roundFilter === 0 ? matches : matches.filter((m) => m.round.id === roundFilter)

    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button style={tabStyle(true)} onClick={() => setTab('scores')}>Scores</button>
            <button style={tabStyle(false)} onClick={() => setTab('teams')}>Teams</button>
          </div>
          <SelectWrap>
            <select
              value={roundFilter}
              onChange={(e) => setRoundFilter(Number(e.target.value))}
              style={{ ...selectS, width: 'auto' }}
            >
              <option value={0}>All rounds</option>
              {ROUND_ORDER.map((id) => (
                <option key={id} value={id}>{ROUND_LABELS[id]}</option>
              ))}
            </select>
          </SelectWrap>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map((match) => {
            const s = scoreStates[match.id]
            if (!s) return null

            return (
              <div
                key={match.id}
                style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: match.is_final ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.06)',
                  background: match.is_final ? 'rgba(74,222,128,0.03)' : 'rgba(255,255,255,0.02)',
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.30)' }}>
                    M{match.id} · {match.round.id === 1 && match.group ? `Group ${match.group.short_name}` : match.round.name}
                  </span>
                  {match.is_final && (
                    <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: '#4ade80', background: 'rgba(74,222,128,0.10)', padding: '3px 8px', borderRadius: '6px' }}>
                      Final
                    </span>
                  )}
                </div>

                {/* Teams + inputs */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', minWidth: 0 }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {match.home_team.name}
                    </span>
                    {getFlagUrl(match.home_team.img_code) && (
                      <img src={getFlagUrl(match.home_team.img_code)!} alt={match.home_team.name} style={{ width: '24px', height: 'auto', borderRadius: '2px', flexShrink: 0 }} />
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <input type="number" min={0} value={s.homeScore}
                      onChange={(e) => updateScore(match.id, { homeScore: e.target.value })}
                      style={inputS} placeholder="–"
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.30)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                    />
                    <span style={{ color: 'rgba(255,255,255,0.30)', fontSize: '16px' }}>–</span>
                    <input type="number" min={0} value={s.awayScore}
                      onChange={(e) => updateScore(match.id, { awayScore: e.target.value })}
                      style={inputS} placeholder="–"
                      onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.30)')}
                      onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
                    />
                  </div>

                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', minWidth: 0 }}>
                    {getFlagUrl(match.away_team.img_code) && (
                      <img src={getFlagUrl(match.away_team.img_code)!} alt={match.away_team.name} style={{ width: '24px', height: 'auto', borderRadius: '2px', flexShrink: 0 }} />
                    )}
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {match.away_team.name}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button
                    onClick={() => updateScore(match.id, { isFinal: !s.isFinal })}
                    style={{
                      height: '32px', padding: '0 12px', borderRadius: '8px', border: '1px solid',
                      borderColor: s.isFinal ? 'rgba(74,222,128,0.40)' : 'rgba(255,255,255,0.10)',
                      background: s.isFinal ? 'rgba(74,222,128,0.12)' : 'transparent',
                      color: s.isFinal ? '#4ade80' : 'rgba(255,255,255,0.35)',
                      fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: 'pointer', transition: 'all 150ms',
                    }}
                  >
                    {s.isFinal ? '● Final' : '○ Mark Final'}
                  </button>

                  <button
                    onClick={() => handleSaveScore(match)}
                    disabled={s.saving || s.homeScore === '' || s.awayScore === ''}
                    style={{
                      marginLeft: 'auto', height: '32px', padding: '0 16px', borderRadius: '8px', border: 'none',
                      background: s.saved ? 'rgba(74,222,128,0.15)' : 'linear-gradient(to right, #042C8F, #498B36)',
                      color: s.saved ? '#4ade80' : '#fff',
                      fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                      cursor: s.saving || s.homeScore === '' || s.awayScore === '' ? 'not-allowed' : 'pointer',
                      opacity: s.saving || s.homeScore === '' || s.awayScore === '' ? 0.5 : 1,
                      transition: 'all 150ms',
                    }}
                  >
                    {s.saving ? '…' : s.saved ? '✓ Saved' : 'Save'}
                  </button>
                </div>

                {s.error && <p style={{ marginTop: '8px', fontSize: '12px', color: '#ff6b6b' }}>{s.error}</p>}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // ── Teams tab ─────────────────────────────────────────────────
  const knockoutMatches = matches.filter(
    (m) => KNOCKOUT_ROUNDS.includes(m.round.id) && (teamRoundFilter === 0 || m.round.id === teamRoundFilter)
  )

  const byRound = KNOCKOUT_ROUNDS.reduce((acc, roundId) => {
    const group = knockoutMatches.filter((m) => m.round.id === roundId)
    if (group.length) acc.set(roundId, group)
    return acc
  }, new Map<number, MatchWithPrediction[]>())

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={tabStyle(false)} onClick={() => setTab('scores')}>Scores</button>
          <button style={tabStyle(true)} onClick={() => setTab('teams')}>Teams</button>
        </div>
        <SelectWrap>
          <select
            value={teamRoundFilter}
            onChange={(e) => setTeamRoundFilter(Number(e.target.value))}
            style={{ ...selectS, width: 'auto' }}
          >
            <option value={0}>All rounds</option>
            {KNOCKOUT_ROUNDS.map((id) => (
              <option key={id} value={id}>{ROUND_LABELS[id]}</option>
            ))}
          </select>
        </SelectWrap>
      </div>

      {/* Champion setting */}
      <div
        style={{
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.08)',
          background: 'rgba(255,255,255,0.02)',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.40)', marginBottom: '12px' }}>
          Tournament Champion
        </div>

        {champTeamId != null ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {getFlagUrl(teams.find((t) => t.id === champTeamId)?.img_code ?? null) && (
              <img
                src={getFlagUrl(teams.find((t) => t.id === champTeamId)?.img_code ?? null)!}
                alt=""
                style={{ width: '22px', height: 'auto', borderRadius: '2px' }}
              />
            )}
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff', flex: 1 }}>
              {teams.find((t) => t.id === champTeamId)?.name ?? 'Unknown'}
            </span>
            <button
              onClick={handleClearChampion}
              disabled={champSaving}
              style={{
                height: '32px', padding: '0 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.10)',
                background: 'transparent', color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase', cursor: champSaving ? 'not-allowed' : 'pointer',
                opacity: champSaving ? 0.5 : 1, transition: 'all 150ms',
              }}
            >
              Clear
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <SelectWrap flex={1}>
              <select
                value={champSelectId}
                onChange={(e) => setChampSelectId(e.target.value === '' ? '' : Number(e.target.value))}
                style={selectS}
              >
                <option value="">Select winning team…</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </SelectWrap>
            <button
              onClick={handleSetChampion}
              disabled={!champSelectId || champSaving}
              style={{
                flexShrink: 0, height: '36px', padding: '0 14px', borderRadius: '8px', border: 'none',
                background: champSaved ? 'rgba(74,222,128,0.15)' : 'linear-gradient(to right, #042C8F, #498B36)',
                color: champSaved ? '#4ade80' : '#fff', fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                cursor: !champSelectId || champSaving ? 'not-allowed' : 'pointer',
                opacity: !champSelectId || champSaving ? 0.5 : 1, transition: 'all 150ms',
              }}
            >
              {champSaving ? '…' : champSaved ? '✓ Saved' : 'Set Champion'}
            </button>
          </div>
        )}

        {champError && <p style={{ marginTop: '8px', fontSize: '12px', color: '#ff6b6b' }}>{champError}</p>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {[...byRound.entries()].map(([roundId, roundMatches]) => (
          <section key={roundId}>
            <h2 style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.40)', marginBottom: '10px' }}>
              {ROUND_LABELS[roundId]}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {roundMatches.map((match) => {
                const t = teamStates[match.id]
                if (!t) return null

                const currentHome = teams.find((tm) => tm.id === t.homeTeamId) ?? match.home_team
                const currentAway = teams.find((tm) => tm.id === t.awayTeamId) ?? match.away_team
                const homeAssigned = currentHome.img_code != null
                const awayAssigned = currentAway.img_code != null

                return (
                  <div
                    key={match.id}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '12px',
                      border: '1px solid',
                      borderColor: homeAssigned && awayAssigned ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)',
                      background: 'rgba(255,255,255,0.02)',
                    }}
                  >
                    <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.30)', marginBottom: '10px' }}>
                      M{match.id}
                    </div>

                    {/* Team preview row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '10px' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', minWidth: 0 }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: homeAssigned ? '#fff' : 'rgba(255,255,255,0.30)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {currentHome.name}
                        </span>
                        {homeAssigned && (
                          <img src={getFlagUrl(currentHome.img_code)!} alt={currentHome.name} style={{ width: '22px', height: 'auto', borderRadius: '2px', flexShrink: 0 }} />
                        )}
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.20)', fontSize: '13px', flexShrink: 0 }}>vs</span>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: '8px', minWidth: 0 }}>
                        {awayAssigned && (
                          <img src={getFlagUrl(currentAway.img_code)!} alt={currentAway.name} style={{ width: '22px', height: 'auto', borderRadius: '2px', flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: '13px', fontWeight: 600, color: awayAssigned ? '#fff' : 'rgba(255,255,255,0.30)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {currentAway.name}
                        </span>
                      </div>
                    </div>

                    {/* Selectors + save */}
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <SelectWrap flex={1}>
                        <select value={t.homeTeamId} onChange={(e) => updateTeam(match.id, { homeTeamId: Number(e.target.value), error: '' })} style={selectS}>
                          {!homeAssigned && <option value={match.home_team.id}>{match.home_team.name}</option>}
                          {teams.filter((tm) => tm.id !== t.awayTeamId).map((tm) => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                        </select>
                      </SelectWrap>
                      <SelectWrap flex={1}>
                        <select value={t.awayTeamId} onChange={(e) => updateTeam(match.id, { awayTeamId: Number(e.target.value), error: '' })} style={selectS}>
                          {!awayAssigned && <option value={match.away_team.id}>{match.away_team.name}</option>}
                          {teams.filter((tm) => tm.id !== t.homeTeamId).map((tm) => <option key={tm.id} value={tm.id}>{tm.name}</option>)}
                        </select>
                      </SelectWrap>
                      <button
                        onClick={() => handleSaveTeams(match)}
                        disabled={t.saving || t.homeTeamId === t.awayTeamId}
                        style={{
                          flexShrink: 0, height: '36px', padding: '0 14px', borderRadius: '8px', border: 'none',
                          background: t.saved ? 'rgba(74,222,128,0.15)' : 'linear-gradient(to right, #042C8F, #498B36)',
                          color: t.saved ? '#4ade80' : '#fff',
                          fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                          cursor: t.saving || t.homeTeamId === t.awayTeamId ? 'not-allowed' : 'pointer',
                          opacity: t.saving || t.homeTeamId === t.awayTeamId ? 0.5 : 1,
                          transition: 'all 150ms',
                        }}
                      >
                        {t.saving ? '…' : t.saved ? '✓ Saved' : 'Assign'}
                      </button>
                    </div>

                    {/* Unlock/lock toggle — disabled once match has closed */}
                    <div style={{ display: 'flex', marginTop: '8px' }}>
                      <button
                        onClick={() => handleToggleUnlock(match)}
                        disabled={t.toggling || isPredictionLocked(match.kickoff_utc)}
                        style={{
                          height: '30px', padding: '0 12px', borderRadius: '8px', border: '1px solid',
                          borderColor: t.isUnlocked ? 'rgba(74,222,128,0.40)' : 'rgba(255,255,255,0.10)',
                          background: t.isUnlocked ? 'rgba(74,222,128,0.10)' : 'transparent',
                          color: t.isUnlocked ? '#4ade80' : 'rgba(255,255,255,0.35)',
                          fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                          cursor: (t.toggling || isPredictionLocked(match.kickoff_utc)) ? 'not-allowed' : 'pointer',
                          opacity: (t.toggling || isPredictionLocked(match.kickoff_utc)) ? 0.4 : 1,
                          transition: 'all 150ms',
                          display: 'flex', alignItems: 'center', gap: '5px',
                        }}
                      >
                        <LockIcon color={t.isUnlocked ? '#4ade80' : 'rgba(255,255,255,0.35)'} size={10} />
                        {t.isUnlocked ? 'Unlocked' : 'Lock'}
                      </button>
                    </div>

                    {t.error && <p style={{ marginTop: '8px', fontSize: '12px', color: '#ff6b6b' }}>{t.error}</p>}
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

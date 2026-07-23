'use client'

import { useState, useEffect } from 'react'
import { getFlagUrl } from '@/lib/flags'
import { SoccerIcon } from './icons'
import type { Team, ChampionData } from '@/lib/types'

export function ChampionCard() {
  const [data, setData] = useState<ChampionData | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState<number | ''>('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/champion-prediction').then((r) => r.json()),
      fetch('/api/teams').then((r) => r.json()),
    ]).then(([champData, teamsData]: [ChampionData, Team[]]) => {
      setData(champData)
      setTeams(teamsData)
      if (champData.prediction) setSelectedTeamId(champData.prediction.team_id)
    })
  }, [])

  async function handleSave() {
    if (!selectedTeamId) return
    setError('')
    setSaving(true)
    const res = await fetch('/api/champion-prediction', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teamId: Number(selectedTeamId) }),
    })
    setSaving(false)
    if (!res.ok) {
      const d = await res.json()
      setError(d.error ?? 'Failed to save.')
      return
    }
    const t = teams.find((tm) => tm.id === Number(selectedTeamId))
    setData((prev) =>
      prev
        ? {
            ...prev,
            prediction: {
              team_id: Number(selectedTeamId),
              team_name: t?.name ?? '',
              team_img_code: t?.img_code ?? null,
            },
          }
        : prev
    )
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!data) return null

  const champDecided = data.champion_team_id != null
  const isCorrect = champDecided && data.prediction?.team_id === data.champion_team_id

  // Tournament running: just show the pick quietly, or nothing if they didn't pick
  if (data.is_locked && !champDecided) {
    if (!data.prediction) return null
    const flag = getFlagUrl(data.prediction.team_img_code)
    return (
      <div
        style={{
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)',
          padding: '16px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.40)', marginBottom: '10px' }}>
          Champion
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>Your pick</span>
          {flag && <img src={flag} alt={data.prediction.team_name} style={{ width: '20px', height: 'auto', borderRadius: '2px' }} />}
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{data.prediction.team_name}</span>
        </div>
      </div>
    )
  }

  const cardStyle: React.CSSProperties = {
    borderRadius: '12px',
    border: `1px solid ${isCorrect ? 'rgba(74,222,128,0.20)' : 'rgba(255,255,255,0.06)'}`,
    background: isCorrect ? 'rgba(74,222,128,0.04)' : 'rgba(255,255,255,0.02)',
    padding: '16px',
    marginBottom: '24px',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.15em',
    color: 'rgba(255,255,255,0.40)',
  }

  const selectStyle: React.CSSProperties = {
    flex: 1,
    height: '40px',
    borderRadius: '8px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#fff',
    fontSize: '14px',
    padding: '0 12px',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'none',
    WebkitAppearance: 'none',
  }

  return (
    <div style={cardStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={labelStyle}>Tournament Champion</span>

        {isCorrect ? (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: '#4ade80',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(74,222,128,0.10)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <SoccerIcon color="#4ade80" size={10} />
            +10 pts
          </span>
        ) : champDecided ? (
          <span
            style={{
              fontSize: '10px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'rgba(255,255,255,0.40)',
              padding: '3px 8px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.05)',
            }}
          >
            Final
          </span>
        ) : null}
      </div>

      {/* Body */}
      {champDecided ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {getFlagUrl(data.champion_team_img_code) && (
              <img
                src={getFlagUrl(data.champion_team_img_code)!}
                alt={data.champion_team_name!}
                style={{ width: '22px', height: 'auto', borderRadius: '2px' }}
              />
            )}
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#fff' }}>
              {data.champion_team_name}
            </span>
          </div>

          {data.prediction && !isCorrect && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.10em', color: 'rgba(255,255,255,0.30)', flexShrink: 0 }}>
                Your pick
              </span>
              {getFlagUrl(data.prediction.team_img_code) && (
                <img
                  src={getFlagUrl(data.prediction.team_img_code)!}
                  alt={data.prediction.team_name}
                  style={{ width: '18px', height: 'auto', borderRadius: '2px', opacity: 0.6 }}
                />
              )}
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>
                {data.prediction.team_name}
              </span>
            </div>
          )}

          {!data.prediction && (
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)' }}>No pick submitted</span>
          )}
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <select
              value={selectedTeamId}
              onChange={(e) => {
                setSelectedTeamId(e.target.value === '' ? '' : Number(e.target.value))
                setSaved(false)
              }}
              style={selectStyle}
            >
              <option value="">Select a team…</option>
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSave}
              disabled={!selectedTeamId || saving}
              style={{
                flexShrink: 0,
                height: '40px',
                padding: '0 16px',
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
                cursor: !selectedTeamId || saving ? 'not-allowed' : 'pointer',
                opacity: !selectedTeamId || saving ? 0.5 : 1,
                transition: 'all 150ms',
              }}
            >
              {saving ? '…' : saved ? '✓ Saved' : 'Save'}
            </button>
          </div>

          {error && (
            <p style={{ marginTop: '6px', fontSize: '12px', color: '#ff6b6b' }}>{error}</p>
          )}
        </div>
      )}
    </div>
  )
}


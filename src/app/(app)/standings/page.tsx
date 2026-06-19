'use client'

import { useEffect, useState } from 'react'
import { getFlagUrl, getCountryCode, shortenTeamName } from '@/lib/flags'
import type { GroupStanding, TeamStat } from '@/app/api/standings/route'

// ── Bracket types ──────────────────────────────────────────────────────────────

interface BracketTeam {
  id: number
  name: string
  img_code: string | null
  comment: string | null
}

interface BracketMatch {
  id: number
  kickoff_utc: string
  home_score: number | null
  away_score: number | null
  is_final: boolean
  home_team: BracketTeam
  away_team: BracketTeam
  round: { id: number; name: string }
}

// ── Bracket layout constants ───────────────────────────────────────────────────

const SLOT_H = 72    // vertical space allocated per R32 match
const CARD_H = 52    // actual match card height
const CARD_W = 128   // match card width
const COL_GAP = 20   // gap between column right edge and next column left edge

// Column left-edge x positions
const COL_X = {
  r32: 0,
  r16: CARD_W + COL_GAP,                          // 180
  qf:  CARD_W * 2 + COL_GAP * 2,                  // 360
  sf:  CARD_W * 3 + COL_GAP * 3,                  // 540
  fin: CARD_W * 4 + COL_GAP * 4,                  // 720
}
const TOTAL_W = CARD_W * 5 + COL_GAP * 4          // 868
const TOTAL_H = 16 * SLOT_H                        // 1152

// ── Helper: card top-y for a match at bracket slot index ──────────────────────

function cardY(slotCenter: number) {
  return slotCenter - CARD_H / 2
}

function r32CenterY(i: number) { return (i + 0.5) * SLOT_H }
function r16CenterY(i: number) { return (i * 2 + 1) * SLOT_H }
function qfCenterY(i: number)  { return (i * 4 + 2) * SLOT_H }
function sfCenterY(i: number)  { return (i * 8 + 4) * SLOT_H }
const finalCenterY             = 8 * SLOT_H        // 576

// ── SVG connector between two adjacent columns ────────────────────────────────

function BracketConnector({
  svgLeft,
  parentCenters,
  childCenters,
}: {
  svgLeft: number
  parentCenters: number[]   // y-centers of "left" (earlier round) matches
  childCenters: number[]    // y-centers of "right" (later round) matches
}) {
  const stroke = 'rgba(255,255,255,0.18)'
  const lines: React.ReactNode[] = []

  childCenters.forEach((childY, j) => {
    const topY    = parentCenters[j * 2]
    const bottomY = parentCenters[j * 2 + 1]
    const midX    = COL_GAP / 2

    lines.push(
      <g key={j}>
        <line x1={0}    y1={topY}    x2={midX}  y2={topY}    stroke={stroke} strokeWidth={1} />
        <line x1={midX} y1={topY}    x2={midX}  y2={bottomY} stroke={stroke} strokeWidth={1} />
        <line x1={0}    y1={bottomY} x2={midX}  y2={bottomY} stroke={stroke} strokeWidth={1} />
        <line x1={midX} y1={childY}  x2={COL_GAP} y2={childY} stroke={stroke} strokeWidth={1} />
      </g>,
    )
  })

  return (
    <svg
      style={{ position: 'absolute', left: svgLeft, top: 0, overflow: 'visible', pointerEvents: 'none' }}
      width={COL_GAP}
      height={TOTAL_H}
    >
      {lines}
    </svg>
  )
}

// ── Bracket match card ─────────────────────────────────────────────────────────

function BracketCard({ match, style }: { match: BracketMatch; style?: React.CSSProperties }) {
  const { home_team: ht, away_team: at, home_score: hs, away_score: as_, is_final } = match
  const homeWin = is_final && hs != null && as_ != null && hs > as_
  const awayWin = is_final && hs != null && as_ != null && as_ > hs

  function teamName(t: BracketTeam) {
    return shortenTeamName(t.name)
  }

  function TeamRow({ team, score, win }: { team: BracketTeam; score: number | null; win: boolean }) {
    const flag = getFlagUrl(team.img_code)
    const isReal = Boolean(team.img_code)
    return (
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '0 7px',
          background: win ? 'rgba(74,222,128,0.08)' : 'transparent',
        }}
      >
        {flag ? (
          <img src={flag} alt="" style={{ width: 16, height: 12, borderRadius: 1, flexShrink: 0 }} />
        ) : (
          <div style={{ width: 16, height: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 1, flexShrink: 0 }} />
        )}
        <span
          style={{
            fontSize: 11,
            fontWeight: isReal ? 600 : 400,
            color: isReal ? '#fff' : 'rgba(255,255,255,0.35)',
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            minWidth: 0,
          }}
        >
          {teamName(team)}
        </span>
        {is_final && score != null && (
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: win ? '#4ade80' : 'rgba(255,255,255,0.45)',
              flexShrink: 0,
              minWidth: 14,
              textAlign: 'right',
            }}
          >
            {score}
          </span>
        )}
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'absolute',
        width: CARD_W,
        height: CARD_H,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 8,
        overflow: 'hidden',
        ...style,
      }}
    >
      <TeamRow team={ht} score={hs} win={homeWin} />
      <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />
      <TeamRow team={at} score={as_} win={awayWin} />
    </div>
  )
}

// ── Group card ─────────────────────────────────────────────────────────────────

function GroupCard({ group }: { group: GroupStanding }) {
  const [open, setOpen] = useState(false)

  const qualColor = ['#4ade80', '#4ade80', '#fbbf24', 'transparent']

  function StatCell({ value, color }: { value: number | string; color?: string }) {
    return (
      <span
        style={{
          width: 22,
          textAlign: 'center',
          fontSize: 13,
          color: color ?? 'rgba(255,255,255,0.75)',
          flexShrink: 0,
        }}
      >
        {value}
      </span>
    )
  }

  return (
    <div
      style={{
        borderRadius: 12,
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'none',
          border: 'none',
          color: '#fff',
          cursor: 'pointer',
          gap: 8,
        }}
      >
        <span style={{ fontSize: 14, fontWeight: 700 }}>{group.name}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 200ms', flexShrink: 0 }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div style={{ paddingBottom: 2 }}>
          {/* Column headers */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px 4px',
              gap: 4,
              fontSize: 10,
              color: 'rgba(255,255,255,0.28)',
              textTransform: 'uppercase',
              letterSpacing: '0.10em',
            }}
          >
            <span style={{ width: 18, flexShrink: 0 }}>#</span>
            <span style={{ flex: 1, paddingLeft: 22 }}>Team</span>
            <span style={{ width: 22, textAlign: 'center', flexShrink: 0 }}>MP</span>
            <span style={{ width: 22, textAlign: 'center', flexShrink: 0 }}>W</span>
            <span style={{ width: 22, textAlign: 'center', flexShrink: 0 }}>D</span>
            <span style={{ width: 22, textAlign: 'center', flexShrink: 0 }}>L</span>
            <span style={{ width: 22, textAlign: 'center', flexShrink: 0 }}>GF</span>
            <span style={{ width: 22, textAlign: 'center', flexShrink: 0 }}>GA</span>
            <span style={{ width: 26, textAlign: 'center', flexShrink: 0 }}>GD</span>
            <span style={{ width: 26, textAlign: 'right', flexShrink: 0 }}>Pts</span>
          </div>

          {/* Team rows */}
          {group.teams.map((team, idx) => (
            <TeamRow key={team.id} team={team} rank={idx + 1} borderColor={qualColor[idx]} isLast={idx === group.teams.length - 1} />
          ))}

        </div>
      )}
    </div>
  )
}

function TeamRow({
  team,
  rank,
  borderColor,
  isLast,
}: {
  team: TeamStat
  rank: number
  borderColor: string
  isLast?: boolean
}) {
  const flag = getFlagUrl(team.img_code)
  const gdStr = team.gd > 0 ? `+${team.gd}` : String(team.gd)
  const gdColor =
    team.gd > 0
      ? '#4ade80'
      : team.gd < 0
      ? 'rgba(255,100,100,0.85)'
      : 'rgba(255,255,255,0.45)'

  const threeLetterCode = getCountryCode(team.img_code)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '6px 12px',
        gap: 4,
        borderLeft: `2px solid ${borderColor}`,
        borderBottom: isLast ? undefined : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <span
        style={{
          width: 18,
          fontSize: 12,
          color: 'rgba(255,255,255,0.35)',
          flexShrink: 0,
          textAlign: 'center',
        }}
      >
        {rank}
      </span>

      {/* Team name + flag */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          minWidth: 0,
        }}
      >
        {flag ? (
          <img
            src={flag}
            alt=""
            style={{ width: 18, height: 14, borderRadius: 2, flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: 18, height: 14, borderRadius: 2, background: 'rgba(255,255,255,0.08)', flexShrink: 0 }} />
        )}
        {/* Full name on desktop, 3-letter FIFA code on mobile */}
        <span
          className="hidden sm:inline"
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: '#fff',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {team.name}
        </span>
        <span
          className="sm:hidden"
          style={{ fontSize: 13, fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}
        >
          {threeLetterCode ?? team.name}
        </span>
      </div>

      <span style={{ width: 22, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.75)', flexShrink: 0 }}>
        {team.mp}
      </span>
      <span style={{ width: 22, textAlign: 'center', fontSize: 13, color: team.w > 0 ? '#4ade80' : 'rgba(255,255,255,0.75)', flexShrink: 0 }}>
        {team.w}
      </span>
      <span style={{ width: 22, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.75)', flexShrink: 0 }}>
        {team.d}
      </span>
      <span style={{ width: 22, textAlign: 'center', fontSize: 13, color: team.l > 0 ? 'rgba(255,100,100,0.85)' : 'rgba(255,255,255,0.75)', flexShrink: 0 }}>
        {team.l}
      </span>
      <span style={{ width: 22, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.75)', flexShrink: 0 }}>
        {team.gf}
      </span>
      <span style={{ width: 22, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.75)', flexShrink: 0 }}>
        {team.ga}
      </span>
      <span style={{ width: 26, textAlign: 'center', fontSize: 13, color: gdColor, flexShrink: 0 }}>
        {gdStr}
      </span>
      <span style={{ width: 26, textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
        {team.pts}
      </span>
    </div>
  )
}

// ── Bracket section ────────────────────────────────────────────────────────────

function BracketSection({ matches }: { matches: BracketMatch[] }) {
  const byRound = (id: number) => matches.filter((m) => m.round.id === id).sort((a, b) => a.id - b.id)

  const r32 = byRound(8)
  const r16 = byRound(2)
  const qf  = byRound(3)
  const sf  = byRound(4)
  const fin = byRound(6)
  const trd = byRound(5)

  const r32Centers  = r32.map((_, i) => r32CenterY(i))
  const r16Centers  = r16.map((_, i) => r16CenterY(i))
  const qfCenters   = qf.map((_, i)  => qfCenterY(i))
  const sfCenters   = sf.map((_, i)  => sfCenterY(i))

  const LABEL_H = 28

  const roundLabel = (label: string, x: number) => (
    <div
      key={label}
      style={{
        position: 'absolute',
        left: x,
        top: 0,
        width: CARD_W,
        textAlign: 'center',
        fontSize: 9,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.28)',
      }}
    >
      {label}
    </div>
  )

  return (
    <div>
      <div style={{ overflowX: 'auto', paddingBottom: 16 }}>
        <div
          style={{
            position: 'relative',
            width: TOTAL_W,
            height: TOTAL_H + LABEL_H,
            minWidth: TOTAL_W,
          }}
        >
          {/* Round labels */}
          {roundLabel('Round of 32', COL_X.r32)}
          {roundLabel('Round of 16', COL_X.r16)}
          {roundLabel('Quarter-Finals', COL_X.qf)}
          {roundLabel('Semi-Finals', COL_X.sf)}
          {roundLabel('Final', COL_X.fin)}

          {/* Bracket area (offset by LABEL_H) */}
          <div style={{ position: 'absolute', top: LABEL_H, left: 0, width: TOTAL_W, height: TOTAL_H }}>

            {/* R32 cards */}
            {r32.map((m, i) => (
              <BracketCard key={m.id} match={m} style={{ left: COL_X.r32, top: cardY(r32Centers[i]) }} />
            ))}

            {/* R32 → R16 connector */}
            {r16.length > 0 && (
              <BracketConnector
                svgLeft={COL_X.r32 + CARD_W}
                parentCenters={r32Centers}
                childCenters={r16Centers}
              />
            )}

            {/* R16 cards */}
            {r16.map((m, i) => (
              <BracketCard key={m.id} match={m} style={{ left: COL_X.r16, top: cardY(r16Centers[i]) }} />
            ))}

            {/* R16 → QF connector */}
            {qf.length > 0 && (
              <BracketConnector
                svgLeft={COL_X.r16 + CARD_W}
                parentCenters={r16Centers}
                childCenters={qfCenters}
              />
            )}

            {/* QF cards */}
            {qf.map((m, i) => (
              <BracketCard key={m.id} match={m} style={{ left: COL_X.qf, top: cardY(qfCenters[i]) }} />
            ))}

            {/* QF → SF connector */}
            {sf.length > 0 && (
              <BracketConnector
                svgLeft={COL_X.qf + CARD_W}
                parentCenters={qfCenters}
                childCenters={sfCenters}
              />
            )}

            {/* SF cards */}
            {sf.map((m, i) => (
              <BracketCard key={m.id} match={m} style={{ left: COL_X.sf, top: cardY(sfCenters[i]) }} />
            ))}

            {/* SF → Final connector */}
            {fin.length > 0 && (
              <BracketConnector
                svgLeft={COL_X.sf + CARD_W}
                parentCenters={sfCenters}
                childCenters={[finalCenterY]}
              />
            )}

            {/* Final card */}
            {fin.map((m) => (
              <BracketCard key={m.id} match={m} style={{ left: COL_X.fin, top: cardY(finalCenterY) }} />
            ))}
          </div>
        </div>
      </div>

      {/* 3rd place match */}
      {trd.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <p
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.28)',
              marginBottom: 8,
            }}
          >
            Third Place
          </p>
          {trd.map((m) => (
            <div key={m.id} style={{ position: 'relative', height: CARD_H }}>
              <BracketCard match={m} style={{ left: 0, top: 0 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function StandingsPage() {
  const [tab, setTab] = useState<'groups' | 'bracket'>('groups')
  const [groups, setGroups] = useState<GroupStanding[]>([])
  const [bracketMatches, setBracketMatches] = useState<BracketMatch[]>([])
  const [loadingGroups, setLoadingGroups] = useState(true)
  const [loadingBracket, setLoadingBracket] = useState(true)

  useEffect(() => {
    fetch('/api/standings')
      .then((r) => r.json())
      .then((data) => {
        setGroups(data)
        setLoadingGroups(false)
      })
      .catch(() => setLoadingGroups(false))
  }, [])

  useEffect(() => {
    fetch('/api/bracket')
      .then((r) => r.json())
      .then((data) => {
        setBracketMatches(data)
        setLoadingBracket(false)
      })
      .catch(() => setLoadingBracket(false))
  }, [])

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: '5px 16px',
    borderRadius: 6,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 150ms',
    color: active ? '#fff' : 'rgba(255,255,255,0.40)',
    background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
  })

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
        Standings
      </h1>

      {/* Section toggle */}
      <div style={{
        display: 'inline-flex',
        background: 'rgba(255,255,255,0.06)',
        borderRadius: 8,
        padding: 2,
        marginBottom: 20,
      }}>
        <button style={tabStyle(tab === 'groups')} onClick={() => setTab('groups')}>
          Groups
        </button>
        <button style={tabStyle(tab === 'bracket')} onClick={() => setTab('bracket')}>
          Bracket
        </button>
      </div>

      {/* Groups tab */}
      {tab === 'groups' && (
        <>
          {loadingGroups ? (
            <div style={{ textAlign: 'center', paddingTop: '60px', color: 'rgba(255,255,255,0.30)' }}>
              Loading…
            </div>
          ) : groups.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.30)', textAlign: 'center', paddingTop: '40px' }}>
              No group data available.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {groups.map((g) => (
                <GroupCard key={g.id} group={g} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Bracket tab */}
      {tab === 'bracket' && (
        <>
          {loadingBracket ? (
            <div style={{ textAlign: 'center', paddingTop: '60px', color: 'rgba(255,255,255,0.30)' }}>
              Loading…
            </div>
          ) : bracketMatches.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.30)', textAlign: 'center', paddingTop: '40px' }}>
              No knockout matches available yet.
            </p>
          ) : (
            <BracketSection matches={bracketMatches} />
          )}
        </>
      )}
    </div>
  )
}

'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'

const PROGRESS_PER_TAP = 4
const SETBACK_AT = 80
const SETBACK_TO = 42
const RING_R = 36
const RING_C = 2 * Math.PI * RING_R


function ringColor(progress: number, draining: boolean): string {
  if (draining) return 'rgba(239,68,68,0.90)'
  if (progress > 60) return 'rgba(74,222,128,0.90)'
  if (progress > 30) return 'rgba(251,191,36,0.90)'
  return 'rgba(249,115,22,0.80)'
}

export function NukeBanner() {
  const [isNuked, setIsNuked] = useState(false)
  const [progress, setProgress] = useState(0)
  const [draining, setDraining] = useState(false)
  const [btnTransform, setBtnTransform] = useState('scale(1) rotate(0deg)')
  const [shaking, setShaking] = useState(false)
  const [glitching, setGlitching] = useState(false)
  const [screenFlash, setScreenFlash] = useState(false)
  const [rippleKey, setRippleKey] = useState(0)
  const [phase, setPhase] = useState<'mash' | 'riddle'>('mash')
  const [riddle, setRiddle] = useState<string | null>(null)
  const [riddleInput, setRiddleInput] = useState('')
  const [riddleError, setRiddleError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const pathname = usePathname()
  const router = useRouter()
  const progressRef = useRef(0)
  const setbackDoneRef = useRef(false)
  const drainingRef = useRef(false)
  const doneRef = useRef(false)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        setIsNuked(data.isNuked ?? false)
        setRiddle(data.riddle ?? null)
      })
  }, [])

  // Random ambient glitch every 4–9 seconds
  useEffect(() => {
    if (!isNuked) return
    const id = setInterval(() => {
      setGlitching(true)
      setTimeout(() => setGlitching(false), 900)
    }, 4000 + Math.random() * 5000)
    return () => clearInterval(id)
  }, [isNuked])

  const handleTap = useCallback(async () => {
    if (drainingRef.current || doneRef.current) return

    const rot = (Math.random() - 0.5) * 18
    const scale = 0.88 + Math.random() * 0.06
    setBtnTransform(`scale(${scale}) rotate(${rot}deg)`)
    setTimeout(() => setBtnTransform('scale(1) rotate(0deg)'), 140)

    setRippleKey((k) => k + 1)

    const cur = progressRef.current
    const next = Math.min(cur + PROGRESS_PER_TAP, 100)

    if (next >= SETBACK_AT && !setbackDoneRef.current) {
      setbackDoneRef.current = true
      drainingRef.current = true
      progressRef.current = next
      setProgress(next)
      setDraining(true)
      // Triple hit: shake + glitch + screen flash
      setShaking(true)
      setGlitching(true)
      setScreenFlash(true)
      setTimeout(() => setShaking(false), 600)
      setTimeout(() => setGlitching(false), 900)
      setTimeout(() => setScreenFlash(false), 700)

      setTimeout(() => {
        progressRef.current = SETBACK_TO
        setProgress(SETBACK_TO)
        setTimeout(() => {
          drainingRef.current = false
          setDraining(false)
        }, 750)
      }, 750)
      return
    }

    progressRef.current = next
    setProgress(next)

    if (next >= 100) {
      doneRef.current = true
      setPhase('riddle')
    }
  }, [])

  function fireWrongAnswer() {
    setRiddleError('Respuesta incorrecta.')
    setRiddleInput('')
    setShaking(true)
    setGlitching(true)
    setScreenFlash(true)
    setTimeout(() => setShaking(false), 600)
    setTimeout(() => setGlitching(false), 900)
    setTimeout(() => setScreenFlash(false), 700)
  }

  if (!isNuked) return null

  const color = ringColor(progress, draining)
  const dashOffset = RING_C - (progress / 100) * RING_C

  return (
    <>
      <style>{`
        @keyframes vignette-pulse {
          0%, 100% { box-shadow: inset 0 0 120px rgba(239,68,68,0.22); }
          50%       { box-shadow: inset 0 0 180px rgba(239,68,68,0.38); }
        }
        @keyframes screen-flash {
          0%   { opacity: 0; }
          8%   { opacity: 0.55; }
          20%  { opacity: 0.05; }
          32%  { opacity: 0.40; }
          48%  { opacity: 0; }
          65%  { opacity: 0.15; }
          80%  { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes card-glitch {
          0%   { transform: none; filter: none; }
          8%   { transform: skewX(-10deg) translateX(8px) scaleY(1.02); filter: hue-rotate(90deg) saturate(4) brightness(1.8); }
          16%  { transform: skewX(7deg) translateX(-10px); filter: hue-rotate(220deg) saturate(3) brightness(0.6); }
          24%  { transform: none; filter: brightness(4); }
          32%  { transform: skewX(-12deg) translateX(6px); filter: hue-rotate(310deg) saturate(5) brightness(1.5); }
          40%  { transform: skewX(5deg) translateX(-7px) scaleY(0.98); filter: brightness(0.3) saturate(0); }
          48%  { transform: none; filter: none; }
          60%  { transform: skewX(-4deg) translateX(3px); filter: hue-rotate(90deg) brightness(1.3); }
          70%  { transform: none; filter: none; }
          100% { transform: none; filter: none; }
        }
        @keyframes container-shake {
          0%,100% { transform: translate(0,0) rotate(0deg); }
          10%     { transform: translate(-10px,-2px) rotate(-0.5deg); }
          20%     { transform: translate(10px,2px) rotate(0.5deg); }
          30%     { transform: translate(-8px,1px) rotate(-0.3deg); }
          40%     { transform: translate(8px,-1px) rotate(0.3deg); }
          50%     { transform: translate(-5px,0px); }
          60%     { transform: translate(5px,1px); }
          70%     { transform: translate(-3px,0px); }
          80%     { transform: translate(3px,-1px); }
          90%     { transform: translate(-1px,0px); }
        }
@keyframes btn-breathe {
          0%, 100% { transform: scale(1); }
          50%       { transform: scale(1.04); }
        }
        @keyframes tap-ripple {
          0%   { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(2.4); opacity: 0; }
        }
      `}</style>

      {/* Full-viewport red vignette */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 60,
          animation: 'vignette-pulse 3s ease-in-out infinite',
        }}
      />

      {/* Screen flash — only on setback */}
      {screenFlash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 80,
            background: '#ef4444',
            animation: 'screen-flash 700ms ease-out forwards',
          }}
        />
      )}

      {/* Panic button — only on the leaderboard/ranking tab */}
      {pathname === '/leaderboard' && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 70,
            pointerEvents: 'none',
          }}
        >
          {/* Shake wrapper */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              pointerEvents: 'auto',
              animation: shaking ? 'container-shake 0.6s ease-out forwards' : 'none',
            }}
          >
            {/* Glitch + breathe container */}
            {phase === 'mash' && <div
              style={{
                position: 'relative',
                width: '96px',
                height: '96px',
                animation: glitching
                  ? 'card-glitch 900ms ease-out forwards'
                  : draining
                  ? 'none'
                  : 'btn-breathe 2.2s ease-in-out infinite',
              }}
            >
              <svg
                width="96"
                height="96"
                style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)' }}
              >
                <circle cx="48" cy="48" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
                <circle
                  cx="48"
                  cy="48"
                  r={RING_R}
                  fill="none"
                  stroke={color}
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={dashOffset}
                  style={{
                    transition: draining
                      ? 'stroke-dashoffset 0.75s ease-in-out, stroke 0.25s'
                      : 'stroke-dashoffset 0.07s linear',
                  }}
                />
              </svg>

              {/* Tap ripple */}
              <div
                key={rippleKey}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  border: `1px solid ${color}`,
                  pointerEvents: 'none',
                  animation: rippleKey > 0 ? 'tap-ripple 0.5s ease-out forwards' : 'none',
                }}
              />

              <button
                onPointerDown={handleTap}
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  border: `1px solid ${draining ? 'rgba(239,68,68,0.30)' : 'rgba(255,255,255,0.10)'}`,
                  background: draining ? 'rgba(239,68,68,0.08)' : 'rgba(255,255,255,0.04)',
                  cursor: draining ? 'not-allowed' : 'pointer',
                  userSelect: 'none',
                  WebkitUserSelect: 'none',
                  transform: btnTransform,
                  transition: 'transform 140ms ease, background 200ms, border-color 200ms',
                }}
              />
            </div>}

            {phase === 'riddle' ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  width: '220px',
                }}
              >
                {riddle && (
                  <p style={{
                    margin: 0,
                    fontSize: '11px',
                    color: 'rgba(255,255,255,0.70)',
                    textAlign: 'center',
                    lineHeight: 1.5,
                    textShadow: '0 0 12px rgba(0,0,0,1)',
                    fontStyle: 'italic',
                  }}>
                    {riddle}
                  </p>
                )}
                <input
                  type="text"
                  value={riddleInput}
                  onChange={(e) => { setRiddleInput(e.target.value); setRiddleError('') }}
                  placeholder="Tu respuesta..."
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${riddleError ? 'rgba(239,68,68,0.50)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                    outline: 'none',
                    textAlign: 'center',
                    boxSizing: 'border-box',
                  }}
                  onKeyDown={async (e) => {
                    if (e.key !== 'Enter' || submitting) return
                    setSubmitting(true)
                    const res = await fetch('/api/nuke/resist', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ answer: riddleInput }),
                    })
                    setSubmitting(false)
                    if (res.ok) {
                      setIsNuked(false)
      window.dispatchEvent(new Event('nuke-resist'))
                    } else {
                      fireWrongAnswer()
                    }
                  }}
                />
                {riddleError && (
                  <span style={{ fontSize: '10px', color: 'rgba(239,68,68,0.80)', textShadow: '0 0 8px rgba(0,0,0,1)' }}>
                    {riddleError}
                  </span>
                )}
                <button
                  disabled={!riddleInput.trim() || submitting}
                  onClick={async () => {
                    if (submitting) return
                    setSubmitting(true)
                    const res = await fetch('/api/nuke/resist', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ answer: riddleInput }),
                    })
                    setSubmitting(false)
                    if (res.ok) {
                      setIsNuked(false)
      window.dispatchEvent(new Event('nuke-resist'))
                    } else {
                      fireWrongAnswer()
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.12)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.60)',
                    fontSize: '10px',
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    cursor: !riddleInput.trim() || submitting ? 'not-allowed' : 'pointer',
                    opacity: !riddleInput.trim() || submitting ? 0.4 : 1,
                  }}
                >
                  {submitting ? '…' : 'Confirmar'}
                </button>
              </div>
            ) : progress === 0 && (
              <span style={{
                fontSize: '8px',
                color: 'rgba(255,255,255,0.20)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textShadow: '0 0 8px rgba(0,0,0,1)',
              }}>
                Press
              </span>
            )}
          </div>
        </div>
      )}
    </>
  )
}

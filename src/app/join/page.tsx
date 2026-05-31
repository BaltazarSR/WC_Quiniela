'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function JoinPage() {
  const router = useRouter()
  const [joinCode, setJoinCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, joinCode }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Registration failed.')
      return
    }

    router.push('/matches')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '48px',
    padding: '0 16px',
    borderRadius: '12px',
    background: 'rgba(255,255,255,0.04)',
    border: '2px solid rgba(255,255,255,0.10)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 150ms',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(to right, #041B70, #498B36 50%, #9C0D15)',
        }}
      />

      <div style={{ width: '100%', maxWidth: '320px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              letterSpacing: '0.20em',
              textTransform: 'uppercase',
              color: '#fff',
              margin: 0,
            }}
          >
            Join Pool
          </h1>
          <p
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.40)',
              marginTop: '6px',
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
            }}
          >
            FIFA World Cup 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: '6px',
              }}
            >
              Pool Code
            </label>
            <input
              type="text"
              placeholder="e.g. MUNDIAL2026"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
              style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', letterSpacing: '0.10em' }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: '6px',
              }}
            >
              Username
            </label>
            <input
              type="text"
              placeholder="Letters, numbers, _"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'rgba(255,255,255,0.40)',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
            />
          </div>

          {error && (
            <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0, textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '4px',
              width: '100%',
              height: '48px',
              borderRadius: '12px',
              border: 'none',
              background: loading
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(to right, #042C8F, #498B36)',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 150ms',
            }}
          >
            {loading ? 'Creating account…' : 'Join now'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.40)',
          }}
        >
          Already have an account?{' '}
          <Link
            href="/login"
            style={{ color: 'rgba(255,255,255,0.70)', textDecoration: 'underline' }}
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

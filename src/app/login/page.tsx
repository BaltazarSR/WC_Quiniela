'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Login failed.')
      return
    }

    router.push('/matches')
    router.refresh()
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
      {/* Accent bar */}
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
            Quiniela
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
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            style={{
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
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
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
            }}
            onFocus={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.25)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.10)')}
          />

          {error && (
            <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0, textAlign: 'center' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
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
            {loading ? 'Signing in…' : 'Sign in'}
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
          No account?{' '}
          <Link
            href="/join"
            style={{ color: 'rgba(255,255,255,0.70)', textDecoration: 'underline' }}
          >
            Join the pool
          </Link>
        </p>
      </div>
    </div>
  )
}

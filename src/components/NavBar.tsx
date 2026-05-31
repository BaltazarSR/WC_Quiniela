'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const NAV_ITEMS = [
  { href: '/matches', label: 'Matches' },
  { href: '/leaderboard', label: 'Ranking' },
  { href: '/history', label: 'History' },
]

export function NavBar({
  username,
  isAdmin,
}: {
  username: string
  isAdmin: boolean
}) {
  const pathname = usePathname()
  const router = useRouter()

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
    router.refresh()
  }

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Accent stripe */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(to right, #041B70, #498B36 50%, #9C0D15)',
        }}
      />

      <div
        style={{
          maxWidth: '768px',
          margin: '0 auto',
          padding: '0 16px',
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        {/* Logo */}
        <Link
          href="/matches"
          style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.20em',
            textTransform: 'uppercase',
            color: '#fff',
            textDecoration: 'none',
            flexShrink: 0,
          }}
        >
          Quiniela
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', gap: '4px', overflowX: 'auto' }} className="scrollbar-hide">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  color: active ? '#fff' : 'rgba(255,255,255,0.50)',
                  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                  transition: 'all 150ms',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.label}
              </Link>
            )
          })}
          {isAdmin && (
            <Link
              href="/admin"
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textDecoration: 'none',
                color: pathname === '/admin' ? '#fff' : 'rgba(255,255,255,0.50)',
                background: pathname === '/admin' ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition: 'all 150ms',
                whiteSpace: 'nowrap',
              }}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* User + logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.40)',
              fontFamily: 'ui-monospace, monospace',
            }}
          >
            {username}
          </span>
          <button
            onClick={logout}
            style={{
              padding: '5px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.10)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.40)',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.10em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 150ms',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.70)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.40)'
            }}
          >
            Out
          </button>
        </div>
      </div>
    </header>
  )
}

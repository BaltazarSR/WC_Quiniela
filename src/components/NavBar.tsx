'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

function SoccerBallIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.8105 13.7979H10.1855L9.20654 10.8609L11.9985 8.99988L14.7895 10.8609L13.8105 13.7979Z" />
      <path d="M11.998 2C6.4752 2 1.99805 6.47715 1.99805 12C1.99805 17.5228 6.4752 22 11.998 22C17.5209 22 21.998 17.5228 21.998 12C21.998 6.47715 17.5209 2 11.998 2ZM8.91017 4.6177C8.93351 4.64459 8.95916 4.66979 8.98702 4.69298L11.57 6.84598C11.694 6.94798 11.846 6.99998 11.998 6.99998C12.15 6.99998 12.302 6.94798 12.426 6.84598L15.009 4.69298C15.0369 4.66979 15.0625 4.64458 15.0859 4.61768C16.1615 5.06811 17.1178 5.74674 17.8943 6.59304L16.4294 9.52287C16.2584 9.86387 16.3614 10.2779 16.6714 10.4999L19.7394 12.6909C19.8073 12.739 19.8813 12.7756 19.9586 12.8C19.8437 13.9569 19.4823 15.0414 18.9277 16.0001H15.2939C14.9699 16.0001 14.6869 16.2211 14.6079 16.5361L13.7914 19.7982C13.2149 19.9302 12.6146 20 11.998 20C11.3811 20 10.7805 19.9302 10.2036 19.798L9.38817 16.5361C9.30917 16.2211 9.02617 16.0001 8.70217 16.0001H5.06838C4.5138 15.0415 4.15245 13.9571 4.03756 12.8001C4.11454 12.7759 4.18835 12.7394 4.25605 12.6909L7.32405 10.4999C7.63505 10.2779 7.73805 9.86389 7.56705 9.52289L6.10232 6.59249C6.87871 5.74646 7.83483 5.06803 8.91017 4.6177Z" />
    </svg>
  )
}

function TrophyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 2h12v2h5v1c0 .04 0 .08 0 .12.0004 1.89.0008 3.82-.764 5.51C21.454 12.37 19.952 13.71 17.332 14.75 16.481 16.4 14.891 17.6 13 17.92V20h2v2H9v-2h2v-2.08C9.109 17.6 7.519 16.4 6.668 14.75 4.048 13.71 2.546 12.37 1.764 10.63 1 8.94 1 7.01 1 5.12V5h5V2zm0 4H3.004c.018 1.55.114 2.77.582 3.81C3.975 10.67 4.664 11.49 6.005 12.24 6.002 12.16 6 12.08 6 12V6zm2-2v8c0 .56.114 1.09.32 1.57C8.931 15 10.35 16 12 16s3.069-1 3.68-2.43c.206-.48.32-1.01.32-1.57V4H8zm10 2v6c0 .08-.002.16-.005.24C19.336 11.49 20.025 10.67 20.414 9.81 20.886 8.77 20.978 7.55 20.996 6H18z" />
    </svg>
  )
}

function PicksIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.293 5.29297L16.7072 6.70718L6.00008 17.4143L1.29297 12.7072L2.70718 11.293L6.00008 14.5859L15.293 5.29297ZM22.7072 6.70718L11.0001 18.4143L8.79297 16.2072L10.2072 14.793L11.0001 15.5859L21.293 5.29297L22.7072 6.70718Z" />
    </svg>
  )
}

function StandingsIcon() {
  return (
    <div style={{ height: 20, display: 'flex', alignItems: 'center' }}>
      <svg width="20" height="12" viewBox="0 0 20 12" fill="currentColor">
        <path fillRule="evenodd" clipRule="evenodd" d="M7 0V12H13V0H7ZM9 10V2H11V10H9Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M0 5V12H6V5H0ZM2 10V7H4V10H2Z" />
        <path fillRule="evenodd" clipRule="evenodd" d="M14 7V12H20V7H14ZM16 10V9H18V10H16Z" />
      </svg>
    </div>
  )
}

function WrenchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: '/matches', label: 'Matches', Icon: SoccerBallIcon },
  { href: '/standings', label: 'Standings', Icon: StandingsIcon },
  { href: '/leaderboard', label: 'Ranking', Icon: TrophyIcon },
  { href: '/history', label: 'Picks', Icon: PicksIcon },
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

  const bottomItems = [
    ...NAV_ITEMS,
    ...(isAdmin ? [{ href: '/admin', label: 'Admin', Icon: WrenchIcon }] : []),
  ]

  return (
    <>
      {/* ── Top header ── */}
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
            Thinkers Cup
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav
            className="hidden md:flex"
            style={{ gap: '4px' }}
          >
            {NAV_ITEMS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
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
                  {label}
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
              className="hidden md:inline"
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

      {/* ── Mobile bottom tab bar ── */}
      <nav
        className="md:hidden"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: 'rgba(0,0,0,0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <div style={{ display: 'flex', maxWidth: '768px', margin: '0 auto' }}>
          {bottomItems.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  paddingTop: '10px',
                  paddingBottom: '10px',
                  textDecoration: 'none',
                  color: active ? '#fff' : 'rgba(255,255,255,0.35)',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.10em',
                  textTransform: 'uppercase',
                  minHeight: '56px',
                  transition: 'color 150ms',
                  borderTop: active
                    ? '2px solid #498B36'
                    : '2px solid transparent',
                }}
              >
                <Icon />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}

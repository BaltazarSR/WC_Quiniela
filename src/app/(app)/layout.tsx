import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { sessionOptions, SessionData } from '@/lib/session-options'
import { NavBar } from '@/components/NavBar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)

  if (!session.userId) {
    redirect('/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <NavBar username={session.username} isAdmin={session.isAdmin} />
      <main
        style={{
          maxWidth: '768px',
          margin: '0 auto',
          padding: '24px 16px',
        }}
      >
        {children}
      </main>
    </div>
  )
}

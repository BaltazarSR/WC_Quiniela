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
        className="pb-20 sm:pb-6"
        style={{
          maxWidth: '768px',
          margin: '0 auto',
          paddingTop: '24px',
          paddingLeft: '16px',
          paddingRight: '16px',
        }}
      >
        {children}
      </main>
    </div>
  )
}

import { NextRequest, NextResponse } from 'next/server'
import { unsealData } from 'iron-session'
import type { SessionData } from '@/lib/session-options'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/join') ||
    pathname.startsWith('/villain') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const cookie = request.cookies.get('quiniela_session')?.value

  if (!cookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  try {
    const data = await unsealData<SessionData>(cookie, {
      password: process.env.SESSION_SECRET!,
      ttl: 60 * 60 * 24 * 365,
    })
    if (!data.userId) throw new Error()
    return NextResponse.next()
  } catch {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico)(?!.*\\.\\w+$).*)'],
}

import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from './session-options'

type RouteContext = { params?: Promise<Record<string, string>> }

type AuthedHandler = (
  req: NextRequest,
  context: { session: SessionData; params?: Record<string, string> }
) => Promise<NextResponse | Response>

export function withAuth(handler: AuthedHandler) {
  return async (req: NextRequest, ctx?: RouteContext) => {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const params = ctx?.params ? await ctx.params : undefined
    return handler(req, { session, params })
  }
}

export function withAdmin(handler: AuthedHandler) {
  return async (req: NextRequest, ctx?: RouteContext) => {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
    if (!session.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    if (!session.isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    const params = ctx?.params ? await ctx.params : undefined
    return handler(req, { session, params })
  }
}

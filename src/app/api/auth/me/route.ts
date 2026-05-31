import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'

export const GET = withAuth(async (_req, { session }) => {
  return NextResponse.json({
    userId: session.userId,
    username: session.username,
    isAdmin: session.isAdmin,
  })
})

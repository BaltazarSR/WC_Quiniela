import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const GET = withAuth(async (_req, { session }) => {
  const { data: user } = await supabase
    .from('users')
    .select('is_nuked')
    .eq('id', session.userId)
    .single()

  return NextResponse.json({
    userId: session.userId,
    username: session.username,
    isAdmin: session.isAdmin,
    isNuked: user?.is_nuked ?? false,
  })
})

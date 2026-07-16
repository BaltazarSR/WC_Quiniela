import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const POST = withAuth(async (_req, { session }) => {
  await supabase
    .from('users')
    .update({ is_nuked: false })
    .eq('id', session.userId)

  return NextResponse.json({ ok: true })
})

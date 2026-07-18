import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const POST = withAuth(async (req: NextRequest, { session }) => {
  const { answer } = await req.json().catch(() => ({}))

  const { data: user } = await supabase
    .from('users')
    .select('riddle_answer')
    .eq('id', session.userId)
    .single()

  const storedAnswer = user?.riddle_answer
  if (storedAnswer) {
    const match = answer?.trim().toLowerCase() === storedAnswer.trim().toLowerCase()
    if (!match) {
      return NextResponse.json({ error: 'Wrong answer.' }, { status: 400 })
    }
  }

  await supabase
    .from('users')
    .update({ is_nuked: false, riddle: null, riddle_answer: null })
    .eq('id', session.userId)

  return NextResponse.json({ ok: true })
})

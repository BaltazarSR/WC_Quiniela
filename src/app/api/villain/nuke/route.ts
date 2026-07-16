import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function checkToken(req: NextRequest): boolean {
  const auth = req.headers.get('authorization') ?? ''
  const token = auth.replace('Bearer ', '')
  return !!process.env.VILLAIN_TOKEN && token === process.env.VILLAIN_TOKEN
}

export async function POST(req: NextRequest) {
  if (!checkToken(req)) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 401 })
  }

  const { userId } = await req.json()
  if (!userId || typeof userId !== 'string') {
    return NextResponse.json({ error: 'userId required.' }, { status: 400 })
  }

  const { data: user } = await supabase
    .from('users')
    .select('is_nuked')
    .eq('id', userId)
    .single()

  if (user?.is_nuked) {
    await supabase.from('users').update({ is_nuked: false }).eq('id', userId)
  } else {
    await supabase.from('users').update({ is_nuked: false }).eq('is_nuked', true)
    await supabase.from('users').update({ is_nuked: true }).eq('id', userId)
  }

  return NextResponse.json({ ok: true })
}

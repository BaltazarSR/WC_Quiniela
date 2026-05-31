import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const POST = withAdmin(async (req: NextRequest, { params }) => {
  const id = params?.id ? parseInt(params.id, 10) : null
  if (!id || isNaN(id)) return NextResponse.json({ error: 'Missing match id.' }, { status: 400 })

  const { isUnlocked } = await req.json()
  if (typeof isUnlocked !== 'boolean') {
    return NextResponse.json({ error: 'isUnlocked must be a boolean.' }, { status: 400 })
  }

  const { error } = await supabase.from('matches').update({ is_unlocked: isUnlocked }).eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Failed to update match.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
})

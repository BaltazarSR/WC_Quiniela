import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

const VALID_ROUND_IDS = [1, 8, 2, 3, 4, 5, 6]

export const POST = withAdmin(async (req: NextRequest) => {
  const { defaultRoundId } = await req.json()

  if (!VALID_ROUND_IDS.includes(defaultRoundId)) {
    return NextResponse.json({ error: 'Invalid round id.' }, { status: 400 })
  }

  const { error } = await supabase
    .from('tournament_settings')
    .upsert({ id: 1, default_round_id: defaultRoundId })

  if (error) {
    return NextResponse.json({ error: 'Failed to update default round.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
})

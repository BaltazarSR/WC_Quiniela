import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/with-auth'
import { supabase } from '@/lib/supabase'

export const GET = withAuth(async () => {
  const { data: teams, error } = await supabase
    .from('teams')
    .select('id, name, img_code')
    .not('img_code', 'is', null)
    .order('name')

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch teams.' }, { status: 500 })
  }

  return NextResponse.json(teams ?? [], {
    headers: { 'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400' },
  })
})

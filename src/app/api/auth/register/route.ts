import { NextRequest, NextResponse } from 'next/server'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import { supabase } from '@/lib/supabase'
import { sessionOptions, SessionData } from '@/lib/session-options'
import { checkRateLimit } from '@/lib/rate-limit'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 })
  }

  const { username, password, joinCode } = await request.json()

  if (!username || !password || !joinCode) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  if (username.length < 3 || username.length > 20) {
    return NextResponse.json({ error: 'Username must be 3–20 characters.' }, { status: 400 })
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores.' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
  }

  if (joinCode !== process.env.POOL_JOIN_CODE) {
    return NextResponse.json({ error: 'Invalid pool join code.' }, { status: 400 })
  }

  const { data: pool } = await supabase
    .from('pools')
    .select('id')
    .eq('join_code', joinCode)
    .single()

  if (!pool) {
    return NextResponse.json({ error: 'Pool not found.' }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single()

  if (existing) {
    return NextResponse.json({ error: 'Username already taken.' }, { status: 409 })
  }

  const passwordHash = await bcrypt.hash(password, 12)

  const { data: user, error } = await supabase
    .from('users')
    .insert({ username, password_hash: passwordHash, pool_id: pool.id, is_admin: false })
    .select('id, username, is_admin')
    .single()

  if (error || !user) {
    return NextResponse.json({ error: 'Registration failed.' }, { status: 500 })
  }

  const session = await getIronSession<SessionData>(await cookies(), sessionOptions)
  session.userId = user.id
  session.username = user.username
  session.isAdmin = user.is_admin
  await session.save()

  return NextResponse.json({ username: user.username })
}

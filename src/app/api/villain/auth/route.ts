import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { code } = await req.json()
  if (!process.env.VILLAIN_TOKEN || code !== process.env.VILLAIN_TOKEN) {
    return NextResponse.json({ error: 'Access denied.' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const members = await prisma.councilMember.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(members)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN')
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })

  const data = await req.json()
  const member = await prisma.councilMember.create({ data })
  return NextResponse.json(member, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  return (session?.user as { role?: string })?.role === 'ADMIN'
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const member = await prisma.councilMember.findUnique({ where: { id } })
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(member)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  const { id } = await params
  const data = await req.json()
  const member = await prisma.councilMember.update({ where: { id }, data })
  return NextResponse.json(member)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  const { id } = await params
  await prisma.councilMember.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

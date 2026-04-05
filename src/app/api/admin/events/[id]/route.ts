import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  return (session?.user as { role?: string })?.role === 'ADMIN'
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const { slug, titleRu, titleEn, descriptionRu, descriptionEn, date, location, isOnline, maxSeats, published } = await req.json()

  const event = await prisma.event.update({
    where: { id },
    data: {
      slug, titleRu, titleEn: titleEn || null,
      descriptionRu: descriptionRu || null, descriptionEn: descriptionEn || null,
      date: new Date(date), location: location || null,
      isOnline: !!isOnline, maxSeats: maxSeats || null, published: !!published,
    },
  })
  return NextResponse.json(event)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  await prisma.event.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

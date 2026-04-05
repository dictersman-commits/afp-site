import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  return (session?.user as { role?: string })?.role === 'ADMIN'
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { slug, titleRu, titleEn, descriptionRu, descriptionEn, date, location, isOnline, maxSeats, published } = await req.json()
  if (!slug || !titleRu || !date) return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })

  const existing = await prisma.event.findUnique({ where: { slug } })
  if (existing) return NextResponse.json({ error: 'Slug уже занят' }, { status: 409 })

  const event = await prisma.event.create({
    data: {
      slug, titleRu, titleEn: titleEn || null,
      descriptionRu: descriptionRu || null, descriptionEn: descriptionEn || null,
      date: new Date(date), location: location || null,
      isOnline: !!isOnline, maxSeats: maxSeats || null, published: !!published,
    },
  })
  return NextResponse.json(event, { status: 201 })
}

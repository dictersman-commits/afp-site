import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') return null
  return session
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { slug, titleRu, titleEn, contentRu, contentEn, published } = await req.json()
  if (!slug || !titleRu || !contentRu) return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })

  const existing = await prisma.news.findUnique({ where: { slug } })
  if (existing) return NextResponse.json({ error: 'Slug уже занят' }, { status: 409 })

  const news = await prisma.news.create({
    data: { slug, titleRu, titleEn: titleEn || null, contentRu, contentEn: contentEn || null, published: !!published },
  })
  return NextResponse.json(news, { status: 201 })
}

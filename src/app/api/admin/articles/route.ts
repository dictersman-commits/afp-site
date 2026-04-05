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

  const { slug, titleRu, titleEn, contentRu, contentEn, country, authorName, tags, published } = await req.json()
  if (!slug || !titleRu || !contentRu) return NextResponse.json({ error: 'Заполните обязательные поля' }, { status: 400 })

  const existing = await prisma.article.findUnique({ where: { slug } })
  if (existing) return NextResponse.json({ error: 'Статья с таким slug уже существует' }, { status: 409 })

  const article = await prisma.article.create({
    data: {
      slug, titleRu, titleEn: titleEn || null,
      contentRu, contentEn: contentEn || null,
      country: country ?? 'RU',
      authorName: authorName || null,
      tags: JSON.stringify(tags ?? []),
      published: published ?? false,
    },
  })
  return NextResponse.json(article, { status: 201 })
}

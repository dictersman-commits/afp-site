import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country')
  const tag = searchParams.get('tag')

  const articles = await prisma.article.findMany({
    where: {
      published: true,
      ...(country ? { country: country as never } : {}),
      ...(tag ? { tags: { has: tag } } : {}),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true,
      titleRu: true, titleEn: true,
      country: true, tags: true,
      authorName: true, createdAt: true,
    },
  })
  return NextResponse.json(articles)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }

  const data = await req.json()
  const article = await prisma.article.create({
    data: {
      slug: data.slug,
      titleRu: data.titleRu,
      titleEn: data.titleEn,
      contentRu: data.contentRu,
      contentEn: data.contentEn,
      country: data.country ?? 'RU',
      tags: JSON.stringify(data.tags ?? []),
      authorName: data.authorName,
      published: data.published ?? false,
    },
  })
  return NextResponse.json(article, { status: 201 })
}

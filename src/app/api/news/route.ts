import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const news = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true, slug: true,
      titleRu: true, titleEn: true,
      contentRu: true, contentEn: true,
      coverImage: true, createdAt: true,
    },
  })
  return NextResponse.json(news)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }

  const data = await req.json()
  const news = await prisma.news.create({
    data: {
      slug: data.slug,
      titleRu: data.titleRu,
      titleEn: data.titleEn,
      contentRu: data.contentRu,
      contentEn: data.contentEn,
      coverImage: data.coverImage,
      published: data.published ?? false,
    },
  })
  return NextResponse.json(news, { status: 201 })
}

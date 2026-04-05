import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }

  const { id } = await params
  const data = await req.json()

  const news = await prisma.news.update({
    where: { id },
    data: {
      titleRu: data.titleRu,
      titleEn: data.titleEn,
      contentRu: data.contentRu,
      contentEn: data.contentEn,
      coverImage: data.coverImage,
      published: data.published,
    },
  })
  return NextResponse.json(news)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }

  const { id } = await params
  await prisma.news.delete({ where: { id } })
  return NextResponse.json({ success: true })
}

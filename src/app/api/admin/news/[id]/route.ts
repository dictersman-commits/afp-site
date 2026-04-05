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
  const { slug, titleRu, titleEn, contentRu, contentEn, published } = await req.json()

  const news = await prisma.news.update({
    where: { id },
    data: { slug, titleRu, titleEn: titleEn || null, contentRu, contentEn: contentEn || null, published: !!published },
  })
  return NextResponse.json(news)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  await prisma.news.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

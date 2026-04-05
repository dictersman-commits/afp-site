import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

async function requireAdmin() {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') return null
  return session
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const { slug, titleRu, titleEn, contentRu, contentEn, country, authorName, tags, published } = await req.json()

  const article = await prisma.article.update({
    where: { id },
    data: {
      slug, titleRu, titleEn: titleEn || null,
      contentRu, contentEn: contentEn || null,
      country, authorName: authorName || null,
      tags: JSON.stringify(tags ?? []),
      published,
    },
  })
  return NextResponse.json(article)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { id } = await params
  await prisma.article.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}

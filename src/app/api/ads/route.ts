import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const ads = await prisma.ad.findMany({
    where: {
      isActive: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(ads)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 })
  }

  const data = await req.json()
  const ad = await prisma.ad.create({
    data: {
      title: data.title,
      description: data.description,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      linkUrl: data.linkUrl,
      isPaid: data.isPaid ?? true,
      isActive: data.isActive ?? true,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    },
  })
  return NextResponse.json(ad, { status: 201 })
}

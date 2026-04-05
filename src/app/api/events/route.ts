import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: 'asc' },
    select: {
      id: true, slug: true,
      titleRu: true, titleEn: true,
      descriptionRu: true, descriptionEn: true,
      date: true, location: true,
      isOnline: true, externalUrl: true, maxSeats: true,
      _count: { select: { registrations: true } },
    },
  })

  return NextResponse.json(events)
}

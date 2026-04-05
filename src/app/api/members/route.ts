import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const country = searchParams.get('country')
  const search = searchParams.get('search')

  const members = await prisma.member.findMany({
    where: {
      isPublic: true,
      ...(country ? { country } : {}),
      ...(search
        ? {
            OR: [
              { firstName: { contains: search } },
              { lastName: { contains: search } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      photo: true,
      specialization: true,
      country: true,
      city: true,
      bio: true,
      website: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // specialization хранится как JSON-строка
  const parsed = members.map(m => ({
    ...m,
    specialization: JSON.parse(m.specialization as string),
  }))

  return NextResponse.json(parsed)
}

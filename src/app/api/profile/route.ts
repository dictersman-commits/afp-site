import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
    include: {
      user: {
        select: { email: true, role: true },
      },
    },
  })

  return NextResponse.json({ member })
}

export async function PUT(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Не авторизован' }, { status: 401 })
  }

  const data = await req.json()

  const member = await prisma.member.update({
    where: { userId: session.user.id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      bio: data.bio,
      specialization: JSON.stringify(data.specialization ?? []),
      country: data.country,
      city: data.city,
      phone: data.phone,
      website: data.website,
      isPublic: data.isPublic ?? true,
    },
  })

  return NextResponse.json(member)
}

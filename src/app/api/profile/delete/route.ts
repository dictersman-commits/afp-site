import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { password } = await req.json()
  if (!password) return NextResponse.json({ error: 'Введите пароль' }, { status: 400 })

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return NextResponse.json({ error: 'Неверный пароль' }, { status: 400 })

  // Каскадно удалятся EventRegistration и Member через Prisma relations
  await prisma.eventRegistration.deleteMany({ where: { userId: user.id } })
  await prisma.member.deleteMany({ where: { userId: user.id } })
  await prisma.user.delete({ where: { id: user.id } })

  return NextResponse.json({ ok: true })
}

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification, buildEventRegistrationMessage } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Необходима авторизация' }, { status: 401 })
  }

  const { eventId } = await req.json()
  if (!eventId) {
    return NextResponse.json({ error: 'eventId обязателен' }, { status: 400 })
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } })
  if (!event) {
    return NextResponse.json({ error: 'Мероприятие не найдено' }, { status: 404 })
  }

  // Проверка лимита мест
  if (event.maxSeats) {
    const count = await prisma.eventRegistration.count({ where: { eventId } })
    if (count >= event.maxSeats) {
      return NextResponse.json({ error: 'Места закончились' }, { status: 409 })
    }
  }

  try {
    const registration = await prisma.eventRegistration.create({
      data: { eventId, userId: session.user.id },
    })

    // Отправка уведомления в Telegram
    const message = buildEventRegistrationMessage({
      userName: session.user.name ?? 'Участник',
      userEmail: session.user.email ?? '',
      eventTitle: event.titleRu,
      eventDate: event.date.toLocaleDateString('ru-RU'),
    })

    await sendTelegramNotification(message)

    await prisma.eventRegistration.update({
      where: { id: registration.id },
      data: { notifiedTelegram: true },
    })

    return NextResponse.json({ success: true, registrationId: registration.id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Вы уже записаны на это мероприятие' }, { status: 409 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramNotification } from '@/lib/telegram'

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }

  const text = `📩 <b>Новое сообщение с сайта</b>\n\n<b>Имя:</b> ${name}\n<b>Email:</b> ${email}\n\n<b>Сообщение:</b>\n${message}`

  await sendTelegramNotification(text)

  return NextResponse.json({ ok: true })
}

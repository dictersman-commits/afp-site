const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function sendTelegramNotification(message: string): Promise<void> {
  if (!BOT_TOKEN || !CHAT_ID) {
    console.warn('Telegram bot token or chat ID not configured')
    return
  }

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`

  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'HTML',
    }),
  })
}

export function buildEventRegistrationMessage(params: {
  userName: string
  userEmail: string
  eventTitle: string
  eventDate: string
}): string {
  return (
    `📋 <b>Новая регистрация на мероприятие</b>\n\n` +
    `👤 Участник: ${params.userName}\n` +
    `📧 Email: ${params.userEmail}\n` +
    `🎯 Мероприятие: ${params.eventTitle}\n` +
    `📅 Дата: ${params.eventDate}`
  )
}

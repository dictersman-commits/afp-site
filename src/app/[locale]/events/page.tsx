import type { Metadata } from 'next'
import { type Locale, getDict } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import EventRegisterButton from '@/components/events/EventRegisterButton'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ru' ? 'Мероприятия' : 'Events',
    description: locale === 'ru'
      ? 'Конференции, вебинары и семинары Азиатской Федерации Психологов. Запись онлайн.'
      : 'Conferences, webinars and workshops of the Asian Federation of Psychologists.',
  }
}

export default async function EventsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)

  const session = await auth()

  const events = await prisma.event.findMany({
    where: { published: true },
    orderBy: { date: 'asc' },
  })

  // Если пользователь вошёл — узнаём на какие мероприятия он уже записан
  let registeredIds = new Set<string>()
  if (session?.user?.id) {
    const regs = await prisma.eventRegistration.findMany({
      where: { userId: session.user.id },
      select: { eventId: true },
    })
    registeredIds = new Set(regs.map(r => r.eventId))
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.5rem' }}>
        {t.events.title}
      </h1>
      <p style={{ color: 'var(--afp-muted)', marginBottom: '2.5rem' }}>
        {locale === 'ru' ? 'Конференции, вебинары и семинары для членов АФП' : 'Conferences, webinars and workshops for AFP members'}
      </p>

      {events.length === 0 ? (
        <p style={{ color: 'var(--afp-muted)', textAlign: 'center', padding: '3rem' }}>{t.events.no_events}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {events.map(event => {
            const title = locale === 'ru' ? event.titleRu : (event.titleEn ?? event.titleRu)
            const desc = locale === 'ru' ? event.descriptionRu : (event.descriptionEn ?? event.descriptionRu)
            const isRegistered = registeredIds.has(event.id)

            return (
              <div key={event.id} style={{
                border: '1px solid var(--afp-border)', borderRadius: 10,
                overflow: 'hidden', background: '#fff',
                display: 'grid', gridTemplateColumns: '200px 1fr',
              }}>
                <div style={{
                  background: 'linear-gradient(180deg, var(--afp-blue), var(--afp-teal))',
                  color: '#fff', padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  textAlign: 'center', gap: '0.5rem',
                }}>
                  <span style={{
                    background: 'rgba(255,255,255,0.25)',
                    padding: '0.2rem 0.8rem', borderRadius: 12, fontSize: '0.75rem',
                  }}>
                    {event.isOnline ? t.events.online : t.events.offline}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>
                    {new Date(event.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                  {event.location && (
                    <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>📍 {event.location}</span>
                  )}
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--afp-blue)' }}>
                    {title}
                  </h3>
                  {desc && (
                    <p style={{ color: 'var(--afp-text)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {desc}
                    </p>
                  )}
                  {event.maxSeats && (
                    <p style={{ color: 'var(--afp-muted)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                      {locale === 'ru' ? `Мест: ${event.maxSeats}` : `Seats: ${event.maxSeats}`}
                    </p>
                  )}
                  <EventRegisterButton
                    eventId={event.id}
                    locale={locale}
                    isAuthenticated={!!session}
                    isRegistered={isRegistered}
                    registerLabel={t.events.register_btn}
                    registeredLabel={t.events.registered}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

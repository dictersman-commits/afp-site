import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type Locale, getDict } from '@/lib/i18n'
import Link from 'next/link'
import DashboardSidebar from '@/components/dashboard/DashboardSidebar'

export default async function DashboardPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)

  const session = await auth()
  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`)
  }

  const member = await prisma.member.findUnique({
    where: { userId: session.user.id },
  })

  const registrations = await prisma.eventRegistration.findMany({
    where: { userId: session.user.id },
    include: { event: true },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '2rem' }}>
        {t.dashboard.title}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
        {/* Sidebar */}
        <aside>
          <DashboardSidebar
            locale={locale}
            name={member ? `${member.firstName} ${member.lastName}` : (session.user.email ?? '')}
            initials={member ? `${member.firstName[0]}${member.lastName[0]}` : '?'}
            role={(session.user as { role?: string }).role === 'ADMIN'
              ? (locale === 'ru' ? 'Администратор' : 'Administrator')
              : (locale === 'ru' ? 'Член АФП' : 'AFP Member')}
            profileLabel={t.dashboard.profile}
            eventsLabel={t.dashboard.my_events}
            logoutLabel={t.dashboard.logout}
            adminLabel={(session.user as { role?: string }).role === 'ADMIN'
              ? (locale === 'ru' ? 'Админ-панель' : 'Admin Panel')
              : ''}
          />
        </aside>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Profile card */}
          <section style={{
            border: '1px solid var(--afp-border)', borderRadius: 10,
            padding: '1.5rem', background: '#fff',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontWeight: 700, color: 'var(--afp-blue)' }}>{t.dashboard.profile}</h2>
              <Link href={`/${locale}/dashboard/edit`} style={{
                padding: '0.4rem 1rem', border: '1px solid var(--afp-blue)',
                borderRadius: 6, fontSize: '0.85rem', color: 'var(--afp-blue)', fontWeight: 600,
              }}>
                {t.dashboard.edit_profile}
              </Link>
            </div>
            {member ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.9rem' }}>
                {[
                  { label: locale === 'ru' ? 'Имя' : 'Name', value: `${member.firstName} ${member.lastName}` },
                  { label: 'Email', value: session.user.email },
                  { label: locale === 'ru' ? 'Страна' : 'Country', value: member.country },
                  { label: locale === 'ru' ? 'Город' : 'City', value: member.city ?? '—' },
                  { label: locale === 'ru' ? 'Специализация' : 'Specialization', value: (JSON.parse(member.specialization as string) as string[]).join(', ') || '—' },
                  { label: locale === 'ru' ? 'Сайт' : 'Website', value: member.website ?? '—' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ color: 'var(--afp-muted)', fontSize: '0.8rem', marginBottom: '0.2rem' }}>{label}</div>
                    <div style={{ fontWeight: 500 }}>{value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--afp-muted)' }}>
                {locale === 'ru' ? 'Профиль не заполнен' : 'Profile not filled'}
              </p>
            )}
          </section>

          {/* My events */}
          <section id="my-events" style={{
            border: '1px solid var(--afp-border)', borderRadius: 10,
            padding: '1.5rem', background: '#fff',
          }}>
            <h2 style={{ fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1.25rem' }}>
              {t.dashboard.my_events}
            </h2>
            {registrations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--afp-muted)' }}>
                <p>{locale === 'ru' ? 'Вы ещё не записались ни на одно мероприятие' : 'You haven\'t registered for any events yet'}</p>
                <Link href={`/${locale}/events`} style={{
                  display: 'inline-block', marginTop: '1rem',
                  padding: '0.5rem 1.5rem', background: 'var(--afp-blue)',
                  color: '#fff', borderRadius: 6, fontWeight: 600,
                }}>
                  {locale === 'ru' ? 'Смотреть мероприятия' : 'Browse events'}
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {registrations.map(({ id, event }) => (
                  <div key={id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.75rem 1rem', background: 'var(--afp-bg)',
                    borderRadius: 8, fontSize: '0.9rem',
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{event.titleRu}</div>
                      <div style={{ color: 'var(--afp-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                        {new Date(event.date).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <span style={{
                      padding: '0.2rem 0.75rem', borderRadius: 12,
                      background: '#dcfce7', color: '#16a34a', fontSize: '0.75rem', fontWeight: 600,
                    }}>
                      {locale === 'ru' ? 'Записан' : 'Registered'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

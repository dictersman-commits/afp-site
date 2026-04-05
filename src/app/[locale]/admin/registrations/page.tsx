import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type Locale } from '@/lib/i18n'
import Link from 'next/link'

export default async function AdminRegistrationsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') redirect(`/${locale}/dashboard`)

  const registrations = await prisma.eventRegistration.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      event: { select: { titleRu: true, date: true } },
      user: { select: { email: true, member: { select: { firstName: true, lastName: true } } } },
    },
  })

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/${locale}/admin`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>← Админ-панель</Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginTop: '0.5rem' }}>
          Регистрации на мероприятия <span style={{ fontSize: '1rem', color: 'var(--afp-muted)', fontWeight: 400 }}>({registrations.length})</span>
        </h1>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--afp-border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 2fr 1fr',
          padding: '0.75rem 1.5rem',
          background: 'var(--afp-bg)', fontSize: '0.8rem',
          color: 'var(--afp-muted)', fontWeight: 600, textTransform: 'uppercase',
        }}>
          <span>Участник</span>
          <span>Мероприятие</span>
          <span>Дата записи</span>
        </div>

        {registrations.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--afp-muted)' }}>Регистраций пока нет</p>
        ) : registrations.map((reg, i) => {
          const name = reg.user.member
            ? `${reg.user.member.firstName} ${reg.user.member.lastName}`
            : reg.user.email
          return (
            <div key={reg.id} style={{
              display: 'grid', gridTemplateColumns: '2fr 2fr 1fr',
              padding: '1rem 1.5rem', alignItems: 'center',
              borderTop: i === 0 ? '1px solid var(--afp-border)' : 'none',
              borderBottom: i < registrations.length - 1 ? '1px solid var(--afp-border)' : 'none',
              fontSize: '0.9rem',
            }}>
              <div>
                <p style={{ fontWeight: 600 }}>{name}</p>
                <p style={{ color: 'var(--afp-muted)', fontSize: '0.8rem' }}>{reg.user.email}</p>
              </div>
              <div>
                <p style={{ fontWeight: 500 }}>{reg.event.titleRu}</p>
                <p style={{ color: 'var(--afp-muted)', fontSize: '0.8rem' }}>
                  {new Date(reg.event.date).toLocaleDateString('ru-RU')}
                </p>
              </div>
              <p style={{ color: 'var(--afp-muted)', fontSize: '0.85rem' }}>
                {new Date(reg.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

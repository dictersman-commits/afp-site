import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type Locale, getDict } from '@/lib/i18n'
import Link from 'next/link'

export default async function AdminMembersPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') redirect(`/${locale}/dashboard`)

  const members = await prisma.member.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: { select: { email: true, role: true } } },
  })

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/${locale}/admin`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>← Админ-панель</Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginTop: '0.5rem' }}>
          Участники АФП <span style={{ fontSize: '1rem', color: 'var(--afp-muted)', fontWeight: 400 }}>({members.length})</span>
        </h1>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--afp-border)', borderRadius: 10, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
          padding: '0.75rem 1.5rem',
          background: 'var(--afp-bg)', fontSize: '0.8rem',
          color: 'var(--afp-muted)', fontWeight: 600, textTransform: 'uppercase',
        }}>
          <span>Участник</span>
          <span>Email</span>
          <span>Страна</span>
          <span>Статус</span>
          <span>Роль</span>
        </div>

        {members.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--afp-muted)' }}>Участников пока нет</p>
        ) : members.map((member, i) => (
          <div key={member.id} style={{
            display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
            padding: '1rem 1.5rem', alignItems: 'center',
            borderTop: i === 0 ? '1px solid var(--afp-border)' : 'none',
            borderBottom: i < members.length - 1 ? '1px solid var(--afp-border)' : 'none',
            fontSize: '0.9rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--afp-blue), var(--afp-teal))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: '0.85rem',
              }}>
                {member.firstName[0]}{member.lastName[0]}
              </div>
              <div>
                <p style={{ fontWeight: 600 }}>{member.firstName} {member.lastName}</p>
                {member.city && <p style={{ color: 'var(--afp-muted)', fontSize: '0.8rem' }}>{member.city}</p>}
              </div>
            </div>
            <span style={{ color: 'var(--afp-muted)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {member.user.email}
            </span>
            <span style={{ color: 'var(--afp-muted)' }}>
              {t.countries[member.country as keyof typeof t.countries] ?? member.country}
            </span>
            <span>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: 8, fontSize: '0.75rem',
                background: member.isPublic ? '#dcfce7' : '#f3f4f6',
                color: member.isPublic ? '#16a34a' : '#6b7280',
              }}>
                {member.isPublic ? 'Виден' : 'Скрыт'}
              </span>
            </span>
            <span>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: 8, fontSize: '0.75rem',
                background: member.user.role === 'ADMIN' ? '#dbeafe' : '#f3f4f6',
                color: member.user.role === 'ADMIN' ? '#1d4ed8' : '#6b7280',
              }}>
                {member.user.role}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

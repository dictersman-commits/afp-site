import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type Locale } from '@/lib/i18n'
import Link from 'next/link'

export default async function AdminCouncilPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') redirect(`/${locale}/dashboard`)

  const members = await prisma.councilMember.findMany({ orderBy: { order: 'asc' } })

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href={`/${locale}/admin`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>← Админ-панель</Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginTop: '0.5rem' }}>Совет федерации</h1>
        </div>
        <Link href={`/${locale}/admin/council/new`} style={{
          padding: '0.6rem 1.25rem', background: 'var(--afp-blue)',
          color: '#fff', borderRadius: 6, fontWeight: 600,
        }}>
          + Добавить участника
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--afp-border)', borderRadius: 10, overflow: 'hidden' }}>
        {members.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--afp-muted)' }}>Участников пока нет</p>
        ) : members.map((m, i) => (
          <div key={m.id} style={{
            display: 'flex', alignItems: 'center', gap: '1rem',
            padding: '1rem 1.5rem',
            borderBottom: i < members.length - 1 ? '1px solid var(--afp-border)' : 'none',
          }}>
            {m.photo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={m.photo} alt={m.nameRu} style={{ width: 48, height: 56, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} />
            )}
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, margin: 0 }}>{m.nameRu}</p>
              <p style={{ color: 'var(--afp-muted)', fontSize: '0.82rem', margin: 0 }}>{m.roleRu} · {m.countryRu}</p>
            </div>
            <Link href={`/${locale}/admin/council/${m.id}`} style={{
              padding: '0.3rem 0.75rem', border: '1px solid var(--afp-border)',
              borderRadius: 6, fontSize: '0.85rem', color: 'var(--afp-blue)',
            }}>
              Редактировать
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

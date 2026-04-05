import { notFound } from 'next/navigation'
import Link from 'next/link'
import { type Locale, getDict } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>
}) {
  const { locale, id } = await params
  const t = getDict(locale)

  const member = await prisma.member.findUnique({
    where: { id, isPublic: true },
  })

  if (!member) notFound()

  const specialization = JSON.parse(member.specialization as string) as string[]
  const countryName = t.countries[member.country as keyof typeof t.countries] ?? member.country

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href={`/${locale}/catalog`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>
          ← {locale === 'ru' ? 'Назад к каталогу' : 'Back to catalog'}
        </Link>
      </div>

      <div style={{
        background: '#fff', border: '1px solid var(--afp-border)',
        borderRadius: 12, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, var(--afp-blue), var(--afp-teal))',
          padding: '2.5rem 2rem',
          display: 'flex', alignItems: 'center', gap: '1.5rem',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 700, color: '#fff',
          }}>
            {member.firstName[0]}{member.lastName[0]}
          </div>
          <div style={{ color: '#fff' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0 }}>
              {member.firstName} {member.lastName}
            </h1>
            <p style={{ margin: '0.35rem 0 0', opacity: 0.85, fontSize: '0.95rem' }}>
              {countryName}{member.city ? `, ${member.city}` : ''}
            </p>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {specialization.map(s => (
                <span key={s} style={{
                  background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.75rem',
                  borderRadius: 12, fontSize: '0.8rem',
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '2rem' }}>
          {member.bio && (
            <section style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.75rem' }}>
                {locale === 'ru' ? 'О специалисте' : 'About'}
              </h2>
              <p style={{ lineHeight: 1.7, color: 'var(--afp-text)' }}>{member.bio}</p>
            </section>
          )}

          <section style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.75rem' }}>
              {locale === 'ru' ? 'Контактная информация' : 'Contact information'}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.95rem' }}>
              {member.phone && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--afp-muted)', minWidth: 100 }}>
                    {locale === 'ru' ? 'Телефон' : 'Phone'}:
                  </span>
                  <a href={`tel:${member.phone}`} style={{ color: 'var(--afp-teal)' }}>{member.phone}</a>
                </div>
              )}
              {member.website && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--afp-muted)', minWidth: 100 }}>
                    {locale === 'ru' ? 'Сайт' : 'Website'}:
                  </span>
                  <a href={member.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--afp-teal)' }}>
                    {member.website}
                  </a>
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <span style={{ color: 'var(--afp-muted)', minWidth: 100 }}>
                  {locale === 'ru' ? 'Страна' : 'Country'}:
                </span>
                <span>{countryName}</span>
              </div>
              {member.city && (
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <span style={{ color: 'var(--afp-muted)', minWidth: 100 }}>
                    {locale === 'ru' ? 'Город' : 'City'}:
                  </span>
                  <span>{member.city}</span>
                </div>
              )}
            </div>
          </section>

          {!member.phone && !member.website && (
            <p style={{ color: 'var(--afp-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
              {locale === 'ru'
                ? 'Специалист не указал контактные данные.'
                : 'The specialist has not provided contact information.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type Locale, getDict } from '@/lib/i18n'
import Link from 'next/link'

export default async function AdminPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)

  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') {
    redirect(`/${locale}/dashboard`)
  }

  const [usersCount, membersCount, eventsCount, newsCount, articlesCount, registrationsCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.member.count(),
      prisma.event.count(),
      prisma.news.count(),
      prisma.article.count(),
      prisma.eventRegistration.count(),
    ])

  const recentNews = await prisma.news.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
    select: { id: true, titleRu: true, published: true, createdAt: true },
  })

  const recentEvents = await prisma.event.findMany({
    orderBy: { date: 'asc' },
    take: 5,
    select: { id: true, titleRu: true, published: true, date: true },
  })

  const stats = [
    { label: locale === 'ru' ? 'Пользователи' : 'Users', value: usersCount, href: `/${locale}/admin/users` },
    { label: locale === 'ru' ? 'Члены АФП' : 'AFP Members', value: membersCount, href: `/${locale}/admin/members` },
    { label: locale === 'ru' ? 'Мероприятия' : 'Events', value: eventsCount, href: `/${locale}/admin/events` },
    { label: locale === 'ru' ? 'Регистрации' : 'Registrations', value: registrationsCount, href: `/${locale}/admin/registrations` },
    { label: locale === 'ru' ? 'Новости' : 'News', value: newsCount, href: `/${locale}/admin/news` },
    { label: locale === 'ru' ? 'Статьи' : 'Articles', value: articlesCount, href: `/${locale}/admin/articles` },
  ]

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--afp-blue)' }}>
          {locale === 'ru' ? 'Админ-панель' : 'Admin Panel'}
        </h1>
        <Link href={`/${locale}/dashboard`} style={{
          padding: '0.5rem 1rem', border: '1px solid var(--afp-border)',
          borderRadius: 6, fontSize: '0.85rem', color: 'var(--afp-muted)',
        }}>
          ← {t.dashboard.title}
        </Link>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem', marginBottom: '2.5rem',
      }}>
        {stats.map(({ label, value, href }) => (
          <Link key={label} href={href} style={{
            border: '1px solid var(--afp-border)', borderRadius: 10,
            padding: '1.25rem', background: '#fff', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--afp-blue)' }}>{value}</div>
            <div style={{ color: 'var(--afp-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{label}</div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent news */}
        <section style={{
          border: '1px solid var(--afp-border)', borderRadius: 10,
          padding: '1.5rem', background: '#fff',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 700, color: 'var(--afp-blue)' }}>
              {locale === 'ru' ? 'Новости' : 'News'}
            </h2>
            <Link href={`/${locale}/admin/news/new`} style={{
              padding: '0.3rem 0.8rem', background: 'var(--afp-blue)',
              color: '#fff', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600,
            }}>
              + {locale === 'ru' ? 'Добавить' : 'Add'}
            </Link>
          </div>
          {recentNews.map(({ id, titleRu, published, createdAt }) => (
            <div key={id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.6rem 0', borderBottom: '1px solid var(--afp-border)', fontSize: '0.85rem',
            }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {titleRu}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0, marginLeft: '0.5rem' }}>
                <span style={{
                  padding: '0.15rem 0.5rem', borderRadius: 8, fontSize: '0.7rem',
                  background: published ? '#dcfce7' : '#fef9c3',
                  color: published ? '#16a34a' : '#ca8a04',
                }}>
                  {published
                    ? (locale === 'ru' ? 'Опубл.' : 'Published')
                    : (locale === 'ru' ? 'Черн.' : 'Draft')}
                </span>
                <Link href={`/${locale}/admin/news/${id}`} style={{ color: 'var(--afp-teal)', fontSize: '0.75rem' }}>
                  {locale === 'ru' ? 'Ред.' : 'Edit'}
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Recent events */}
        <section style={{
          border: '1px solid var(--afp-border)', borderRadius: 10,
          padding: '1.5rem', background: '#fff',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontWeight: 700, color: 'var(--afp-blue)' }}>
              {locale === 'ru' ? 'Мероприятия' : 'Events'}
            </h2>
            <Link href={`/${locale}/admin/events/new`} style={{
              padding: '0.3rem 0.8rem', background: 'var(--afp-blue)',
              color: '#fff', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600,
            }}>
              + {locale === 'ru' ? 'Добавить' : 'Add'}
            </Link>
          </div>
          {recentEvents.map(({ id, titleRu, published, date }) => (
            <div key={id} style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0.6rem 0', borderBottom: '1px solid var(--afp-border)', fontSize: '0.85rem',
            }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {titleRu}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0, marginLeft: '0.5rem' }}>
                <span style={{ color: 'var(--afp-muted)', fontSize: '0.75rem' }}>
                  {new Date(date).toLocaleDateString('ru-RU')}
                </span>
                <span style={{
                  padding: '0.15rem 0.5rem', borderRadius: 8, fontSize: '0.7rem',
                  background: published ? '#dcfce7' : '#fef9c3',
                  color: published ? '#16a34a' : '#ca8a04',
                }}>
                  {published ? '✓' : locale === 'ru' ? 'Черн.' : 'Draft'}
                </span>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { type Locale, getDict } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ru'
      ? 'Азиатская Федерация Психологов — asianpsyche.org'
      : 'Asian Federation of Psychologists — asianpsyche.org',
    description: locale === 'ru'
      ? 'Международная профессиональная организация психологов и психотерапевтов Азии. Каталог специалистов, мероприятия, научная библиотека.'
      : 'International professional organization of psychologists and psychotherapists of Asia. Specialist catalog, events, scientific library.',
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)

  const [membersCount, upcomingEvents, latestNews] = await Promise.all([
    prisma.member.count({ where: { isPublic: true } }),
    prisma.event.findMany({ where: { published: true, date: { gte: new Date() } }, orderBy: { date: 'asc' }, take: 3 }),
    prisma.news.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
  ])

  return (
    <>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--afp-blue) 0%, var(--afp-teal) 100%)',
        color: '#fff', padding: '5rem 1.5rem', textAlign: 'center',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(1.8rem, 5vw, 3rem)', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
            {t.home.hero_title}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', opacity: 0.9, marginBottom: '2.5rem', lineHeight: 1.6 }}>
            {t.home.hero_subtitle}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/${locale}/auth/register`} style={{
              padding: '0.875rem 2rem', background: '#fff',
              color: 'var(--afp-blue)', borderRadius: 6, fontWeight: 700, fontSize: '1rem',
            }}>
              {t.home.hero_cta}
            </Link>
            <Link href={`/${locale}/catalog`} style={{
              padding: '0.875rem 2rem', border: '2px solid rgba(255,255,255,0.7)',
              color: '#fff', borderRadius: 6, fontSize: '1rem',
            }}>
              {t.home.hero_cta_secondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--afp-bg)', padding: '2.5rem 1.5rem' }}>
        <div style={{
          maxWidth: 900, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1.5rem', textAlign: 'center',
        }}>
          {[
            { value: membersCount.toString(), label: t.home.members_count },
            { value: '10', label: t.home.countries_count },
            { value: upcomingEvents.length.toString() + '+', label: t.home.events_count },
          ].map(({ value, label }) => (
            <div key={label}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--afp-blue)' }}>{value}</div>
              <div style={{ color: 'var(--afp-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section style={{ padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1rem' }}>
              {t.home.about_title}
            </h2>
            <p style={{ color: 'var(--afp-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              {t.home.about_text}
            </p>
            <Link href={`/${locale}/about`} style={{
              display: 'inline-block', padding: '0.6rem 1.5rem',
              background: 'var(--afp-blue)', color: '#fff', borderRadius: 6, fontWeight: 600,
            }}>
              {locale === 'ru' ? 'Подробнее' : 'Learn more'}
            </Link>
          </div>
          <div style={{
            background: 'var(--afp-bg)', borderRadius: 12, padding: '2rem',
            borderLeft: '4px solid var(--afp-teal)',
          }}>
            <p style={{ fontStyle: 'italic', lineHeight: 1.8, color: 'var(--afp-muted)' }}>
              {locale === 'ru'
                ? '«АФП объединяет психологов и психотерапевтов из России, Казахстана, Китая, ОАЭ, Монголии и других стран Азии для развития профессии и науки.»'
                : '«AFP unites psychologists and psychotherapists from Russia, Kazakhstan, China, UAE, Mongolia and other Asian countries to advance the profession and science.»'}
            </p>
          </div>
        </div>
      </section>

      {/* Catalog CTA */}
      <section style={{ background: 'var(--afp-bg)', padding: '4rem 1.5rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1rem' }}>
            {t.home.catalog_title}
          </h2>
          <p style={{ color: 'var(--afp-muted)', marginBottom: '1.5rem' }}>{t.home.catalog_text}</p>
          <Link href={`/${locale}/catalog`} style={{
            display: 'inline-block', padding: '0.75rem 2rem',
            background: 'var(--afp-blue)', color: '#fff', borderRadius: 6, fontWeight: 700,
          }}>
            {locale === 'ru' ? 'Открыть каталог' : 'Browse directory'}
          </Link>
        </div>
      </section>

      {/* Events preview */}
      {upcomingEvents.length > 0 && (
        <section style={{ padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)' }}>
                {t.home.events_title}
              </h2>
              <Link href={`/${locale}/events`} style={{ color: 'var(--afp-teal)', fontWeight: 600 }}>
                {locale === 'ru' ? 'Все мероприятия →' : 'All events →'}
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {upcomingEvents.map(event => {
                const title = locale === 'ru' ? event.titleRu : (event.titleEn ?? event.titleRu)
                const tag = event.isOnline ? t.events.online : t.events.offline
                return (
                  <div key={event.id} style={{ border: '1px solid var(--afp-border)', borderRadius: 8, overflow: 'hidden' }}>
                    <div style={{ background: 'var(--afp-blue)', padding: '1rem 1.25rem', color: '#fff' }}>
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.2rem 0.6rem', borderRadius: 12, fontSize: '0.75rem', display: 'inline-block', marginBottom: '0.5rem' }}>
                        {tag}
                      </span>
                      <p style={{ fontWeight: 600, lineHeight: 1.3 }}>{title}</p>
                    </div>
                    <div style={{ padding: '1rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--afp-muted)', fontSize: '0.85rem' }}>
                        {new Date(event.date).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long' })}
                      </span>
                      <Link href={`/${locale}/events`} style={{ color: 'var(--afp-teal)', fontSize: '0.85rem', fontWeight: 600 }}>
                        {locale === 'ru' ? 'Записаться' : 'Register'} →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* News preview */}
      {latestNews.length > 0 && (
        <section style={{ background: 'var(--afp-bg)', padding: '4rem 1.5rem' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)' }}>
                {t.home.news_title}
              </h2>
              <Link href={`/${locale}/news`} style={{ color: 'var(--afp-teal)', fontWeight: 600 }}>
                {locale === 'ru' ? 'Все новости →' : 'All news →'}
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {latestNews.map(news => {
                const title = locale === 'ru' ? news.titleRu : (news.titleEn ?? news.titleRu)
                return (
                  <div key={news.id} style={{ background: '#fff', border: '1px solid var(--afp-border)', borderRadius: 8, padding: '1.25rem' }}>
                    <p style={{ fontWeight: 600, lineHeight: 1.4, marginBottom: '0.75rem' }}>{title}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: 'var(--afp-muted)', fontSize: '0.8rem' }}>
                        {new Date(news.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long' })}
                      </span>
                      <Link href={`/${locale}/news/${news.slug}`} style={{ color: 'var(--afp-teal)', fontSize: '0.85rem', fontWeight: 600 }}>
                        {t.news.read_more} →
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

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
      ? 'Международная профессиональная организация психологов и психотерапевтов Азии.'
      : 'International professional organization of psychologists and psychotherapists of Asia.',
  }
}

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)
  const isRu = locale === 'ru'

  const [membersCount, eventsCount, upcomingEvents, latestNews] = await Promise.all([
    prisma.member.count({ where: { isPublic: true } }),
    prisma.event.count({ where: { published: true } }),
    prisma.event.findMany({ where: { published: true }, orderBy: { date: 'asc' }, take: 3 }),
    prisma.news.findMany({ where: { published: true }, orderBy: { createdAt: 'desc' }, take: 3 }),
  ])

  const cardStyle = {
    background: 'var(--afp-green-light)',
    borderRadius: 16,
    overflow: 'hidden' as const,
  }

  return (
    <>
      {/* ── HERO ── */}
      <section style={{ background: 'var(--afp-green-pale)', padding: '3rem 1.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="home-hero-grid">
            {/* Left */}
            <div style={{ ...cardStyle, padding: '2.5rem 2rem' }}>
              <span style={{
                display: 'inline-block', background: 'var(--afp-dark)',
                color: '#fff', fontSize: '0.75rem', padding: '0.25rem 0.75rem',
                borderRadius: 20, marginBottom: '1.25rem',
              }}>
                asianpsyche.org
              </span>
              <h1 style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 700,
                color: 'var(--afp-dark)', lineHeight: 1.2, marginBottom: '1rem',
              }}>
                {t.home.hero_title}
              </h1>
              <p style={{ color: 'var(--afp-muted)', lineHeight: 1.7, marginBottom: '2rem', fontSize: '1rem' }}>
                {t.home.hero_subtitle}
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href={`/${locale}/auth/register`} style={{
                  padding: '0.7rem 1.5rem', background: 'var(--afp-dark)',
                  color: '#fff', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem',
                }}>
                  {t.home.hero_cta}
                </Link>
                <Link href={`/${locale}/catalog`} style={{
                  padding: '0.7rem 1.5rem', border: '1.5px solid var(--afp-dark)',
                  color: 'var(--afp-dark)', borderRadius: 8, fontWeight: 600, fontSize: '0.9rem',
                }}>
                  {t.home.hero_cta_secondary}
                </Link>
              </div>
            </div>
            {/* Right — hero photo */}
            <div className="hero-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/hero.jpg"
                alt={isRu ? 'Команда АФП' : 'AFP Team'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Stats */}
          <div className="home-stats-grid">
            {[
              { value: `${membersCount}`, label: t.home.members_count, dark: false },
              { value: '10', label: t.home.countries_count, dark: true },
              { value: `${eventsCount}+`, label: t.home.events_count, dark: false },
            ].map(({ value, label, dark }) => (
              <div key={label} style={{
                ...cardStyle,
                background: dark ? 'var(--afp-dark)' : 'var(--afp-green-light)',
                padding: '1.5rem',
              }}>
                <div style={{ fontSize: '2.25rem', fontWeight: 800, color: dark ? '#fff' : 'var(--afp-dark)', lineHeight: 1 }}>
                  {value}
                </div>
                <div style={{ color: dark ? 'rgba(255,255,255,0.7)' : 'var(--afp-muted)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── О ФЕДЕРАЦИИ ── */}
      <section style={{ padding: '4rem 1.5rem', background: 'var(--afp-bg)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-dark)', marginBottom: '1.5rem' }}>
            {t.home.about_title}
          </h2>
          <div className="home-about-grid">
            {/* Left card */}
            <div style={{ ...cardStyle, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <p style={{ color: 'var(--afp-text)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                {t.home.about_text}
              </p>
              <div>
                <Link href={`/${locale}/about`} style={{
                  display: 'inline-block', padding: '0.6rem 1.25rem',
                  background: 'var(--afp-dark)', color: '#fff',
                  borderRadius: 8, fontWeight: 600, fontSize: '0.875rem',
                }}>
                  {isRu ? 'Подробнее' : 'Learn more'}
                </Link>
              </div>
            </div>
            {/* Right: photo + quote */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                borderRadius: 16, overflow: 'hidden', height: 200,
                position: 'relative',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop"
                  alt={isRu ? 'Конференция АФП' : 'AFP Conference'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ ...cardStyle, padding: '1.25rem' }}>
                <p style={{ fontStyle: 'italic', lineHeight: 1.7, color: 'var(--afp-muted)', fontSize: '0.9rem', margin: 0 }}>
                  {isRu
                    ? '«АФП объединяет психологов и психотерапевтов из России, Казахстана, Китая, ОАЭ, Монголии и других стран Азии для развития профессии и науки.»'
                    : '"AFP unites psychologists and psychotherapists from Russia, Kazakhstan, China, UAE, Mongolia and other Asian countries."'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── НАЙДИТЕ СПЕЦИАЛИСТА ── */}
      <section style={{ padding: '0 1.5rem 4rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="home-catalog-banner">
            <div style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#fff', lineHeight: 1.3, margin: 0 }}>
                {t.home.catalog_title}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0, fontSize: '0.95rem' }}>
                {t.home.catalog_text}
              </p>
              <div>
                <Link href={`/${locale}/catalog`} style={{
                  display: 'inline-block', padding: '0.7rem 1.5rem',
                  border: '1.5px solid rgba(255,255,255,0.6)', color: '#fff',
                  borderRadius: 8, fontWeight: 600, fontSize: '0.875rem',
                }}>
                  {isRu ? 'Открыть каталог' : 'Browse catalog'}
                </Link>
              </div>
            </div>
            <div className="catalog-photo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?w=1000&h=800&fit=crop"
                alt={isRu ? 'Консультация психолога' : 'Psychological consultation'}
                style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── БЛИЖАЙШИЕ МЕРОПРИЯТИЯ ── */}
      {upcomingEvents.length > 0 && (
        <section style={{ padding: '4rem 1.5rem', background: 'var(--afp-bg)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="section-header">
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-dark)', margin: 0 }}>
                {t.home.events_title}
              </h2>
              <Link href={`/${locale}/events`} className="section-link">
                {isRu ? 'Все мероприятия →' : 'All events →'}
              </Link>
            </div>
            <div className="home-events-grid">
              {upcomingEvents.map((event, i) => {
                const title = isRu ? event.titleRu : (event.titleEn ?? event.titleRu)
                const isDark = i === 2
                return (
                  <div key={event.id} style={{
                    background: isDark ? 'var(--afp-dark)' : 'var(--afp-green-light)',
                    borderRadius: 14, padding: '1.5rem',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                  }}>
                    <div>
                      <span style={{
                        display: 'inline-block', padding: '0.2rem 0.65rem',
                        background: isDark ? 'rgba(255,255,255,0.15)' : 'var(--afp-dark)',
                        color: '#fff', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600,
                        marginBottom: '0.75rem',
                      }}>
                        {event.isOnline ? t.events.online : t.events.offline}
                      </span>
                      <h3 style={{
                        fontWeight: 700, fontSize: '1rem', lineHeight: 1.4,
                        color: isDark ? '#fff' : 'var(--afp-dark)', margin: 0,
                      }}>
                        {title}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ fontSize: '0.8rem', color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--afp-muted)' }}>
                        {new Date(event.date).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long' })}
                      </span>
                      <Link href={`/${locale}/events`} style={{
                        display: 'inline-block', padding: '0.4rem 0.9rem',
                        background: isDark ? 'rgba(255,255,255,0.15)' : 'var(--afp-dark)',
                        color: '#fff', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600,
                      }}>
                        {isRu ? 'Записаться →' : 'Register →'}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── ПОСЛЕДНИЕ НОВОСТИ ── */}
      {latestNews.length > 0 && (
        <section style={{ padding: '4rem 1.5rem', background: 'var(--afp-bg)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-dark)', margin: 0 }}>
                {t.home.news_title}
              </h2>
              <Link href={`/${locale}/news`} className="section-link">
                {isRu ? 'Все новости →' : 'All news →'}
              </Link>
            </div>
            <div className="home-news-grid">
              {latestNews.map(news => {
                const title = isRu ? news.titleRu : (news.titleEn ?? news.titleRu)
                return (
                  <div key={news.id} style={{
                    background: '#fff', borderRadius: 14, overflow: 'hidden',
                    border: '1px solid var(--afp-border)',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {/* Cover image */}
                    <div style={{ height: 200, position: 'relative', overflow: 'hidden', borderRadius: '14px 14px 0 0' }}>
                      {news.coverImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={news.coverImage}
                          alt={title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          background: 'linear-gradient(135deg, var(--afp-green-light), var(--afp-green-pale))',
                        }} />
                      )}
                    </div>
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <span style={{ color: 'var(--afp-muted)', fontSize: '0.75rem' }}>
                        {new Date(news.createdAt).toLocaleDateString(isRu ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <h3 style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.4, color: 'var(--afp-dark)', margin: 0 }}>
                        {title}
                      </h3>
                      <Link href={`/${locale}/news/${news.slug}`} style={{
                        color: 'var(--afp-green)', fontSize: '0.85rem', fontWeight: 600, marginTop: 'auto',
                      }}>
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

import type { Metadata } from 'next'
import Link from 'next/link'
import { type Locale, getDict } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ru' ? 'Новости' : 'News',
    description: locale === 'ru'
      ? 'Новости и публикации Азиатской Федерации Психологов.'
      : 'News and publications of the Asian Federation of Psychologists.',
  }
}

export default async function NewsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)

  const newsList = await prisma.news.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  const formatDate = (d: Date) =>
    new Date(d).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

  const featured = newsList[0]
  const rest = newsList.slice(1)

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '3rem', borderBottom: '2px solid var(--afp-dark)', paddingBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, color: 'var(--afp-dark)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
          {t.news.title}
        </h1>
        <p style={{ color: 'var(--afp-muted)', fontSize: '1.05rem' }}>
          {locale === 'ru' ? 'Актуальные новости и события федерации' : 'Latest federation news and events'}
        </p>
      </div>

      {newsList.length === 0 ? (
        <p style={{ color: 'var(--afp-muted)', textAlign: 'center', padding: '3rem' }}>{t.news.no_news}</p>
      ) : (
        <>
          {/* Featured (hero) */}
          {featured && (() => {
            const title = locale === 'ru' ? featured.titleRu : (featured.titleEn ?? featured.titleRu)
            const content = locale === 'ru' ? featured.contentRu : (featured.contentEn ?? featured.contentRu)
            const excerpt = content ? content.slice(0, 220) + (content.length > 220 ? '…' : '') : ''
            return (
              <Link href={`/${locale}/news/${featured.slug}`} style={{ display: 'block', marginBottom: '3.5rem' }}>
                <article className="news-featured" style={{
                  display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem',
                  alignItems: 'center',
                }}>
                  <div style={{
                    position: 'relative', aspectRatio: '16/10', borderRadius: 14,
                    overflow: 'hidden', background: '#eee',
                  }}>
                    {featured.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={featured.coverImage} alt={title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--afp-blue), var(--afp-teal))' }} />
                    )}
                  </div>
                  <div>
                    <span style={{
                      display: 'inline-block', padding: '0.3rem 0.75rem',
                      background: 'var(--afp-dark)', color: '#fff',
                      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', borderRadius: 3, marginBottom: '1rem',
                    }}>
                      {locale === 'ru' ? 'Главная новость' : 'Featured'}
                    </span>
                    <h2 style={{
                      fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.2,
                      marginBottom: '1rem', color: 'var(--afp-dark)', letterSpacing: '-0.01em',
                    }}>
                      {title}
                    </h2>
                    <p style={{ color: 'var(--afp-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                      {excerpt}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ color: 'var(--afp-muted)', fontSize: '0.85rem' }}>
                        {formatDate(featured.createdAt)}
                      </span>
                      <span style={{ color: 'var(--afp-teal)', fontWeight: 700, fontSize: '0.9rem' }}>
                        {t.news.read_more} →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })()}

          {/* Rest as horizontal list */}
          {rest.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {rest.map((news) => {
                const title = locale === 'ru' ? news.titleRu : (news.titleEn ?? news.titleRu)
                const content = locale === 'ru' ? news.contentRu : (news.contentEn ?? news.contentRu)
                const excerpt = content ? content.slice(0, 180) + (content.length > 180 ? '…' : '') : ''

                return (
                  <Link key={news.id} href={`/${locale}/news/${news.slug}`} style={{ display: 'block' }}>
                    <article className="news-item" style={{
                      display: 'grid', gridTemplateColumns: '260px 1fr', gap: '2rem',
                      padding: '2rem 0', borderTop: '1px solid var(--afp-border)',
                      alignItems: 'center',
                    }}>
                      <div style={{
                        aspectRatio: '16/10', borderRadius: 10,
                        overflow: 'hidden', background: '#eee',
                      }}>
                        {news.coverImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={news.coverImage} alt={title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, var(--afp-blue), var(--afp-teal))' }} />
                        )}
                      </div>
                      <div>
                        <span style={{ color: 'var(--afp-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                          {formatDate(news.createdAt)}
                        </span>
                        <h3 style={{
                          fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.3,
                          margin: '0.5rem 0 0.75rem', color: 'var(--afp-dark)',
                        }}>
                          {title}
                        </h3>
                        <p style={{ color: 'var(--afp-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '0.75rem' }}>
                          {excerpt}
                        </p>
                        <span style={{ color: 'var(--afp-teal)', fontWeight: 700, fontSize: '0.85rem' }}>
                          {t.news.read_more} →
                        </span>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

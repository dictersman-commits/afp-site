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

  const colors = ['#1a4a7a', '#0e7490', '#1e4d8c', '#075985', '#164e63', '#1e3a5f']

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.5rem' }}>
        {t.news.title}
      </h1>
      <p style={{ color: 'var(--afp-muted)', marginBottom: '2.5rem' }}>
        {locale === 'ru' ? 'Актуальные новости и события федерации' : 'Latest federation news and events'}
      </p>

      {newsList.length === 0 ? (
        <p style={{ color: 'var(--afp-muted)', textAlign: 'center', padding: '3rem' }}>{t.news.no_news}</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {newsList.map((news, i) => {
            const title = locale === 'ru' ? news.titleRu : (news.titleEn ?? news.titleRu)
            const content = locale === 'ru' ? news.contentRu : (news.contentEn ?? news.contentRu)
            const excerpt = content ? content.slice(0, 120) + (content.length > 120 ? '...' : '') : ''

            return (
              <article key={news.id} style={{
                border: '1px solid var(--afp-border)', borderRadius: 10,
                overflow: 'hidden', background: '#fff',
                display: 'flex', flexDirection: 'column',
              }}>
                <div style={{ background: colors[i % colors.length], height: 120 }} />
                <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'var(--afp-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                    {new Date(news.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </span>
                  <h3 style={{ fontWeight: 700, lineHeight: 1.4, marginBottom: '0.75rem', fontSize: '1rem' }}>
                    {title}
                  </h3>
                  <p style={{ color: 'var(--afp-muted)', fontSize: '0.875rem', lineHeight: 1.6, flex: 1 }}>
                    {excerpt}
                  </p>
                  <Link href={`/${locale}/news/${news.slug}`} style={{
                    marginTop: '1rem', color: 'var(--afp-teal)', fontWeight: 600, fontSize: '0.85rem',
                  }}>
                    {t.news.read_more} →
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

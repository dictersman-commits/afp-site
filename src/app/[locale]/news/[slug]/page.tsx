import { notFound } from 'next/navigation'
import Link from 'next/link'
import { type Locale } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const news = await prisma.news.findUnique({ where: { slug, published: true } })
  if (!news) notFound()

  const title = locale === 'ru' ? news.titleRu : (news.titleEn ?? news.titleRu)
  const content = locale === 'ru' ? news.contentRu : (news.contentEn ?? news.contentRu)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href={`/${locale}/news`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>
          ← {locale === 'ru' ? 'Все новости' : 'All news'}
        </Link>
      </div>
      <article>
        {news.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={news.coverImage}
            alt={title}
            style={{
              width: '100%', height: 340, objectFit: 'cover',
              objectPosition: 'center center', borderRadius: 12,
              marginBottom: '2rem', display: 'block',
            }}
          />
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, var(--afp-green-light), var(--afp-green-pale))',
            height: 200, borderRadius: 12, marginBottom: '2rem',
          }} />
        )}
        <p style={{ color: 'var(--afp-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
          {new Date(news.createdAt).toLocaleDateString(locale === 'ru' ? 'ru-RU' : 'en-US', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1.5rem', lineHeight: 1.3 }}>
          {title}
        </h1>
        <div style={{ lineHeight: 1.8, color: 'var(--afp-text)', fontSize: '1rem', whiteSpace: 'pre-line' }}>
          {content}
        </div>
      </article>
    </div>
  )
}

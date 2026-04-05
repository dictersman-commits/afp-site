import { notFound } from 'next/navigation'
import Link from 'next/link'
import { type Locale, getDict } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>
}) {
  const { locale, slug } = await params
  const t = getDict(locale)

  const article = await prisma.article.findUnique({ where: { slug, published: true } })
  if (!article) notFound()

  const title = locale === 'ru' ? article.titleRu : (article.titleEn ?? article.titleRu)
  const content = locale === 'ru' ? article.contentRu : (article.contentEn ?? article.contentRu)
  const tags = JSON.parse(article.tags as string) as string[]
  const countryName = t.countries[article.country as keyof typeof t.countries] ?? article.country

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href={`/${locale}/library`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>
          ← {locale === 'ru' ? 'Библиотека' : 'Library'}
        </Link>
      </div>

      <article style={{ background: '#fff', border: '1px solid var(--afp-border)', borderRadius: 12, padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          {tags.map(tg => (
            <span key={tg} style={{
              background: 'var(--afp-bg)', padding: '0.2rem 0.75rem',
              borderRadius: 12, fontSize: '0.8rem', color: 'var(--afp-teal)',
              border: '1px solid var(--afp-border)',
            }}>{tg}</span>
          ))}
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1rem', lineHeight: 1.3 }}>
          {title}
        </h1>

        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', fontSize: '0.85rem', color: 'var(--afp-muted)', borderBottom: '1px solid var(--afp-border)', paddingBottom: '1rem' }}>
          {article.authorName && <span>{locale === 'ru' ? 'Автор' : 'Author'}: {article.authorName}</span>}
          <span>{locale === 'ru' ? 'Страна' : 'Country'}: {countryName}</span>
          <span>{new Date(article.createdAt).getFullYear()}</span>
        </div>

        <div style={{ lineHeight: 1.8, color: 'var(--afp-text)', whiteSpace: 'pre-line' }}>
          {content}
        </div>
      </article>
    </div>
  )
}

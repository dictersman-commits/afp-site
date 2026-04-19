import type { Metadata } from 'next'
import { type Locale, getDict } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import LibraryClient from '@/components/library/LibraryClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ru' ? 'Научный журнал' : 'Library',
    description: locale === 'ru'
      ? 'Научные статьи и публикации по психологии от специалистов из стран Азии.'
      : 'Scientific articles and publications on psychology from specialists across Asia.',
  }
}

export default async function LibraryPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)

  const articles = await prisma.article.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  })

  const parsed = articles.map(a => ({
    ...a,
    tags: JSON.parse(a.tags as string) as string[],
  }))

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.5rem' }}>
        {t.library.title}
      </h1>
      <p style={{ color: 'var(--afp-muted)', marginBottom: '2rem' }}>
        {locale === 'ru' ? 'Научные публикации членов АФП из стран Азии' : 'Scientific publications by AFP members from Asian countries'}
      </p>
      <LibraryClient articles={parsed} locale={locale} t={t} />
    </div>
  )
}

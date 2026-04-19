import type { Metadata } from 'next'
import { type Locale, getDict } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'
import CatalogClient from '@/components/catalog/CatalogClient'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ru' ? 'Каталог специалистов' : 'Specialist Catalog',
    description: locale === 'ru'
      ? 'Найдите психолога или психотерапевта — члена Азиатской Федерации Психотерапии. Фильтры по стране и специализации.'
      : 'Find a psychologist or psychotherapist — member of the Asian Federation of Psychotherapy.',
  }
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)

  const members = await prisma.member.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      specialization: true,
      country: true,
      city: true,
      bio: true,
      website: true,
      photo: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const parsed = members.map(m => ({
    ...m,
    specialization: JSON.parse(m.specialization as string) as string[],
  }))

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.5rem' }}>
        {t.catalog.title}
      </h1>
      <p style={{ color: 'var(--afp-muted)', marginBottom: '2rem' }}>
        {locale === 'ru'
          ? 'Проверенные специалисты — члены Азиатской Федерации Психотерапии'
          : 'Verified specialists — members of the Asian Federation of Psychotherapy'}
      </p>
      <CatalogClient members={parsed} locale={locale} t={t} />
    </div>
  )
}

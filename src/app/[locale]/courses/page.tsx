import type { Metadata } from 'next'
import Link from 'next/link'
import { type Locale } from '@/lib/i18n'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ru' ? 'Курсы и обучение' : 'Courses & Training',
    description: locale === 'ru'
      ? 'Курсы повышения квалификации для психологов и психотерапевтов — членов АФП.'
      : 'Professional development courses for psychologists and psychotherapists — AFP members.',
  }
}

export default async function CoursesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const isRu = locale === 'ru'

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '4rem 1.5rem', textAlign: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--afp-blue), var(--afp-teal))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 2rem', fontSize: '2rem',
      }}>
        🎓
      </div>

      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1rem' }}>
        {isRu ? 'Курсы и обучение' : 'Courses & Training'}
      </h1>

      <p style={{ fontSize: '1.05rem', color: 'var(--afp-muted)', lineHeight: 1.7, maxWidth: 560, margin: '0 auto 2rem' }}>
        {isRu
          ? 'Курсы повышения квалификации, вебинары и учебные программы для членов Азиатской Федерации Психотерапии находятся во внешнем реестре.'
          : 'Professional development courses, webinars and training programs for AFP members are available in the external registry.'}
      </p>

      <div style={{
        background: 'var(--afp-bg)', border: '1px solid var(--afp-border)',
        borderRadius: 12, padding: '2rem', maxWidth: 500, margin: '0 auto 2rem',
      }}>
        <p style={{ color: 'var(--afp-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          {isRu
            ? 'Ссылка на реестр курсов будет добавлена в ближайшее время.'
            : 'The link to the course registry will be added soon.'}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href={`/${locale}/events`} style={{
            padding: '0.75rem 1.5rem', background: 'var(--afp-blue)',
            color: '#fff', borderRadius: 8, fontWeight: 600,
          }}>
            {isRu ? 'Смотреть мероприятия' : 'Browse events'}
          </Link>
          <Link href={`/${locale}/contacts`} style={{
            padding: '0.75rem 1.5rem', border: '1px solid var(--afp-blue)',
            color: 'var(--afp-blue)', borderRadius: 8, fontWeight: 600,
          }}>
            {isRu ? 'Написать нам' : 'Contact us'}
          </Link>
        </div>
      </div>

      <p style={{ color: 'var(--afp-muted)', fontSize: '0.85rem' }}>
        {isRu
          ? 'Члены АФП получают льготы на курсы повышения квалификации.'
          : 'AFP members receive discounts on professional development courses.'}
      </p>
    </div>
  )
}

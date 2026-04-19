import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type Locale } from '@/lib/i18n'
import Link from 'next/link'

export default async function AdminArticlesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') redirect(`/${locale}/dashboard`)

  const articles = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href={`/${locale}/admin`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>← Админ-панель</Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginTop: '0.5rem' }}>Статьи журнала</h1>
        </div>
        <Link href={`/${locale}/admin/articles/new`} style={{
          padding: '0.6rem 1.25rem', background: 'var(--afp-blue)',
          color: '#fff', borderRadius: 6, fontWeight: 600,
        }}>
          + Добавить статью
        </Link>
      </div>

      <div style={{ background: '#fff', border: '1px solid var(--afp-border)', borderRadius: 10, overflow: 'hidden' }}>
        {articles.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: 'var(--afp-muted)' }}>Статей пока нет</p>
        ) : articles.map((article, i) => (
          <div key={article.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 1.5rem',
            borderBottom: i < articles.length - 1 ? '1px solid var(--afp-border)' : 'none',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {article.titleRu}
              </p>
              <p style={{ color: 'var(--afp-muted)', fontSize: '0.8rem', marginTop: '0.2rem' }}>
                {article.country} · {article.authorName ?? '—'} · {new Date(article.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexShrink: 0, marginLeft: '1rem' }}>
              <span style={{
                padding: '0.2rem 0.6rem', borderRadius: 8, fontSize: '0.75rem',
                background: article.published ? '#dcfce7' : '#fef9c3',
                color: article.published ? '#16a34a' : '#ca8a04',
              }}>
                {article.published ? 'Опубликовано' : 'Черновик'}
              </span>
              <Link href={`/${locale}/admin/articles/${article.id}`} style={{
                padding: '0.3rem 0.75rem', border: '1px solid var(--afp-border)',
                borderRadius: 6, fontSize: '0.85rem', color: 'var(--afp-blue)',
              }}>
                Редактировать
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

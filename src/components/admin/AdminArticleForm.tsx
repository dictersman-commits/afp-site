'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ArticleData {
  id: string
  slug: string
  titleRu: string
  titleEn: string | null
  contentRu: string
  contentEn: string | null
  country: string
  authorName: string | null
  tags: string
  published: boolean
}

interface Props {
  locale: string
  article: ArticleData | null
}

const COUNTRIES = ['RU', 'KZ', 'UZ', 'KG', 'TJ', 'CN', 'MN', 'UAE', 'IR', 'SA']

export default function AdminArticleForm({ locale, article }: Props) {
  const router = useRouter()
  const isNew = !article

  const parsedTags = article ? JSON.parse(article.tags) as string[] : []

  const [form, setForm] = useState({
    slug: article?.slug ?? '',
    titleRu: article?.titleRu ?? '',
    titleEn: article?.titleEn ?? '',
    contentRu: article?.contentRu ?? '',
    contentEn: article?.contentEn ?? '',
    country: article?.country ?? 'RU',
    authorName: article?.authorName ?? '',
    tags: parsedTags.join(', '),
    published: article?.published ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  function generateSlug(title: string) {
    return title.toLowerCase()
      .replace(/[а-яё]/g, c => ({ а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ё:'yo',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'h',ц:'ts',ч:'ch',ш:'sh',щ:'sch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya' }[c] ?? c))
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      ...form,
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean),
    }
    try {
      const res = await fetch(`/api/admin/articles${isNew ? '' : `/${article.id}`}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Ошибка'); return }
      router.push(`/${locale}/admin/articles`)
      router.refresh()
    } catch { setError('Ошибка сети') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Удалить статью?')) return
    setDeleting(true)
    await fetch(`/api/admin/articles/${article!.id}`, { method: 'DELETE' })
    router.push(`/${locale}/admin/articles`)
    router.refresh()
  }

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block' as const, fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href={`/${locale}/admin/articles`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>← Все статьи</Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginTop: '0.5rem' }}>
            {isNew ? 'Новая статья' : 'Редактировать статью'}
          </h1>
        </div>
        {!isNew && (
          <button onClick={handleDelete} disabled={deleting} style={{
            padding: '0.5rem 1rem', background: '#fee2e2', border: '1px solid #fca5a5',
            color: '#dc2626', borderRadius: 6, cursor: 'pointer', fontWeight: 600,
          }}>
            {deleting ? '...' : 'Удалить'}
          </button>
        )}
      </div>

      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#fff', border: '1px solid var(--afp-border)', borderRadius: 12, padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Заголовок (RU) *</label>
            <input required value={form.titleRu} style={inputStyle}
              onChange={e => setForm(f => ({ ...f, titleRu: e.target.value, slug: isNew ? generateSlug(e.target.value) : f.slug }))} />
          </div>
          <div>
            <label style={labelStyle}>Title (EN)</label>
            <input value={form.titleEn} style={inputStyle} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Slug (URL) *</label>
            <input required value={form.slug} style={inputStyle} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Страна</label>
            <select value={form.country} style={inputStyle} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Автор</label>
            <input value={form.authorName} style={inputStyle} onChange={e => setForm(f => ({ ...f, authorName: e.target.value }))} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Теги (через запятую)</label>
          <input value={form.tags} style={inputStyle} placeholder="КПТ, тревога, исследования"
            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
        </div>

        <div>
          <label style={labelStyle}>Текст статьи (RU) *</label>
          <textarea required value={form.contentRu} rows={10} style={{ ...inputStyle, resize: 'vertical' }}
            onChange={e => setForm(f => ({ ...f, contentRu: e.target.value }))} />
        </div>

        <div>
          <label style={labelStyle}>Article text (EN)</label>
          <textarea value={form.contentEn} rows={10} style={{ ...inputStyle, resize: 'vertical' }}
            onChange={e => setForm(f => ({ ...f, contentEn: e.target.value }))} />
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
          <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
          <span style={{ fontWeight: 600 }}>Опубликовать</span>
        </label>

        <button type="submit" disabled={saving} style={{
          padding: '0.875rem', background: saving ? '#94a3b8' : 'var(--afp-blue)',
          color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer',
        }}>
          {saving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface EventData {
  id: string
  slug: string
  titleRu: string
  titleEn: string | null
  descriptionRu: string | null
  descriptionEn: string | null
  date: Date
  location: string | null
  isOnline: boolean
  maxSeats: number | null
  published: boolean
}

interface Props {
  locale: string
  event: EventData | null
}

export default function AdminEventForm({ locale, event }: Props) {
  const router = useRouter()
  const isNew = !event

  const [form, setForm] = useState({
    slug: event?.slug ?? '',
    titleRu: event?.titleRu ?? '',
    titleEn: event?.titleEn ?? '',
    descriptionRu: event?.descriptionRu ?? '',
    descriptionEn: event?.descriptionEn ?? '',
    date: event?.date ? new Date(event.date).toISOString().slice(0, 16) : '',
    location: event?.location ?? '',
    isOnline: event?.isOnline ?? true,
    maxSeats: event?.maxSeats?.toString() ?? '',
    published: event?.published ?? false,
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
    try {
      const res = await fetch(`/api/admin/events${isNew ? '' : `/${event.id}`}`, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, maxSeats: form.maxSeats ? parseInt(form.maxSeats) : null }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Ошибка'); return }
      router.push(`/${locale}/admin/events`)
      router.refresh()
    } catch { setError('Ошибка сети') }
    finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Удалить мероприятие?')) return
    setDeleting(true)
    await fetch(`/api/admin/events/${event!.id}`, { method: 'DELETE' })
    router.push(`/${locale}/admin/events`)
    router.refresh()
  }

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem', boxSizing: 'border-box' as const }
  const labelStyle = { display: 'block' as const, fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <Link href={`/${locale}/admin/events`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>← Все мероприятия</Link>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginTop: '0.5rem' }}>
            {isNew ? 'Новое мероприятие' : 'Редактировать мероприятие'}
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
            <label style={labelStyle}>Название (RU) *</label>
            <input required value={form.titleRu} style={inputStyle}
              onChange={e => setForm(f => ({ ...f, titleRu: e.target.value, slug: isNew ? generateSlug(e.target.value) : f.slug }))} />
          </div>
          <div>
            <label style={labelStyle}>Title (EN)</label>
            <input value={form.titleEn} style={inputStyle} onChange={e => setForm(f => ({ ...f, titleEn: e.target.value }))} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Slug *</label>
          <input required value={form.slug} style={inputStyle} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Дата и время *</label>
            <input required type="datetime-local" value={form.date} style={inputStyle} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>Место проведения</label>
            <input value={form.location} style={inputStyle} placeholder="Город / ссылка на Zoom"
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>Описание (RU)</label>
          <textarea value={form.descriptionRu} rows={5} style={{ ...inputStyle, resize: 'vertical' }}
            onChange={e => setForm(f => ({ ...f, descriptionRu: e.target.value }))} />
        </div>

        <div>
          <label style={labelStyle}>Description (EN)</label>
          <textarea value={form.descriptionEn} rows={5} style={{ ...inputStyle, resize: 'vertical' }}
            onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Максимум мест</label>
            <input type="number" value={form.maxSeats} style={inputStyle} min={1}
              onChange={e => setForm(f => ({ ...f, maxSeats: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.isOnline} onChange={e => setForm(f => ({ ...f, isOnline: e.target.checked }))} />
            <span style={{ fontWeight: 600 }}>Онлайн-мероприятие</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
            <span style={{ fontWeight: 600 }}>Опубликовать</span>
          </label>
        </div>

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

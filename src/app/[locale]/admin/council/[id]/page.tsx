'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const EMPTY = { nameRu: '', nameEn: '', roleRu: '', roleEn: '', countryRu: '', countryEn: '', bioRu: '', bioEn: '', photo: '', phone: '', email: '', web: '', order: 0 }

export default function AdminCouncilEditPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const id = params.id as string
  const isNew = id === 'new'

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/admin/council/${id}`)
        .then(r => r.json())
        .then(data => { setForm(data); setLoading(false) })
    }
  }, [id, isNew])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch(isNew ? '/api/admin/council' : `/api/admin/council/${id}`, {
      method: isNew ? 'POST' : 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, order: Number(form.order) }),
    })
    if (res.ok) router.push(`/${locale}/admin/council`)
    else { setError('Ошибка сохранения'); setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Удалить участника?')) return
    await fetch(`/api/admin/council/${id}`, { method: 'DELETE' })
    router.push(`/${locale}/admin/council`)
  }

  const field = (label: string, key: keyof typeof EMPTY, textarea = false) => (
    <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <label style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--afp-muted)' }}>{label}</label>
      {textarea ? (
        <textarea
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={3}
          style={{ padding: '0.6rem 0.9rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem', resize: 'vertical' }}
        />
      ) : (
        <input
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{ padding: '0.6rem 0.9rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem' }}
        />
      )}
    </div>
  )

  if (loading) return <p style={{ padding: '3rem', textAlign: 'center' }}>Загрузка...</p>

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <a href={`/${locale}/admin/council`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>← Совет федерации</a>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', margin: '0.5rem 0 2rem' }}>
        {isNew ? 'Новый участник' : 'Редактировать участника'}
      </h1>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {field('Имя (RU)', 'nameRu')}
          {field('Имя (EN)', 'nameEn')}
          {field('Должность (RU)', 'roleRu')}
          {field('Должность (EN)', 'roleEn')}
          {field('Страна (RU)', 'countryRu')}
          {field('Страна (EN)', 'countryEn')}
        </div>
        {field('Биография (RU)', 'bioRu', true)}
        {field('Биография (EN)', 'bioEn', true)}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {field('Фото (путь /council/...)', 'photo')}
          {field('Порядок', 'order')}
          {field('Телефон', 'phone')}
          {field('Email', 'email')}
          {field('Сайт', 'web')}
        </div>

        {error && <p style={{ color: '#c0392b', fontSize: '0.9rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
          <button type="submit" disabled={saving} style={{
            padding: '0.7rem 2rem', background: 'var(--afp-blue)', color: '#fff',
            border: 'none', borderRadius: 6, fontWeight: 600, cursor: 'pointer',
          }}>
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
          {!isNew && (
            <button type="button" onClick={handleDelete} style={{
              padding: '0.7rem 1.25rem', background: 'none', color: '#c0392b',
              border: '1px solid #c0392b', borderRadius: 6, cursor: 'pointer',
            }}>
              Удалить
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

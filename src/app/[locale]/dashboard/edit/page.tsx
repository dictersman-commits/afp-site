'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import DeleteAccountForm from '@/components/dashboard/DeleteAccountForm'
import Link from 'next/link'

const countriesRu: Record<string, string> = {
  RU: 'Россия', UAE: 'ОАЭ', MN: 'Монголия', IR: 'Иран',
  SA: 'Саудовская Аравия', CN: 'Китай', UZ: 'Узбекистан',
  KZ: 'Казахстан', KG: 'Кыргызия', TJ: 'Таджикистан', OTHER: 'Другая',
}
const countriesEn: Record<string, string> = {
  RU: 'Russia', UAE: 'UAE', MN: 'Mongolia', IR: 'Iran',
  SA: 'Saudi Arabia', CN: 'China', UZ: 'Uzbekistan',
  KZ: 'Kazakhstan', KG: 'Kyrgyzstan', TJ: 'Tajikistan', OTHER: 'Other',
}

export default function EditProfilePage() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'ru'
  const router = useRouter()
  const { status } = useSession()

  const isRu = locale === 'ru'
  const countries = isRu ? countriesRu : countriesEn

  const [form, setForm] = useState({
    firstName: '', lastName: '', bio: '',
    country: 'RU', city: '', phone: '', website: '',
    specialization: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/${locale}/auth/login`)
      return
    }
    if (status !== 'authenticated') return

    fetch('/api/profile')
      .then(r => r.json())
      .then(data => {
        if (data.member) {
          const m = data.member
          setForm({
            firstName: m.firstName ?? '',
            lastName: m.lastName ?? '',
            bio: m.bio ?? '',
            country: m.country ?? 'RU',
            city: m.city ?? '',
            phone: m.phone ?? '',
            website: m.website ?? '',
            specialization: Array.isArray(m.specialization)
              ? m.specialization.join(', ')
              : (JSON.parse(m.specialization || '[]') as string[]).join(', '),
          })
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [status, locale, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          specialization: form.specialization
            .split(',')
            .map(s => s.trim())
            .filter(Boolean),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? (isRu ? 'Ошибка сохранения' : 'Save error'))
        return
      }
      setSuccess(true)
      setTimeout(() => router.push(`/${locale}/dashboard`), 1000)
    } catch {
      setError(isRu ? 'Ошибка сети' : 'Network error')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem',
    boxSizing: 'border-box' as const,
  }
  const labelStyle = {
    display: 'block' as const, fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem',
  }

  if (loading) return (
    <div style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'var(--afp-muted)' }}>{isRu ? 'Загрузка...' : 'Loading...'}</p>
    </div>
  )

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href={`/${locale}/dashboard`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>
          ← {isRu ? 'Назад в кабинет' : 'Back to dashboard'}
        </Link>
      </div>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '2rem' }}>
        {isRu ? 'Редактирование профиля' : 'Edit Profile'}
      </h1>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626',
          padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1.5rem',
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a',
          padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1.5rem',
        }}>
          {isRu ? 'Профиль сохранён!' : 'Profile saved!'}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        background: '#fff', border: '1px solid var(--afp-border)',
        borderRadius: 12, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>{isRu ? 'Имя' : 'First name'} *</label>
            <input type="text" required value={form.firstName} style={inputStyle}
              onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>{isRu ? 'Фамилия' : 'Last name'} *</label>
            <input type="text" required value={form.lastName} style={inputStyle}
              onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
          </div>
        </div>

        <div>
          <label style={labelStyle}>{isRu ? 'О себе' : 'Bio'}</label>
          <textarea value={form.bio} rows={4} style={{ ...inputStyle, resize: 'vertical' }}
            placeholder={isRu ? 'Расскажите о своём опыте и подходе...' : 'Tell about your experience and approach...'}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
        </div>

        <div>
          <label style={labelStyle}>{isRu ? 'Специализация' : 'Specialization'}</label>
          <input type="text" value={form.specialization} style={inputStyle}
            placeholder={isRu ? 'Через запятую: КПТ, Семейная психология' : 'Comma-separated: CBT, Family therapy'}
            onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>{isRu ? 'Страна' : 'Country'}</label>
            <select value={form.country} style={{ ...inputStyle, background: '#fff' }}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
              {Object.entries(countries).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>{isRu ? 'Город' : 'City'}</label>
            <input type="text" value={form.city} style={inputStyle}
              onChange={e => setForm(f => ({ ...f, city: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>{isRu ? 'Телефон' : 'Phone'}</label>
            <input type="tel" value={form.phone} style={inputStyle}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          </div>
          <div>
            <label style={labelStyle}>{isRu ? 'Сайт' : 'Website'}</label>
            <input type="url" value={form.website} style={inputStyle}
              placeholder="https://"
              onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
          <button type="submit" disabled={saving} style={{
            padding: '0.875rem 2rem', background: saving ? '#94a3b8' : 'var(--afp-blue)',
            color: '#fff', border: 'none', borderRadius: 6,
            fontWeight: 700, fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer',
          }}>
            {saving ? (isRu ? 'Сохранение...' : 'Saving...') : (isRu ? 'Сохранить' : 'Save')}
          </button>
          <Link href={`/${locale}/dashboard`} style={{
            padding: '0.875rem 2rem', border: '1px solid var(--afp-border)',
            borderRadius: 6, color: 'var(--afp-muted)', fontSize: '1rem', textAlign: 'center',
          }}>
            {isRu ? 'Отмена' : 'Cancel'}
          </Link>
        </div>
      </form>

      {/* Delete account */}
      <div style={{ marginTop: '2rem' }}>
        <DeleteAccountForm locale={locale as string} />
      </div>
    </div>
  )
}

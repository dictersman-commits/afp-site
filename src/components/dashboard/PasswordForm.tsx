'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function PasswordForm({ locale }: { locale: string }) {
  const router = useRouter()
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const inputStyle = {
    width: '100%', padding: '0.75rem 1rem',
    border: '1px solid var(--afp-border)', borderRadius: 6,
    fontSize: '0.9rem', boxSizing: 'border-box' as const,
  }
  const labelStyle = { display: 'block' as const, fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (form.newPassword !== form.confirmPassword) { setError('Пароли не совпадают'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/profile/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Ошибка'); return }
      setSuccess(true)
      setTimeout(() => router.push(`/${locale}/dashboard`), 1500)
    } catch { setError('Ошибка сети') }
    finally { setSaving(false) }
  }

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <Link href={`/${locale}/dashboard`} style={{ color: 'var(--afp-teal)', fontSize: '0.9rem' }}>
          ← {locale === 'ru' ? 'Личный кабинет' : 'Dashboard'}
        </Link>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--afp-blue)', marginTop: '0.5rem' }}>
          {locale === 'ru' ? 'Смена пароля' : 'Change password'}
        </h1>
      </div>

      {success && (
        <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#15803d', padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1.5rem' }}>
          {locale === 'ru' ? 'Пароль успешно изменён' : 'Password changed successfully'}
        </div>
      )}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid var(--afp-border)', borderRadius: 12, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={labelStyle}>{locale === 'ru' ? 'Текущий пароль' : 'Current password'} *</label>
          <input type="password" required value={form.currentPassword} style={inputStyle}
            onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>{locale === 'ru' ? 'Новый пароль' : 'New password'} *</label>
          <input type="password" required minLength={6} value={form.newPassword} style={inputStyle}
            onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))} />
        </div>
        <div>
          <label style={labelStyle}>{locale === 'ru' ? 'Повторите новый пароль' : 'Confirm new password'} *</label>
          <input type="password" required value={form.confirmPassword} style={inputStyle}
            onChange={e => setForm(f => ({ ...f, confirmPassword: e.target.value }))} />
        </div>
        <button type="submit" disabled={saving} style={{
          padding: '0.875rem', background: saving ? '#94a3b8' : 'var(--afp-blue)',
          color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: '1rem', cursor: saving ? 'not-allowed' : 'pointer',
        }}>
          {saving ? (locale === 'ru' ? 'Сохранение...' : 'Saving...') : (locale === 'ru' ? 'Сменить пароль' : 'Change password')}
        </button>
      </form>
    </>
  )
}

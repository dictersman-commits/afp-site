'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

export default function DeleteAccountForm({ locale }: { locale: string }) {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  async function handleDelete() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/profile/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Ошибка'); setLoading(false); return }
      await signOut({ callbackUrl: `/${locale}` })
    } catch { setError('Ошибка сети'); setLoading(false) }
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        padding: '0.5rem 1rem', background: 'none',
        border: '1px solid #fca5a5', borderRadius: 6,
        color: '#dc2626', cursor: 'pointer', fontSize: '0.85rem',
      }}>
        {locale === 'ru' ? 'Удалить аккаунт' : 'Delete account'}
      </button>
    )
  }

  return (
    <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 10, padding: '1.5rem' }}>
      <h3 style={{ fontWeight: 700, color: '#dc2626', marginBottom: '0.5rem' }}>
        {locale === 'ru' ? 'Удалить аккаунт' : 'Delete account'}
      </h3>
      <p style={{ color: '#7f1d1d', fontSize: '0.9rem', marginBottom: '1rem' }}>
        {locale === 'ru'
          ? 'Это действие необратимо. Все ваши данные будут удалены безвозвратно.'
          : 'This action is irreversible. All your data will be permanently deleted.'}
      </p>
      <input
        type="password"
        placeholder={locale === 'ru' ? 'Введите текущий пароль для подтверждения' : 'Enter current password to confirm'}
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{
          width: '100%', padding: '0.75rem 1rem', marginBottom: '0.75rem',
          border: '1px solid #fca5a5', borderRadius: 6, fontSize: '0.9rem',
          boxSizing: 'border-box',
        }}
      />
      {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button onClick={handleDelete} disabled={loading || !password} style={{
          padding: '0.6rem 1.25rem', background: '#dc2626', border: 'none',
          borderRadius: 6, color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading || !password ? 0.6 : 1,
        }}>
          {loading ? '...' : (locale === 'ru' ? 'Удалить' : 'Delete')}
        </button>
        <button onClick={() => { setOpen(false); setPassword(''); setError('') }} style={{
          padding: '0.6rem 1.25rem', background: 'none',
          border: '1px solid var(--afp-border)', borderRadius: 6,
          cursor: 'pointer', fontSize: '0.9rem',
        }}>
          {locale === 'ru' ? 'Отмена' : 'Cancel'}
        </button>
      </div>
    </div>
  )
}

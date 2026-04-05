'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  eventId: string
  locale: string
  isAuthenticated: boolean
  isRegistered: boolean
  registerLabel: string
  registeredLabel: string
}

export default function EventRegisterButton({
  eventId, locale, isAuthenticated, isRegistered, registerLabel, registeredLabel,
}: Props) {
  const router = useRouter()
  const [registered, setRegistered] = useState(isRegistered)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleClick() {
    if (!isAuthenticated) {
      router.push(`/${locale}/auth/login`)
      return
    }
    if (registered) return

    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? (locale === 'ru' ? 'Ошибка записи' : 'Registration error'))
        return
      }
      setRegistered(true)
    } catch {
      setError(locale === 'ru' ? 'Ошибка сети' : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  if (registered) {
    return (
      <span style={{
        display: 'inline-block', padding: '0.5rem 1.5rem',
        background: '#dcfce7', color: '#16a34a',
        borderRadius: 6, fontWeight: 600, fontSize: '0.85rem',
      }}>
        ✓ {registeredLabel}
      </span>
    )
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          display: 'inline-block', padding: '0.5rem 1.5rem',
          background: loading ? '#94a3b8' : 'var(--afp-blue)',
          color: '#fff', border: 'none',
          borderRadius: 6, fontWeight: 600, fontSize: '0.85rem',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '...' : registerLabel}
      </button>
      {error && (
        <span style={{ marginLeft: '1rem', color: '#dc2626', fontSize: '0.85rem' }}>{error}</span>
      )}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useParams } from 'next/navigation'

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

export default function RegisterPage() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'ru'
  const router = useRouter()

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', country: 'RU' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const countries = locale === 'ru' ? countriesRu : countriesEn
  const isRu = locale === 'ru'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? (isRu ? 'Ошибка регистрации' : 'Registration error'))
        return
      }
      router.push(`/${locale}/auth/login?registered=1`)
    } catch {
      setError(isRu ? 'Ошибка сети. Попробуйте позже.' : 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '70vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem 1.5rem',
      background: 'var(--afp-bg)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: '2.5rem',
        width: '100%', maxWidth: 480,
        border: '1px solid var(--afp-border)',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.5rem', textAlign: 'center' }}>
          {isRu ? 'Регистрация' : 'Registration'}
        </h1>
        <p style={{ color: 'var(--afp-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {isRu ? 'Вступите в Азиатскую Федерацию Психологов' : 'Join the Asian Federation of Psychologists'}
        </p>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626',
            padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1rem', fontSize: '0.9rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                {isRu ? 'Имя' : 'First name'} *
              </label>
              <input
                type="text" required
                value={form.firstName}
                onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
                {isRu ? 'Фамилия' : 'Last name'} *
              </label>
              <input
                type="text" required
                value={form.lastName}
                onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem' }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Email *
            </label>
            <input
              type="email" required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              {isRu ? 'Пароль' : 'Password'} *
            </label>
            <input
              type="password" required minLength={6}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder={isRu ? 'Минимум 6 символов' : 'At least 6 characters'}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              {isRu ? 'Страна' : 'Country'}
            </label>
            <select
              value={form.country}
              onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem', background: '#fff' }}
            >
              {Object.entries(countries).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '0.875rem', background: loading ? '#94a3b8' : 'var(--afp-blue)',
              color: '#fff', border: 'none', borderRadius: 6,
              fontWeight: 700, fontSize: '1rem', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '0.5rem',
            }}
          >
            {loading ? (isRu ? 'Регистрация...' : 'Registering...') : (isRu ? 'Зарегистрироваться' : 'Register')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--afp-muted)' }}>
          {isRu ? 'Уже есть аккаунт?' : 'Already have an account?'}{' '}
          <Link href={`/${locale}/auth/login`} style={{ color: 'var(--afp-teal)', fontWeight: 600 }}>
            {isRu ? 'Войти' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}

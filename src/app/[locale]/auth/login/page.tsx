'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useParams } from 'next/navigation'

function LoginForm() {
  const params = useParams()
  const locale = (params?.locale as string) ?? 'ru'
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams.get('registered')

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRu = locale === 'ru'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      })
      if (res?.error) {
        setError(isRu ? 'Неверный email или пароль' : 'Invalid email or password')
        return
      }
      router.push(`/${locale}/dashboard`)
      router.refresh()
    } catch {
      setError(isRu ? 'Ошибка входа. Попробуйте позже.' : 'Login error. Please try again.')
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
        width: '100%', maxWidth: 420,
        border: '1px solid var(--afp-border)',
      }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.5rem', textAlign: 'center' }}>
          {isRu ? 'Вход' : 'Sign in'}
        </h1>
        <p style={{ color: 'var(--afp-muted)', textAlign: 'center', marginBottom: '2rem', fontSize: '0.9rem' }}>
          {isRu ? 'Войдите в личный кабинет АФП' : 'Sign in to your AFP account'}
        </p>

        {registered && (
          <div style={{
            background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a',
            padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1rem', fontSize: '0.9rem',
          }}>
            {isRu ? 'Регистрация прошла успешно! Войдите в свой аккаунт.' : 'Registration successful! Sign in to your account.'}
          </div>
        )}

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626',
            padding: '0.75rem 1rem', borderRadius: 6, marginBottom: '1rem', fontSize: '0.9rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', fontSize: '0.9rem' }}>
              Email
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
              {isRu ? 'Пароль' : 'Password'}
            </label>
            <input
              type="password" required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem' }}
            />
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
            {loading ? (isRu ? 'Входим...' : 'Signing in...') : (isRu ? 'Войти' : 'Sign in')}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--afp-muted)' }}>
          {isRu ? 'Нет аккаунта?' : 'No account?'}{' '}
          <Link href={`/${locale}/auth/register`} style={{ color: 'var(--afp-teal)', fontWeight: 600 }}>
            {isRu ? 'Зарегистрироваться' : 'Register'}
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

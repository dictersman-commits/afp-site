'use client'

import { useState } from 'react'

export default function ContactForm({ locale }: { locale: string }) {
  const isRu = locale === 'ru'
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      setForm({ name: '', email: '', message: '' })
    } catch {
      setError(isRu ? 'Ошибка отправки. Попробуйте позже.' : 'Send error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    padding: '0.75rem 1rem', border: '1px solid var(--afp-border)',
    borderRadius: 6, fontSize: '0.9rem', width: '100%', boxSizing: 'border-box' as const,
  }

  return (
    <div>
      <h3 style={{ fontWeight: 700, marginBottom: '1.5rem', color: 'var(--afp-blue)' }}>
        {isRu ? 'Написать нам' : 'Send a message'}
      </h3>

      {success ? (
        <div style={{
          background: '#f0fdf4', border: '1px solid #86efac', color: '#16a34a',
          padding: '1.5rem', borderRadius: 8, textAlign: 'center',
        }}>
          <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
            {isRu ? 'Сообщение отправлено!' : 'Message sent!'}
          </p>
          <p style={{ fontSize: '0.9rem' }}>
            {isRu ? 'Мы свяжемся с вами в ближайшее время.' : 'We will contact you shortly.'}
          </p>
          <button onClick={() => setSuccess(false)} style={{
            marginTop: '1rem', padding: '0.5rem 1.5rem', background: 'none',
            border: '1px solid #16a34a', borderRadius: 6, color: '#16a34a', cursor: 'pointer',
          }}>
            {isRu ? 'Написать ещё' : 'Send another'}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 6 }}>
              {error}
            </div>
          )}
          <input
            type="text" required value={form.name}
            placeholder={isRu ? 'Ваше имя' : 'Your name'}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            style={inputStyle}
          />
          <input
            type="email" required value={form.email}
            placeholder="Email"
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            style={inputStyle}
          />
          <textarea
            required value={form.message}
            placeholder={isRu ? 'Сообщение' : 'Message'}
            rows={5}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <button type="submit" disabled={loading} style={{
            padding: '0.75rem', background: loading ? '#94a3b8' : 'var(--afp-blue)',
            color: '#fff', border: 'none', borderRadius: 6,
            fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? '...' : (isRu ? 'Отправить' : 'Send')}
          </button>
        </form>
      )}
    </div>
  )
}

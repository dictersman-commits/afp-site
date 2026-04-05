import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', textAlign: 'center', padding: '2rem',
    }}>
      <div style={{ fontSize: '6rem', fontWeight: 800, color: 'var(--afp-blue)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--afp-blue)', margin: '1rem 0 0.5rem' }}>
        Страница не найдена
      </h1>
      <p style={{ color: 'var(--afp-muted)', marginBottom: '2rem', maxWidth: 400 }}>
        Возможно, страница была удалена или вы ввели неверный адрес.
      </p>
      <Link href="/" style={{
        padding: '0.75rem 2rem', background: 'var(--afp-blue)',
        color: '#fff', borderRadius: 8, fontWeight: 600,
      }}>
        На главную
      </Link>
    </div>
  )
}

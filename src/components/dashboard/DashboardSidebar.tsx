'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

interface Props {
  locale: string
  name: string
  role: string
  initials: string
  profileLabel: string
  eventsLabel: string
  logoutLabel: string
  adminLabel: string
}

export default function DashboardSidebar({ locale, name, role, initials, profileLabel, eventsLabel, logoutLabel, adminLabel }: Props) {
  const router = useRouter()

  async function handleLogout() {
    await signOut({ redirect: false })
    router.push(`/${locale}`)
    router.refresh()
  }

  return (
    <div style={{
      border: '1px solid var(--afp-border)', borderRadius: 10,
      overflow: 'hidden', background: '#fff',
    }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--afp-blue), var(--afp-teal))',
        padding: '1.5rem', textAlign: 'center', color: '#fff',
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 0.75rem', fontSize: '1.5rem', fontWeight: 700,
        }}>
          {initials}
        </div>
        <div style={{ fontWeight: 700 }}>{name}</div>
        <div style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>{role}</div>
      </div>
      <nav style={{ padding: '0.5rem' }}>
        <Link href={`/${locale}/dashboard`} style={{
          display: 'block', padding: '0.75rem 1rem',
          borderRadius: 6, fontSize: '0.9rem', color: 'var(--afp-text)',
        }}>
          {profileLabel}
        </Link>
        <a href="#my-events" style={{
          display: 'block', padding: '0.75rem 1rem',
          borderRadius: 6, fontSize: '0.9rem', color: 'var(--afp-text)',
        }}>
          {eventsLabel}
        </a>
        <Link href={`/${locale}/dashboard/password`} style={{
          display: 'block', padding: '0.75rem 1rem',
          borderRadius: 6, fontSize: '0.9rem', color: 'var(--afp-text)',
        }}>
          {locale === 'ru' ? 'Сменить пароль' : 'Change password'}
        </Link>
        {adminLabel && (
          <Link href={`/${locale}/admin`} style={{
            display: 'block', padding: '0.75rem 1rem',
            borderRadius: 6, fontSize: '0.9rem', color: 'var(--afp-text)',
          }}>
            {adminLabel}
          </Link>
        )}
        <button onClick={handleLogout} style={{
          display: 'block', width: '100%', textAlign: 'left',
          padding: '0.75rem 1rem', borderRadius: 6, fontSize: '0.9rem',
          color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer',
        }}>
          {logoutLabel}
        </button>
      </nav>
    </div>
  )
}

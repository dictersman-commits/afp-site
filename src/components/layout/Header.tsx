'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { type Locale, getDict } from '@/lib/i18n'

interface HeaderProps {
  locale: Locale
}

export default function Header({ locale }: HeaderProps) {
  const t = getDict(locale)
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const otherLocale = locale === 'ru' ? 'en' : 'ru'
  const localizedPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  const navLinks = [
    { href: `/${locale}`, label: t.nav.home },
    { href: `/${locale}/about`, label: t.nav.about },
    { href: `/${locale}/catalog`, label: t.nav.catalog },
    { href: `/${locale}/events`, label: t.nav.events },
    { href: `/${locale}/library`, label: t.nav.library },
    { href: `/${locale}/courses`, label: t.nav.courses },
    { href: `/${locale}/news`, label: t.nav.news },
    { href: `/${locale}/contacts`, label: t.nav.contacts },
  ]

  async function handleSignOut() {
    await signOut({ redirect: false })
    router.push(`/${locale}`)
    router.refresh()
  }

  return (
    <header style={{ background: 'var(--afp-blue)', color: '#fff' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Top bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 0', gap: '1rem',
        }}>
          {/* Logo */}
          <Link href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <span style={{ color: 'var(--afp-blue)', fontWeight: 700, fontSize: 14 }}>АФП</span>
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1rem', lineHeight: 1.2 }}>
                {locale === 'ru' ? 'Азиатская Федерация Психологов' : 'Asian Federation of Psychologists'}
              </div>
              <div style={{ fontSize: '0.7rem', opacity: 0.75 }}>asianpsyche.org</div>
            </div>
          </Link>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* Lang switcher */}
            <Link href={localizedPath} style={{
              padding: '0.3rem 0.75rem', border: '1px solid rgba(255,255,255,0.4)',
              borderRadius: 4, fontSize: '0.8rem', fontWeight: 600, color: '#fff',
            }}>
              {otherLocale.toUpperCase()}
            </Link>

            {status === 'loading' ? null : session ? (
              <>
                <Link href={`/${locale}/dashboard`} style={{
                  padding: '0.4rem 1rem', fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 4, color: '#fff',
                  whiteSpace: 'nowrap',
                }}>
                  {t.nav.dashboard}
                </Link>
                <button onClick={handleSignOut} style={{
                  padding: '0.4rem 1rem', fontSize: '0.85rem',
                  background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: 4, color: '#fff', cursor: 'pointer', whiteSpace: 'nowrap',
                }}>
                  {locale === 'ru' ? 'Выйти' : 'Sign out'}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`} style={{
                  padding: '0.4rem 1rem', fontSize: '0.85rem',
                  border: '1px solid rgba(255,255,255,0.6)', borderRadius: 4, color: '#fff',
                }}>
                  {t.nav.login}
                </Link>
                <Link href={`/${locale}/auth/register`} style={{
                  padding: '0.4rem 1.2rem', fontSize: '0.85rem',
                  background: '#fff', color: 'var(--afp-blue)',
                  borderRadius: 4, fontWeight: 700,
                }}>
                  {t.nav.register}
                </Link>
              </>
            )}

            {/* Burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none', background: 'none', border: 'none',
                color: '#fff', cursor: 'pointer', padding: 4,
              }}
              className="burger-btn"
              aria-label="Меню"
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen
                  ? <><line x1="4" y1="4" x2="20" y2="20"/><line x1="20" y1="4" x2="4" y2="20"/></>
                  : <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
                }
              </svg>
            </button>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingBottom: '0.5rem' }}>
          <ul style={{ display: 'flex', gap: 0, listStyle: 'none', margin: 0, padding: 0, flexWrap: 'wrap' }}>
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href
              return (
                <li key={href}>
                  <Link href={href} style={{
                    display: 'block',
                    padding: '0.6rem 0.9rem',
                    fontSize: '0.875rem',
                    fontWeight: isActive ? 700 : 400,
                    borderBottom: isActive ? '2px solid #fff' : '2px solid transparent',
                    opacity: isActive ? 1 : 0.85,
                    transition: 'opacity 0.15s',
                  }}>
                    {label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          background: 'var(--afp-blue)', borderTop: '1px solid rgba(255,255,255,0.15)',
          padding: '1rem 1.5rem',
        }}>
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
              display: 'block', padding: '0.75rem 0',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.95rem',
            }}>
              {label}
            </Link>
          ))}
          {session ? (
            <>
              <Link href={`/${locale}/dashboard`} onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.95rem',
              }}>
                {t.nav.dashboard}
              </Link>
              <button onClick={() => { setMenuOpen(false); handleSignOut() }} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '0.75rem 0', background: 'none', border: 'none',
                color: '#fff', fontSize: '0.95rem', cursor: 'pointer',
              }}>
                {locale === 'ru' ? 'Выйти' : 'Sign out'}
              </button>
            </>
          ) : (
            <>
              <Link href={`/${locale}/auth/login`} onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '0.75rem 0',
                borderBottom: '1px solid rgba(255,255,255,0.1)', fontSize: '0.95rem',
              }}>
                {t.nav.login}
              </Link>
              <Link href={`/${locale}/auth/register`} onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '0.75rem 0', fontSize: '0.95rem',
              }}>
                {t.nav.register}
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { type Locale, getDict } from '@/lib/i18n'

export default function Header({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: session, status } = useSession()

  const otherLocale = locale === 'ru' ? 'en' : 'ru'
  const localizedPath = pathname.replace(`/${locale}`, `/${otherLocale}`)

  const navLinks = [
    { href: `/${locale}`,          label: t.nav.home },
    { href: `/${locale}/about`,    label: t.nav.about },
    { href: `/${locale}/catalog`,  label: t.nav.catalog },
    { href: `/${locale}/events`,   label: t.nav.events },
    { href: `/${locale}/library`,  label: t.nav.library },
    { href: `/${locale}/courses`,  label: t.nav.courses },
    { href: `/${locale}/news`,     label: t.nav.news },
    { href: `/${locale}/contacts`, label: t.nav.contacts },
  ]

  async function handleSignOut() {
    await signOut({ redirect: false })
    router.push(`/${locale}`)
    router.refresh()
  }

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid var(--afp-border)', position: 'sticky', top: 0, zIndex: 100 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, gap: '1rem' }}>

          {/* Logo */}
          <Link href={`/${locale}`} style={{
            display: 'flex', alignItems: 'center', flexShrink: 0,
          }} aria-label="АФП — asianpsyche.org">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-afp.gif" alt="Asian Federation for Psychotherapy" style={{ height: 44, width: 'auto', display: 'block' }} />
          </Link>

          {/* Nav */}
          <nav style={{ display: 'flex', gap: 0, flex: 1, justifyContent: 'center' }}>
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href
              return (
                <Link key={href} href={href} style={{
                  padding: '0 0.65rem',
                  fontSize: '0.8rem',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--afp-dark)' : 'var(--afp-muted)',
                  whiteSpace: 'nowrap',
                  borderBottom: isActive ? '2px solid var(--afp-dark)' : '2px solid transparent',
                  lineHeight: '56px',
                }}>
                  {label}
                </Link>
              )
            })}
          </nav>

          {/* Right */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {status !== 'loading' && session && (
              <div className="desktop-auth" style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/${locale}/dashboard`} style={{
                  fontSize: '0.8rem', color: 'var(--afp-muted)', padding: '0.35rem 0.75rem',
                  border: '1px solid var(--afp-border)', borderRadius: 6,
                }}>
                  {t.nav.dashboard}
                </Link>
                <button onClick={handleSignOut} style={{
                  fontSize: '0.8rem', color: 'var(--afp-muted)', padding: '0.35rem 0.75rem',
                  border: '1px solid var(--afp-border)', borderRadius: 6,
                  background: 'none', cursor: 'pointer',
                }}>
                  {locale === 'ru' ? 'Выйти' : 'Sign out'}
                </button>
              </div>
            )}

            {status !== 'loading' && !session && (
              <div className="desktop-auth" style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href={`/${locale}/auth/login`} style={{
                  fontSize: '0.8rem', color: 'var(--afp-muted)', padding: '0.35rem 0.75rem',
                  border: '1px solid var(--afp-border)', borderRadius: 6,
                }}>
                  {t.nav.login}
                </Link>
                <Link href={`/${locale}/auth/register`} style={{
                  fontSize: '0.8rem', color: '#fff', padding: '0.35rem 0.85rem',
                  background: 'var(--afp-blue)', borderRadius: 6, fontWeight: 600,
                }}>
                  {t.nav.register}
                </Link>
              </div>
            )}

            {/* Lang switcher */}
            <Link href={localizedPath} style={{
              padding: '0.3rem 0.7rem', border: '1.5px solid var(--afp-dark)',
              borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
              color: 'var(--afp-dark)',
            }}>
              {otherLocale.toUpperCase()}
            </Link>

            {/* Burger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="burger-btn"
              style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
              aria-label="Меню"
            >
              <svg width="22" height="22" fill="none" stroke="var(--afp-dark)" strokeWidth="2">
                {menuOpen
                  ? <><line x1="4" y1="4" x2="18" y2="18"/><line x1="18" y1="4" x2="4" y2="18"/></>
                  : <><line x1="3" y1="6" x2="19" y2="6"/><line x1="3" y1="11" x2="19" y2="11"/><line x1="3" y1="16" x2="19" y2="16"/></>
                }
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: 'fixed', inset: 0, top: 56,
              background: 'rgba(0,0,0,0.35)',
              zIndex: 99,
            }}
          />
          {/* Drawer */}
          <div style={{
            position: 'fixed', top: 56, left: 0, right: 0,
            background: '#fff',
            borderBottom: '1px solid var(--afp-border)',
            padding: '0.5rem 1.5rem 1.5rem',
            zIndex: 100,
            maxHeight: 'calc(100vh - 56px)',
            overflowY: 'auto',
          }}>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)} style={{
                display: 'block', padding: '0.75rem 0',
                borderBottom: '1px solid var(--afp-border)',
                fontSize: '1rem', color: 'var(--afp-text)',
              }}>
                {label}
              </Link>
            ))}
            {session ? (
              <>
                <Link href={`/${locale}/dashboard`} onClick={() => setMenuOpen(false)} style={{
                  display: 'block', padding: '0.75rem 0',
                  borderBottom: '1px solid var(--afp-border)', fontSize: '1rem',
                }}>
                  {t.nav.dashboard}
                </Link>
                <button onClick={() => { setMenuOpen(false); handleSignOut() }} style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '0.75rem 0',
                  background: 'none', border: 'none', color: '#c0392b', fontSize: '1rem', cursor: 'pointer',
                }}>
                  {locale === 'ru' ? 'Выйти' : 'Sign out'}
                </button>
              </>
            ) : (
              <>
                <Link href={`/${locale}/auth/login`} onClick={() => setMenuOpen(false)} style={{
                  display: 'block', padding: '0.75rem 0',
                  borderBottom: '1px solid var(--afp-border)', fontSize: '1rem',
                }}>
                  {t.nav.login}
                </Link>
                <Link href={`/${locale}/auth/register`} onClick={() => setMenuOpen(false)} style={{
                  display: 'block', padding: '0.75rem 0', fontSize: '1rem',
                  color: 'var(--afp-green)', fontWeight: 600,
                }}>
                  {t.nav.register}
                </Link>
              </>
            )}
          </div>
        </>
      )}
    </header>
  )
}

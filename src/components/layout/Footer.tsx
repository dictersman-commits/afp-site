import Link from 'next/link'
import { type Locale, getDict } from '@/lib/i18n'

interface FooterProps {
  locale: Locale
}

export default function Footer({ locale }: FooterProps) {
  const t = getDict(locale)

  return (
    <footer style={{
      background: 'var(--afp-blue)', color: '#fff',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {t.footer.tagline}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>asianpsyche.org</div>
          </div>

          {/* Navigation */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              {locale === 'ru' ? 'Разделы' : 'Sections'}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { href: `/${locale}/about`, label: t.nav.about },
                { href: `/${locale}/catalog`, label: t.nav.catalog },
                { href: `/${locale}/events`, label: t.nav.events },
                { href: `/${locale}/library`, label: t.nav.library },
                { href: `/${locale}/courses`, label: t.nav.courses },
                { href: `/${locale}/news`, label: t.nav.news },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              {t.footer.socials}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'VK', href: '#' },
                { label: 'Telegram', href: '#' },
                { label: 'YouTube', href: '#' },
                { label: 'Instagram', href: '#' },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{
                  padding: '0.3rem 0.8rem', border: '1px solid rgba(255,255,255,0.4)',
                  borderRadius: 4, fontSize: '0.8rem', opacity: 0.85,
                }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.9rem' }}>
              {t.contacts.title}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.8, lineHeight: 1.8 }}>
              <div>info@asianpsyche.org</div>
              <Link href={`/${locale}/contacts`} style={{ opacity: 0.7, fontSize: '0.8rem' }}>
                {locale === 'ru' ? 'Написать нам' : 'Contact us'} →
              </Link>
            </div>
          </div>
        </div>

        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.15)',
          paddingTop: '1rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.5rem',
          fontSize: '0.8rem', opacity: 0.6,
        }}>
          <span>© {new Date().getFullYear()} {t.footer.tagline}. {t.footer.rights}.</span>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href={`/${locale === 'ru' ? 'en' : 'ru'}`}>
              {locale === 'ru' ? 'English' : 'Русский'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

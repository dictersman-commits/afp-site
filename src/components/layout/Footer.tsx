import Link from 'next/link'
import { type Locale, getDict } from '@/lib/i18n'

export default function Footer({ locale }: { locale: Locale }) {
  const t = getDict(locale)
  const isRu = locale === 'ru'

  return (
    <footer style={{ background: 'var(--afp-dark)', color: '#fff', marginTop: 'auto' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '3rem 1.5rem 1.5rem' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
          gap: '2rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand */}
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
              {t.footer.tagline}
            </div>
            <div style={{ fontSize: '0.8rem', opacity: 0.5, marginBottom: '1.5rem' }}>asianpsyche.org</div>
          </div>

          {/* Sections */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.85rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {isRu ? 'Разделы' : 'Sections'}
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: `/${locale}/about`,   label: t.nav.about },
                { href: `/${locale}/catalog`, label: t.nav.catalog },
                { href: `/${locale}/events`,  label: t.nav.events },
                { href: `/${locale}/library`, label: t.nav.library },
                { href: `/${locale}/courses`, label: t.nav.courses },
                { href: `/${locale}/news`,    label: t.nav.news },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ fontSize: '0.875rem', opacity: 0.75 }}>{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.85rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t.footer.socials}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { label: 'VK',        href: '#' },
                { label: 'Telegram',  href: '#' },
                { label: 'YouTube',   href: '#' },
                { label: 'Instagram', href: '#' },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{ fontSize: '0.875rem', opacity: 0.75 }}>
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Contacts */}
          <div>
            <div style={{ fontWeight: 600, marginBottom: '1rem', fontSize: '0.85rem', opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {t.contacts.title}
            </div>
            <div style={{ fontSize: '0.875rem', opacity: 0.75, lineHeight: 1.8 }}>
              <div>info@asianpsyche.org</div>
            </div>
            <Link href={`/${locale}/contacts`} style={{
              display: 'inline-block', marginTop: '1rem',
              padding: '0.5rem 1rem', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: 8, fontSize: '0.8rem', fontWeight: 600,
            }}>
              {isRu ? 'Написать нам →' : 'Contact us →'}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1.25rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: '0.5rem',
          fontSize: '0.8rem', opacity: 0.45,
        }}>
          <span>© {new Date().getFullYear()} {t.footer.tagline}. {t.footer.rights}.</span>
          <Link href={`/${locale === 'ru' ? 'en' : 'ru'}`}>
            {isRu ? 'English' : 'Русский'}
          </Link>
        </div>
      </div>
    </footer>
  )
}

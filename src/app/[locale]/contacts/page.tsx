import type { Metadata } from 'next'
import { type Locale, getDict } from '@/lib/i18n'
import ContactForm from '@/components/contacts/ContactForm'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ru' ? 'Контакты' : 'Contacts',
    description: locale === 'ru'
      ? 'Свяжитесь с Азиатской Федерацией Психологов. Форма обратной связи, соцсети.'
      : 'Contact the Asian Federation of Psychologists. Feedback form and social media.',
  }
}

export default async function ContactsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '2.5rem' }}>
        {t.contacts.title}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        <div>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', color: 'var(--afp-blue)' }}>{t.contacts.email}</h3>
            <a href="mailto:info@asianpsyche.org" style={{ color: 'var(--afp-teal)', fontWeight: 500 }}>
              info@asianpsyche.org
            </a>
          </div>
          <div>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--afp-blue)' }}>{t.footer.socials}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'VK', href: '#', desc: locale === 'ru' ? 'Новости и публикации' : 'News and publications' },
                { label: 'Telegram', href: '#', desc: locale === 'ru' ? 'Оперативные новости' : 'Quick updates' },
                { label: 'YouTube', href: '#', desc: locale === 'ru' ? 'Видео и вебинары' : 'Videos and webinars' },
                { label: 'Instagram', href: '#', desc: locale === 'ru' ? 'Фото и анонсы' : 'Photos and announcements' },
              ].map(({ label, href, desc }) => (
                <a key={label} href={href} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '0.75rem 1rem', border: '1px solid var(--afp-border)',
                  borderRadius: 8, background: '#fff',
                }}>
                  <span style={{ fontWeight: 700, color: 'var(--afp-blue)', minWidth: 80 }}>{label}</span>
                  <span style={{ color: 'var(--afp-muted)', fontSize: '0.85rem' }}>{desc}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <ContactForm locale={locale} />
      </div>
    </div>
  )
}

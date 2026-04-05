'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface Article {
  id: string
  slug: string
  titleRu: string
  titleEn: string | null
  authorName: string | null
  country: string
  tags: string[]
  createdAt: Date
}

interface Props {
  articles: Article[]
  locale: string
  t: {
    library: { filter_country: string; filter_tag: string; all: string; no_articles: string }
    countries: Record<string, string>
  }
}

export default function LibraryClient({ articles, locale, t }: Props) {
  const [country, setCountry] = useState('')
  const [tag, setTag] = useState('')
  const [search, setSearch] = useState('')

  const countries = [...new Set(articles.map(a => a.country))].sort()
  const tags = [...new Set(articles.flatMap(a => a.tags))].sort()

  const filtered = useMemo(() => articles.filter(a => {
    if (country && a.country !== country) return false
    if (tag && !a.tags.includes(tag)) return false
    if (search) {
      const q = search.toLowerCase()
      const title = (locale === 'ru' ? a.titleRu : (a.titleEn ?? a.titleRu)).toLowerCase()
      if (!title.includes(q) && !(a.authorName ?? '').toLowerCase().includes(q)) return false
    }
    return true
  }), [articles, country, tag, search, locale])

  const selectStyle = {
    padding: '0.6rem 1rem', border: '1px solid var(--afp-border)',
    borderRadius: 6, fontSize: '0.9rem', background: '#fff',
  }

  return (
    <>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <input
          type="text" value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={locale === 'ru' ? 'Поиск по названию или автору...' : 'Search by title or author...'}
          style={{ flex: 1, minWidth: 200, padding: '0.6rem 1rem', border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem' }}
        />
        <select value={country} onChange={e => setCountry(e.target.value)} style={selectStyle}>
          <option value="">{t.library.filter_country}: {t.library.all}</option>
          {countries.map(c => <option key={c} value={c}>{t.countries[c] ?? c}</option>)}
        </select>
        <select value={tag} onChange={e => setTag(e.target.value)} style={selectStyle}>
          <option value="">{t.library.filter_tag}: {t.library.all}</option>
          {tags.map(tg => <option key={tg} value={tg}>{tg}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--afp-muted)', padding: '3rem' }}>{t.library.no_articles}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(a => {
            const title = locale === 'ru' ? a.titleRu : (a.titleEn ?? a.titleRu)
            return (
              <div key={a.id} style={{
                border: '1px solid var(--afp-border)', borderRadius: 8,
                padding: '1.25rem', background: '#fff',
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: 600, marginBottom: '0.4rem', lineHeight: 1.4 }}>{title}</h3>
                  <p style={{ color: 'var(--afp-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    {a.authorName && <>{a.authorName} · </>}
                    {t.countries[a.country] ?? a.country} · {new Date(a.createdAt).getFullYear()}
                  </p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {a.tags.map(tg => (
                      <span key={tg} style={{
                        background: 'var(--afp-bg)', padding: '0.15rem 0.6rem',
                        borderRadius: 12, fontSize: '0.75rem', color: 'var(--afp-teal)',
                        border: '1px solid var(--afp-border)',
                      }}>{tg}</span>
                    ))}
                  </div>
                </div>
                <Link href={`/${locale}/library/${a.slug}`} style={{
                  padding: '0.4rem 1rem', border: '1px solid var(--afp-blue)',
                  borderRadius: 6, color: 'var(--afp-blue)', fontSize: '0.85rem',
                  fontWeight: 600, flexShrink: 0,
                }}>
                  {locale === 'ru' ? 'Читать' : 'Read'}
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

'use client'

import { useState, useMemo } from 'react'

interface Member {
  id: string
  firstName: string
  lastName: string
  specialization: string[]
  country: string
  city: string | null
  bio: string | null
  website: string | null
  photo: string | null
}

interface Props {
  members: Member[]
  locale: string
  t: {
    catalog: {
      search: string
      filter_country: string
      filter_spec: string
      all: string
      no_results: string
    }
    countries: Record<string, string>
  }
}

export default function CatalogClient({ members, locale, t }: Props) {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('')
  const [spec, setSpec] = useState('')

  const countries = [...new Set(members.map(m => m.country))].sort()
  const specs = [...new Set(members.flatMap(m => m.specialization))].sort()

  const filtered = useMemo(() => {
    return members.filter(m => {
      if (country && m.country !== country) return false
      if (spec && !m.specialization.includes(spec)) return false
      if (search) {
        const q = search.toLowerCase()
        const name = `${m.firstName} ${m.lastName}`.toLowerCase()
        const specStr = m.specialization.join(' ').toLowerCase()
        if (!name.includes(q) && !specStr.includes(q)) return false
      }
      return true
    })
  }, [members, country, spec, search])

  return (
    <>
      {/* Filters */}
      <div style={{
        display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem',
        background: 'var(--afp-bg)', padding: '1.25rem', borderRadius: 8,
      }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t.catalog.search}
          style={{
            flex: 1, minWidth: 220, padding: '0.6rem 1rem',
            border: '1px solid var(--afp-border)', borderRadius: 6, fontSize: '0.9rem',
          }}
        />
        <select
          value={country}
          onChange={e => setCountry(e.target.value)}
          style={{
            padding: '0.6rem 1rem', border: '1px solid var(--afp-border)',
            borderRadius: 6, fontSize: '0.9rem', background: '#fff',
          }}
        >
          <option value="">{t.catalog.filter_country}: {t.catalog.all}</option>
          {countries.map(c => (
            <option key={c} value={c}>{t.countries[c] ?? c}</option>
          ))}
        </select>
        <select
          value={spec}
          onChange={e => setSpec(e.target.value)}
          style={{
            padding: '0.6rem 1rem', border: '1px solid var(--afp-border)',
            borderRadius: 6, fontSize: '0.9rem', background: '#fff',
          }}
        >
          <option value="">{t.catalog.filter_spec}: {t.catalog.all}</option>
          {specs.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Count */}
      <p style={{ color: 'var(--afp-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        {locale === 'ru' ? `Найдено: ${filtered.length}` : `Found: ${filtered.length}`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'var(--afp-muted)', padding: '3rem' }}>
          {t.catalog.no_results}
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {filtered.map(m => (
            <div key={m.id} style={{
              border: '1px solid var(--afp-border)', borderRadius: 10,
              overflow: 'hidden', background: '#fff',
              display: 'flex', flexDirection: 'column',
            }}>
              <div style={{
                background: 'linear-gradient(135deg, var(--afp-blue), var(--afp-teal))',
                height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.photo}
                    alt={`${m.firstName} ${m.lastName}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: 80, height: 80, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '2rem', fontWeight: 700, color: '#fff',
                  }}>
                    {m.firstName[0]}{m.lastName[0]}
                  </div>
                )}
              </div>
              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ fontWeight: 700, marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {m.firstName} {m.lastName}
                </h3>
                <p style={{ color: 'var(--afp-muted)', fontSize: '0.85rem', marginBottom: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t.countries[m.country] ?? m.country}{m.city ? `, ${m.city}` : ''}
                </p>
                <p style={{
                  color: 'var(--afp-text)', fontSize: '0.85rem', lineHeight: 1.5,
                  marginBottom: '0.75rem', height: '3.9em',
                  overflow: 'hidden', display: '-webkit-box',
                  WebkitLineClamp: 3, WebkitBoxOrient: 'vertical',
                }}>
                  {m.bio ?? ''}
                </p>
                <div style={{ height: '2.5rem', overflow: 'hidden', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem', alignContent: 'flex-start' }}>
                  {m.specialization.map(s => (
                    <span key={s} style={{
                      background: 'var(--afp-bg)', padding: '0.2rem 0.6rem',
                      borderRadius: 12, fontSize: '0.75rem', color: 'var(--afp-blue)',
                      border: '1px solid var(--afp-border)', whiteSpace: 'nowrap',
                    }}>
                      {s}
                    </span>
                  ))}
                </div>
                <a href={`/${locale}/catalog/${m.id}`} style={{
                  display: 'block', textAlign: 'center', padding: '0.5rem',
                  border: '1px solid var(--afp-blue)', borderRadius: 6,
                  color: 'var(--afp-blue)', fontWeight: 600, fontSize: '0.85rem',
                  marginTop: 'auto',
                }}>
                  {locale === 'ru' ? 'Открыть профиль' : 'View profile'}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

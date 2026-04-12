import type { Metadata } from 'next'
import { type Locale, getDict } from '@/lib/i18n'
import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params
  return {
    title: locale === 'ru' ? 'О федерации' : 'About the Federation',
    description: locale === 'ru'
      ? 'История, миссия и структура Азиатской Федерации Психологов. Членство во Всемирном совете по психотерапии.'
      : 'History, mission and structure of the Asian Federation of Psychologists. Member of the World Council for Psychotherapy.',
  }
}

const COUNCIL = [
  { nameRu: 'Виктор Макаров',          nameEn: 'Viktor Makarov',          roleRu: 'Председатель Совета',  roleEn: 'Chairman of the Council', countryRu: 'Россия',    countryEn: 'Russia' },
  { nameRu: 'Шанкар Гаутам',           nameEn: 'G. Shankar Gautam',       roleRu: 'Вице-президент',       roleEn: 'Vice-President',          countryRu: 'Индия',     countryEn: 'India' },
  { nameRu: 'Гударзи',                 nameEn: 'Goodarzi',                roleRu: 'Вице-президент',       roleEn: 'Vice-President',          countryRu: 'Иран',      countryEn: 'Iran' },
  { nameRu: 'Цян Мин Юэ',             nameEn: 'Qian Ming Yue',           roleRu: 'Вице-президент',       roleEn: 'Vice-President',          countryRu: 'Китай',     countryEn: 'China' },
  { nameRu: 'Саски Йосинори',          nameEn: 'Sasaki Yoshinori',        roleRu: 'Вице-президент',       roleEn: 'Vice-President',          countryRu: 'Япония',    countryEn: 'Japan' },
  { nameRu: 'Эдвард Чан',             nameEn: 'Edward Chan',             roleRu: 'Вице-президент',       roleEn: 'Vice-President',          countryRu: 'Гонконг',   countryEn: 'Hong Kong' },
  { nameRu: 'Чжао Сюйдун',            nameEn: 'Zhao Xudong',             roleRu: 'Вице-президент',       roleEn: 'Vice-President',          countryRu: 'Китай',     countryEn: 'China' },
]

const COUNTRIES_RU = ['Россия', 'Казахстан', 'Узбекистан', 'Кыргызия', 'Таджикистан', 'Монголия', 'Китай', 'Иран', 'ОАЭ', 'Саудовская Аравия']
const COUNTRIES_EN = ['Russia', 'Kazakhstan', 'Uzbekistan', 'Kyrgyzstan', 'Tajikistan', 'Mongolia', 'China', 'Iran', 'UAE', 'Saudi Arabia']

const GOALS_RU = [
  'Объединение психологов и психотерапевтов азиатского региона',
  'Повышение стандартов психологической помощи населению',
  'Развитие международного научного сотрудничества',
  'Организация конференций и образовательных мероприятий',
  'Интеграция специалистов в мировое профессиональное сообщество',
  'Поддержка исследований в области психического здоровья',
]

const GOALS_EN = [
  'Uniting psychologists and psychotherapists across the Asian region',
  'Raising standards of psychological care for the population',
  'Developing international scientific cooperation',
  'Organizing conferences and educational events',
  'Integrating specialists into the global professional community',
  'Supporting research in the field of mental health',
]

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const t = getDict(locale)
  const isRu = locale === 'ru'

  const [membersCount, eventsCount] = await Promise.all([
    prisma.member.count({ where: { isPublic: true } }),
    prisma.event.count({ where: { published: true } }),
  ])

  const countries = isRu ? COUNTRIES_RU : COUNTRIES_EN
  const goals = isRu ? GOALS_RU : GOALS_EN

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.5rem' }}>
        {t.about.title}
      </h1>
      <p style={{ color: 'var(--afp-muted)', marginBottom: '3rem' }}>
        {isRu ? 'Международная профессиональная организация психологов и психотерапевтов Азии' : 'International professional organization of psychologists and psychotherapists of Asia'}
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '3rem' }}>
        {[
          { value: `${membersCount}+`, label: isRu ? 'Членов федерации' : 'Federation members' },
          { value: `${countries.length}`, label: isRu ? 'Стран присутствия' : 'Countries' },
          { value: `${eventsCount}+`, label: isRu ? 'Мероприятий' : 'Events' },
        ].map(({ value, label }) => (
          <div key={label} style={{
            background: '#fff', border: '1px solid var(--afp-border)',
            borderRadius: 10, padding: '1.5rem', textAlign: 'center',
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--afp-blue)' }}>{value}</div>
            <div style={{ color: 'var(--afp-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Mission */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1rem' }}>
          {t.about.mission_title}
        </h2>
        <p style={{ lineHeight: 1.8, color: 'var(--afp-text)', fontSize: '1rem', marginBottom: '1rem' }}>
          {isRu
            ? 'Азиатская Федерация Психологов (АФП) — международная профессиональная организация, объединяющая психологов, психотерапевтов и специалистов в области психического здоровья из стран Азии и СНГ.'
            : 'The Asian Federation of Psychologists (AFP) is an international professional organization uniting psychologists, psychotherapists, and mental health professionals from Asian and CIS countries.'}
        </p>
        <p style={{ lineHeight: 1.8, color: 'var(--afp-text)', fontSize: '1rem' }}>
          {isRu
            ? 'Федерация создана с целью обмена профессиональным опытом, развития науки и повышения стандартов психологической помощи населению. Мы способствуем интеграции азиатских специалистов в мировое профессиональное сообщество и поддерживаем актуальные исследования в области психического здоровья.'
            : 'The Federation was established to exchange professional experience, develop science, and raise the standards of psychological care. We facilitate the integration of Asian specialists into the global professional community and support current mental health research.'}
        </p>
      </section>

      {/* Goals */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1.25rem' }}>
          {isRu ? 'Цели и задачи' : 'Goals and objectives'}
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {goals.map((goal, i) => (
            <div key={i} style={{
              display: 'flex', gap: '1rem', alignItems: 'flex-start',
              background: '#fff', border: '1px solid var(--afp-border)',
              borderRadius: 8, padding: '1rem 1.25rem',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                background: 'linear-gradient(135deg, var(--afp-blue), var(--afp-teal))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: '0.8rem', fontWeight: 700,
              }}>
                {i + 1}
              </div>
              <p style={{ lineHeight: 1.6, color: 'var(--afp-text)', margin: 0 }}>{goal}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Countries */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1.25rem' }}>
          {isRu ? 'Страны присутствия' : 'Countries of presence'}
        </h2>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: '0.75rem',
        }}>
          {countries.map(country => (
            <div key={country} style={{
              background: 'var(--afp-bg)', padding: '0.75rem 1rem',
              borderRadius: 8, fontSize: '0.9rem', fontWeight: 600,
              borderLeft: '3px solid var(--afp-teal)', color: 'var(--afp-text)',
            }}>
              {country}
            </div>
          ))}
        </div>
      </section>

      {/* Council */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1.25rem' }}>
          {isRu ? 'Совет федерации' : 'Federation Council'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
          {COUNCIL.map((member, i) => (
            <div key={i} style={{
              background: '#fff', border: '1px solid var(--afp-border)',
              borderRadius: 10, padding: '1.25rem',
              display: 'flex', flexDirection: 'column', gap: '0.4rem',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: i === 0 ? 'var(--afp-dark)' : 'var(--afp-green-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: '1rem',
                color: i === 0 ? '#fff' : 'var(--afp-dark)',
                marginBottom: '0.5rem',
              }}>
                {(isRu ? member.nameRu : member.nameEn).charAt(0)}
              </div>
              <div style={{ fontWeight: 700, color: 'var(--afp-dark)', fontSize: '0.95rem', lineHeight: 1.3 }}>
                {isRu ? member.nameRu : member.nameEn}
              </div>
              <div style={{ color: 'var(--afp-muted)', fontSize: '0.8rem' }}>
                {isRu ? member.roleRu : member.roleEn}
              </div>
              <div style={{
                display: 'inline-block', marginTop: '0.25rem',
                fontSize: '0.75rem', fontWeight: 600,
                color: 'var(--afp-green)', borderLeft: '2px solid var(--afp-green)',
                paddingLeft: '0.5rem',
              }}>
                {isRu ? member.countryRu : member.countryEn}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Membership benefits */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '1.25rem' }}>
          {isRu ? 'Членство в АФП' : 'AFP Membership'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          {(isRu ? [
            { title: 'Профессиональный профиль', desc: 'Личная страница в каталоге специалистов, видимая всем пользователям сайта' },
            { title: 'Льготы на мероприятия', desc: 'Скидки и приоритетный доступ к конференциям и вебинарам федерации' },
            { title: 'Научная библиотека', desc: 'Доступ к профессиональным статьям и исследованиям от коллег из Азии' },
            { title: 'Международная сеть', desc: 'Нетворкинг с психологами и психотерапевтами из 10+ стран региона' },
          ] : [
            { title: 'Professional profile', desc: 'Personal page in the specialist catalog, visible to all site users' },
            { title: 'Event discounts', desc: 'Discounts and priority access to federation conferences and webinars' },
            { title: 'Scientific library', desc: 'Access to professional articles and research from colleagues across Asia' },
            { title: 'International network', desc: 'Networking with psychologists and psychotherapists from 10+ countries' },
          ]).map(({ title, desc }) => (
            <div key={title} style={{
              background: '#fff', border: '1px solid var(--afp-border)',
              borderRadius: 10, padding: '1.25rem',
            }}>
              <div style={{ fontWeight: 700, color: 'var(--afp-blue)', marginBottom: '0.5rem' }}>{title}</div>
              <p style={{ color: 'var(--afp-muted)', fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* World Council */}
      <section style={{
        background: 'linear-gradient(135deg, var(--afp-blue), var(--afp-teal))',
        borderRadius: 12, padding: '2rem', color: '#fff',
      }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '1rem' }}>
          {t.about.council_title}
        </h2>
        <p style={{ lineHeight: 1.8, opacity: 0.9, margin: 0 }}>
          {isRu
            ? 'АФП является ассоциированным членом Всемирного совета по психотерапии (ВСП) — ведущей международной организации, устанавливающей стандарты психотерапевтической практики по всему миру. Членство в АФП открывает возможности для участия в международных программах, признания квалификации и получения сертификатов международного образца.'
            : 'AFP is an associated member of the World Council for Psychotherapy (WCP) — the leading international organization establishing psychotherapy practice standards worldwide. AFP membership opens opportunities to participate in international programs, have qualifications recognized, and obtain internationally recognized certificates.'}
        </p>
      </section>
    </div>
  )
}

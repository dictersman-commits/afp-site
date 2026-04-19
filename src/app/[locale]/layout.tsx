import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/lib/i18n'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Азиатская Федерация Психотерапии',
    template: '%s | АФП',
  },
  description: 'Международная профессиональная организация психологов и психотерапевтов Азии',
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  return (
    <>
      <Header locale={locale as Locale} />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer locale={locale as Locale} />
    </>
  )
}

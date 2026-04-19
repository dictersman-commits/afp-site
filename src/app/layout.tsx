import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Providers from '@/components/Providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
  title: 'Азиатская Федерация Психотерапии',
  description: 'Международная профессиональная организация психологов и психотерапевтов Азии',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={geistSans.variable}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

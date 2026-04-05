import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type Locale } from '@/lib/i18n'
import AdminNewsForm from '@/components/admin/AdminNewsForm'

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>
}) {
  const { locale, id } = await params
  const session = await auth()
  if ((session?.user as { role?: string })?.role !== 'ADMIN') redirect(`/${locale}/dashboard`)

  const news = id === 'new' ? null : await prisma.news.findUnique({ where: { id } })

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <AdminNewsForm locale={locale} news={news} />
    </div>
  )
}

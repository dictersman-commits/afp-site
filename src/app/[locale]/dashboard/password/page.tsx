import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { type Locale } from '@/lib/i18n'
import PasswordForm from '@/components/dashboard/PasswordForm'

export default async function PasswordPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params
  const session = await auth()
  if (!session?.user?.id) redirect(`/${locale}/auth/login`)

  return (
    <div style={{ maxWidth: 500, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <PasswordForm locale={locale} />
    </div>
  )
}

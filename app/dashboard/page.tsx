import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { lydiaStore } from '@/lib/server-store'
import { DashboardClient } from '@/components/DashboardClient'

export const metadata = {
  title: 'Buyer Dashboard | Lydia Market Kenya',
}

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard')
  }

  const userMeta = session.user as unknown as Record<string, unknown>

  return (
    <DashboardClient
      buyerName={session.user.name || 'Grace Wanjiku'}
      businessName={(userMeta.businessName as string) || 'Wanjiku Retail Mart'}
      county={(userMeta.county as string) || 'Nairobi'}
      serverOrders={lydiaStore.orders}
    />
  )
}

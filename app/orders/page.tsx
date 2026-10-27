import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { OrdersClient } from '@/components/OrdersClient'

export const metadata = {
  title: 'Wholesale Order Basket & Checkout | Lydia Market Kenya',
}

export default async function OrdersPage() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login?callbackUrl=/orders')
  }

  const userMeta = session.user as unknown as Record<string, unknown>

  return (
    <OrdersClient
      defaultCounty={(userMeta.county as string) || 'Nairobi'}
      businessName={(userMeta.businessName as string) || 'Wanjiku Retail Mart'}
    />
  )
}

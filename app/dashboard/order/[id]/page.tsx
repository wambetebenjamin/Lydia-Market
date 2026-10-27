import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { lydiaStore } from '@/lib/server-store'
import { OrderDetailClient } from '@/components/OrderDetailClient'

export const metadata = {
  title: 'Order Detail | Lydia Market Kenya',
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  if (!session?.user) {
    redirect(`/login?callbackUrl=/dashboard/order/${encodeURIComponent(id)}`)
  }

  const found = lydiaStore.orders.find((o) => o.id === id || o.reference === id)

  return <OrderDetailClient orderId={id} initialOrder={found} />
}

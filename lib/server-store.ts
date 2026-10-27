import { INITIAL_ORDERS, type OrderRecord } from '@/lib/data'

export interface BuyerAccount {
  id: string
  businessName: string
  ownerName: string
  email: string
  password: string
  county: string
  phone: string
  businessType: 'Retailer' | 'Wholesaler' | 'Institution'
  createdAt: string
}

interface ServerStore {
  buyers: BuyerAccount[]
  orders: OrderRecord[]
  tradeAccountRequests: Record<string, unknown>[]
  issues: Record<string, unknown>[]
  supplierApplications: Record<string, unknown>[]
  newsletterSubscribers: string[]
  enquiries: Record<string, unknown>[]
}

const globalForLydia = globalThis as unknown as {
  __lydiaServerStore?: ServerStore
}

if (!globalForLydia.__lydiaServerStore) {
  globalForLydia.__lydiaServerStore = {
    buyers: [
      {
        id: 'buyer-demo-001',
        businessName: 'Wanjiku Retail Mart',
        ownerName: 'Grace Wanjiku',
        email: 'buyer@lydiamarket.co.ke',
        password: 'LydiaBuyer2026!',
        county: 'Nairobi',
        phone: '+254712345678',
        businessType: 'Retailer',
        createdAt: '2026-04-12T08:30:00.000Z',
      },
    ],
    orders: [...INITIAL_ORDERS],
    tradeAccountRequests: [],
    issues: [],
    supplierApplications: [],
    newsletterSubscribers: [],
    enquiries: [],
  }
}

export const lydiaStore = globalForLydia.__lydiaServerStore

export async function persistKvRecord(key: string, payload: unknown): Promise<void> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return
  }
  try {
    const { kv } = await import('@vercel/kv')
    await kv.set(key, payload)
  } catch {
    // Graceful fallback to in-memory store when KV endpoint is unreachable
  }
}

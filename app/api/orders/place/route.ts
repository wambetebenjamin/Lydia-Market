import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRecaptchaServer } from '@/lib/recaptcha'
import { lydiaStore, persistKvRecord } from '@/lib/server-store'
import { sendMarketplaceEmail } from '@/lib/mailer'
import { auth } from '@/auth'
import type { OrderRecord } from '@/lib/data'

const orderItemSchema = z.object({
  productSlug: z.string().min(1),
  productName: z.string().min(1),
  supplierSlug: z.string().min(1),
  supplierName: z.string().min(1),
  unitPriceKes: z.number().positive(),
  quantity: z.number().int().positive(),
})

const placeOrderSchema = z.object({
  deliveryAddress: z.string().min(5, 'Enter a full shop or warehouse delivery address'),
  county: z.string().min(2, 'Select a delivery county'),
  deliveryNotes: z.string().max(500).optional().default(''),
  paymentTerms: z.enum(['immediate', '30 days', '60 days']),
  items: z.array(orderItemSchema).min(1, 'Your order basket cannot be empty'),
  recaptchaToken: z.string().optional(),
  recaptchaV2Token: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const captcha = await verifyRecaptchaServer(body.recaptchaToken, body.recaptchaV2Token)
    if (!captcha.ok) {
      return NextResponse.json(
        {
          error: captcha.error || 'Security verification required.',
          requireV2: true,
          score: captcha.score,
        },
        { status: 400 }
      )
    }

    const parsed = placeOrderSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid order details.' },
        { status: 400 }
      )
    }

    const session = await auth()
    const recipientEmail = session?.user?.email || 'buyer@lydiamarket.co.ke'

    const termsLabel =
      parsed.data.paymentTerms === '30 days'
        ? '30 Days Trade Credit'
        : parsed.data.paymentTerms === '60 days'
        ? '60 Days Trade Credit'
        : 'Immediate Settlement'

    const grouped = new Map<string, typeof parsed.data.items>()
    for (const item of parsed.data.items) {
      const list = grouped.get(item.supplierSlug) || []
      list.push(item)
      grouped.set(item.supplierSlug, list)
    }

    const createdOrders: OrderRecord[] = []
    let grandTotalKes = 0

    for (const [supplierSlug, supplierItems] of grouped.entries()) {
      const subtotal = supplierItems.reduce((sum, i) => sum + i.unitPriceKes * i.quantity, 0)
      grandTotalKes += subtotal
      const refNum = Math.floor(8850 + Math.random() * 1100)
      const orderRef = `LM-2026-${refNum}`

      const record: OrderRecord = {
        id: orderRef,
        reference: orderRef,
        supplierSlug,
        supplierName: supplierItems[0].supplierName,
        itemsCount: supplierItems.reduce((s, i) => s + i.quantity, 0),
        totalKes: subtotal,
        status: 'Booked',
        date: new Date().toISOString().slice(0, 10),
        deliveryAddress: parsed.data.deliveryAddress,
        county: parsed.data.county,
        paymentTerms: termsLabel,
        items: supplierItems.map((i) => ({
          productSlug: i.productSlug,
          productName: i.productName,
          quantity: i.quantity,
          unitPriceKes: i.unitPriceKes,
          lineTotalKes: i.unitPriceKes * i.quantity,
        })),
      }

      lydiaStore.orders.unshift(record)
      createdOrders.push(record)
      await persistKvRecord(`order:${record.id}`, record)
    }

    const refsText = createdOrders.map((o) => o.reference).join(', ')
    await sendMarketplaceEmail({
      to: recipientEmail,
      subject: `Lydia Market Order Confirmation (${refsText})`,
      text: `Thank you for your wholesale order on Lydia Market. References: ${refsText}. Grand Total: KES ${grandTotalKes.toLocaleString('en-KE')}. Payment Terms: ${termsLabel}. Delivery County: ${parsed.data.county}.`,
      html: `<h2>Wholesale Order Confirmed</h2><p>References: <strong>${refsText}</strong></p><p>Grand Total: <strong>KES ${grandTotalKes.toLocaleString('en-KE')}</strong></p><p>Payment Terms: <strong>${termsLabel}</strong></p><p>Delivery Address: ${parsed.data.deliveryAddress}, ${parsed.data.county} County</p>`,
    })

    return NextResponse.json({
      success: true,
      orders: createdOrders,
      grandTotalKes,
      message: `Wholesale order confirmed (${refsText}). Confirmation email dispatched.`,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to place wholesale order.' }, { status: 500 })
  }
}

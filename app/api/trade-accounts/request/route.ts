import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRecaptchaServer } from '@/lib/recaptcha'
import { lydiaStore, persistKvRecord } from '@/lib/server-store'
import { sendMarketplaceEmail } from '@/lib/mailer'

const tradeAccountSchema = z.object({
  supplierSlug: z.string().min(1),
  supplierName: z.string().min(1),
  buyerName: z.string().min(2, 'Enter your full name'),
  businessName: z.string().min(2, 'Enter your registered business name'),
  email: z.string().email('Enter a valid business email'),
  phone: z.string().min(9, 'Enter a valid Kenyan phone number'),
  expectedMonthlyOrderKes: z.coerce.number().min(5000, 'Expected monthly volume must be at least KES 5,000'),
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

    const parsed = tradeAccountSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid trade account application.' },
        { status: 400 }
      )
    }

    const requestId = `TA-${Date.now().toString().slice(-6)}`
    const record = {
      id: requestId,
      ...parsed.data,
      createdAt: new Date().toISOString(),
    }

    lydiaStore.tradeAccountRequests.push(record)
    await persistKvRecord(`trade-account:${requestId}`, record)

    await sendMarketplaceEmail({
      to: parsed.data.email,
      subject: `Trade Account Request Received (${requestId})`,
      text: `Hello ${parsed.data.buyerName}, your request for a wholesale trade account with ${parsed.data.supplierName} for ${parsed.data.businessName} (KES ${parsed.data.expectedMonthlyOrderKes.toLocaleString('en-KE')}/month) has been logged under ${requestId}.`,
      html: `<p>Hello <strong>${parsed.data.buyerName}</strong>,</p><p>We have received your Trade Account request with <strong>${parsed.data.supplierName}</strong> for <strong>${parsed.data.businessName}</strong> (expected volume: KES ${parsed.data.expectedMonthlyOrderKes.toLocaleString('en-KE')}/month).</p><p>Reference: <strong>${requestId}</strong>. Our trade credit team reviews applications within 1 business day.</p>`,
    })

    return NextResponse.json({
      success: true,
      requestId,
      message: `Trade account application ${requestId} sent to ${parsed.data.supplierName}.`,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to submit trade account request.' }, { status: 500 })
  }
}

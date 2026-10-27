import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRecaptchaServer } from '@/lib/recaptcha'
import { lydiaStore, persistKvRecord } from '@/lib/server-store'

const reportIssueSchema = z.object({
  orderId: z.string().min(3, 'Order reference is required'),
  subject: z.string().min(3, 'Please choose an issue category'),
  description: z.string().min(10, 'Describe the delivery or stock issue in at least 10 characters'),
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

    const parsed = reportIssueSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid issue details.' },
        { status: 400 }
      )
    }

    const ticketId = `ISS-${Date.now().toString().slice(-6)}`
    const record = {
      ticketId,
      orderId: parsed.data.orderId,
      subject: parsed.data.subject,
      description: parsed.data.description,
      createdAt: new Date().toISOString(),
    }

    lydiaStore.issues.push(record)
    await persistKvRecord(`issue:${ticketId}`, record)

    return NextResponse.json({
      success: true,
      ticketId,
      message: `Issue logged under ticket ${ticketId}. Supplier dispatch support will respond within 4 hours.`,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to submit order issue report.' }, { status: 500 })
  }
}

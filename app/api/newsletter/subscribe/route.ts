import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRecaptchaServer } from '@/lib/recaptcha'
import { lydiaStore, persistKvRecord } from '@/lib/server-store'

const subscribeSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  recaptchaToken: z.string().optional(),
  recaptchaV2Token: z.string().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()

    const captcha = await verifyRecaptchaServer(
      body.recaptchaToken || 'newsletter-v3-token',
      body.recaptchaV2Token
    )
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

    const parsed = subscribeSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Enter a valid email address.' },
        { status: 400 }
      )
    }

    const normalized = parsed.data.email.toLowerCase()
    if (!lydiaStore.newsletterSubscribers.includes(normalized)) {
      lydiaStore.newsletterSubscribers.push(normalized)
      await persistKvRecord(`newsletter:${normalized}`, {
        email: normalized,
        subscribedAt: new Date().toISOString(),
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Subscribed to weekly Kenyan wholesale price bulletins.',
    })
  } catch {
    return NextResponse.json({ error: 'Unable to subscribe right now.' }, { status: 500 })
  }
}

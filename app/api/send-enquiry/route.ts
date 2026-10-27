import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRecaptchaServer } from '@/lib/recaptcha'
import { lydiaStore, persistKvRecord } from '@/lib/server-store'
import { sendMarketplaceEmail } from '@/lib/mailer'

const enquirySchema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().optional().default(''),
  subject: z.string().min(3, 'Enter a subject'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
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

    const parsed = enquirySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid enquiry details.' },
        { status: 400 }
      )
    }

    const enquiryId = `ENQ-${Date.now().toString().slice(-6)}`
    const record = {
      enquiryId,
      ...parsed.data,
      createdAt: new Date().toISOString(),
    }

    lydiaStore.enquiries.push(record)
    await persistKvRecord(`enquiry:${enquiryId}`, record)

    await sendMarketplaceEmail({
      to: process.env.ADMIN_EMAIL || 'support@lydiamarket.co.ke',
      subject: `Lydia Market Trade Enquiry (${enquiryId}): ${parsed.data.subject}`,
      text: `From: ${parsed.data.name} (${parsed.data.email}, ${parsed.data.phone})\n\n${parsed.data.message}`,
      html: `<p><strong>From:</strong> ${parsed.data.name} (${parsed.data.email})</p><p><strong>Subject:</strong> ${parsed.data.subject}</p><p>${parsed.data.message}</p>`,
    })

    return NextResponse.json({
      success: true,
      enquiryId,
      message: `Thank you ${parsed.data.name}. Your trade enquiry (${enquiryId}) has been received.`,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to send enquiry.' }, { status: 500 })
  }
}

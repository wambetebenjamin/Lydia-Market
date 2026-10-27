import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRecaptchaServer } from '@/lib/recaptcha'
import { lydiaStore, persistKvRecord } from '@/lib/server-store'
import { sendMarketplaceEmail } from '@/lib/mailer'

const registerSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Owner full name is required'),
  email: z.string().email('Enter a valid business email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  county: z.string().min(2, 'Select a Kenyan county'),
  phone: z.string().min(9, 'Enter a valid Kenyan phone number'),
  businessType: z.enum(['Retailer', 'Wholesaler', 'Institution']),
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

    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Invalid registration details.' },
        { status: 400 }
      )
    }

    const exists = lydiaStore.buyers.some(
      (b) => b.email.toLowerCase() === parsed.data.email.toLowerCase()
    )
    if (exists) {
      return NextResponse.json(
        { error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      )
    }

    const newBuyer = {
      id: `buyer-${Date.now()}`,
      businessName: parsed.data.businessName,
      ownerName: parsed.data.ownerName,
      email: parsed.data.email,
      password: parsed.data.password,
      county: parsed.data.county,
      phone: parsed.data.phone,
      businessType: parsed.data.businessType,
      createdAt: new Date().toISOString(),
    }

    lydiaStore.buyers.push(newBuyer)
    await persistKvRecord(`buyer:${newBuyer.email.toLowerCase()}`, newBuyer)

    await sendMarketplaceEmail({
      to: newBuyer.email,
      subject: 'Welcome to Lydia Market: Your Buyer Trade Account is Ready',
      text: `Hello ${newBuyer.ownerName}, welcome to Lydia Market. Your buyer account for ${newBuyer.businessName} (${newBuyer.county} County) is active. Browse wholesale catalogues and place bulk orders at competitive factory prices.`,
      html: `<p>Hello <strong>${newBuyer.ownerName}</strong>,</p><p>Your wholesale buyer account for <strong>${newBuyer.businessName}</strong> (${newBuyer.county} County) is now active on <strong>Lydia Market</strong>.</p><p>You can now source directly from verified Kenyan manufacturers and manage all supplier deliveries in one dashboard.</p>`,
    })

    return NextResponse.json(
      {
        success: true,
        buyer: {
          id: newBuyer.id,
          businessName: newBuyer.businessName,
          ownerName: newBuyer.ownerName,
          email: newBuyer.email,
          county: newBuyer.county,
          businessType: newBuyer.businessType,
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json({ error: 'Unable to process buyer registration.' }, { status: 500 })
  }
}

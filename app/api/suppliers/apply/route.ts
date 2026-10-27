import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyRecaptchaServer } from '@/lib/recaptcha'
import { lydiaStore, persistKvRecord } from '@/lib/server-store'
import { sendMarketplaceEmail } from '@/lib/mailer'

const productSampleSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  description: z.string().min(4, 'Product pack description is required'),
  unitPriceKes: z.coerce.number().positive('Unit price in KES must be positive'),
})

const supplierApplySchema = z.object({
  companyName: z.string().min(2, 'Company name is required'),
  category: z.string().min(2, 'Select a primary product category'),
  county: z.string().min(2, 'Select your primary depot county'),
  kraPin: z
    .string()
    .min(10, 'Enter a valid 11-character KRA PIN (for example P051234567X)')
    .max(15),
  registrationNumber: z.string().min(4, 'Business registration number is required'),
  contactName: z.string().min(2, 'Contact full name is required'),
  email: z.string().email('Enter a valid company email'),
  phone: z.string().min(9, 'Enter a valid Kenyan phone number'),
  topProducts: z.array(productSampleSchema).length(3, 'Provide your top 3 wholesale products'),
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

    const parsed = supplierApplySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'Please complete all supplier fields.' },
        { status: 400 }
      )
    }

    const applicationId = `SUP-${Date.now().toString().slice(-6)}`
    const record = {
      applicationId,
      ...parsed.data,
      createdAt: new Date().toISOString(),
    }

    lydiaStore.supplierApplications.push(record)
    await persistKvRecord(`supplier-app:${applicationId}`, record)

    const adminEmail = process.env.ADMIN_EMAIL || 'onboarding@lydiamarket.co.ke'

    await Promise.all([
      sendMarketplaceEmail({
        to: parsed.data.email,
        subject: `Lydia Market Supplier Application Received (${applicationId})`,
        text: `Dear ${parsed.data.contactName}, thank you for applying to list ${parsed.data.companyName} (${parsed.data.county} County) on Lydia Market. Application ID: ${applicationId}. Our verification team will review your KRA PIN (${parsed.data.kraPin}) and contact you within 2 business days.`,
        html: `<p>Dear <strong>${parsed.data.contactName}</strong>,</p><p>We have received the wholesale supplier onboarding application for <strong>${parsed.data.companyName}</strong> (${parsed.data.county} County).</p><p>Application Reference: <strong>${applicationId}</strong>. Our compliance desk reviews KRA PIN and trading history documents within 2 business days.</p>`,
      }),
      sendMarketplaceEmail({
        to: adminEmail,
        subject: `New Supplier Onboarding Application: ${parsed.data.companyName} (${applicationId})`,
        text: `New supplier application ${applicationId}: ${parsed.data.companyName}, KRA PIN ${parsed.data.kraPin}, Reg ${parsed.data.registrationNumber}, ${parsed.data.category}, ${parsed.data.county} County.`,
        html: `<h3>New Supplier Onboarding Application (${applicationId})</h3><p><strong>Company:</strong> ${parsed.data.companyName}</p><p><strong>Category:</strong> ${parsed.data.category} | <strong>County:</strong> ${parsed.data.county}</p><p><strong>KRA PIN:</strong> ${parsed.data.kraPin} | <strong>Reg No:</strong> ${parsed.data.registrationNumber}</p>`,
      }),
    ])

    return NextResponse.json({
      success: true,
      applicationId,
      message: `Application ${applicationId} submitted. Confirmation sent to ${parsed.data.email}.`,
    })
  } catch {
    return NextResponse.json({ error: 'Unable to submit supplier application.' }, { status: 500 })
  }
}

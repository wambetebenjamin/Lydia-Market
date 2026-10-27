'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FileCheck2, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react'
import { CATEGORIES, KENYAN_COUNTIES } from '@/lib/data'
import { getRecaptchaV3Token, RecaptchaWidget } from '@/components/RecaptchaWidget'

interface SupplierApplyValues {
  companyName: string
  category: string
  county: string
  kraPin: string
  registrationNumber: string
  contactName: string
  email: string
  phone: string
  prod1Name: string
  prod1Desc: string
  prod1Price: string
  prod2Name: string
  prod2Desc: string
  prod2Price: string
  prod3Name: string
  prod3Desc: string
  prod3Price: string
}

export function SupplierApplyClient() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<SupplierApplyValues>({
    defaultValues: {
      category: 'Food and Beverages',
      county: 'Nairobi',
    },
  })

  const [requireV2, setRequireV2] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null)

  const onSubmit = async (v: SupplierApplyValues) => {
    setResult(null)
    try {
      const recaptchaToken = await getRecaptchaV3Token('supplier_apply')
      const res = await fetch('/api/suppliers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: v.companyName,
          category: v.category,
          county: v.county,
          kraPin: v.kraPin,
          registrationNumber: v.registrationNumber,
          contactName: v.contactName,
          email: v.email,
          phone: v.phone,
          topProducts: [
            { name: v.prod1Name, description: v.prod1Desc, unitPriceKes: Number(v.prod1Price) },
            { name: v.prod2Name, description: v.prod2Desc, unitPriceKes: Number(v.prod2Price) },
            { name: v.prod3Name, description: v.prod3Desc, unitPriceKes: Number(v.prod3Price) },
          ],
          recaptchaToken,
          recaptchaV2Token: v2Token,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.requireV2) setRequireV2(true)
        setResult({ ok: false, msg: data.error || 'Could not submit application.' })
      } else {
        setResult({ ok: true, msg: data.message })
        reset()
      }
    } catch {
      setResult({ ok: false, msg: 'Network error while submitting application.' })
    }
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Supplier Hero */}
        <section className="bg-[#3D464D] text-white p-6 sm:p-10 lg:p-12 space-y-4">
          <span className="inline-block bg-[#FFD333] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3D464D]">
            Manufacturer & Primary Distributor Onboarding
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-4xl">
            List your products. Reach thousands of Kenyan retailers.
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#F5F5F5] max-w-3xl leading-relaxed">
            Receive consolidated bulk orders directly from 12,800+ verified dukas, mini-marts, pharmacies, hardware shops, and institutions across all 47 counties.
          </p>
        </section>

        {/* Requirements Strip */}
        <section aria-label="Onboarding Eligibility Requirements" className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Building2,
              title: 'Registered Business Entity',
              desc: 'Certificate of Incorporation (PVT / Ltd) or Registered Business Name in Kenya.',
            },
            {
              icon: FileCheck2,
              title: 'Valid KRA PIN & eTIMS',
              desc: 'Active KRA Tax Compliance Certificate and ability to issue eTIMS tax invoices.',
            },
            {
              icon: ShieldCheck,
              title: 'Minimum 6 Months Trading History',
              desc: 'Demonstrated wholesale distribution capacity, KEBS product marks, and warehouse address.',
            },
          ].map((req) => {
            const Icon = req.icon
            return (
              <div key={req.title} className="bg-white border border-gray-200 p-6 space-y-2.5">
                <div className="w-12 h-12 bg-[#FFD333] text-[#3D464D] flex items-center justify-center">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-[#3D464D]">{req.title}</h2>
                <p className="text-sm sm:text-base text-[#6C757D]">{req.desc}</p>
              </div>
            )
          })}
        </section>

        {/* Application Form */}
        <section className="bg-white border border-gray-200 p-6 sm:p-8 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#3D464D] mb-2">
            Supplier Verification Application
          </h2>
          <p className="text-sm sm:text-base text-[#6C757D] mb-6">
            Complete all company compliance fields and list three sample wholesale SKUs with carton KES pricing.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <label htmlFor="sup-company" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Company Name
                </label>
                <input
                  id="sup-company"
                  type="text"
                  required
                  placeholder="Uplands Edible Oils Ltd"
                  {...register('companyName', { required: true })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="sup-category" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Primary Category
                </label>
                <select
                  id="sup-category"
                  {...register('category', { required: true })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="sup-county" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Warehouse County
                </label>
                <select
                  id="sup-county"
                  {...register('county', { required: true })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {KENYAN_COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c} County
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="sup-krapin" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Company KRA PIN
                </label>
                <input
                  id="sup-krapin"
                  type="text"
                  required
                  placeholder="P051482910K"
                  {...register('kraPin', { required: true, minLength: 10 })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base uppercase text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="sup-regno" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Business Registration Number
                </label>
                <input
                  id="sup-regno"
                  type="text"
                  required
                  placeholder="PVT-MKU88210"
                  {...register('registrationNumber', { required: true })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="sup-contact" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Contact Person Name
                </label>
                <input
                  id="sup-contact"
                  type="text"
                  required
                  placeholder="David Njoroge"
                  {...register('contactName', { required: true })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="sup-email" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Official Email
                </label>
                <input
                  id="sup-email"
                  type="email"
                  required
                  placeholder="sales@uplandsoils.co.ke"
                  {...register('email', { required: true })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="sup-phone" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Phone Number
                </label>
                <input
                  id="sup-phone"
                  type="tel"
                  required
                  placeholder="+254720998877"
                  {...register('phone', { required: true })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            {/* Top 3 Wholesale Products */}
            <div className="space-y-4 pt-3 border-t border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-[#3D464D]">
                Top 3 Wholesale Products (Pack Description & Unit Price in KES)
              </h3>

              {[1, 2, 3].map((num) => (
                <div
                  key={num}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#F5F5F5] p-4 border border-gray-200"
                >
                  <div className="sm:col-span-4">
                    <label
                      htmlFor={`prod-${num}-name`}
                      className="block text-xs font-bold uppercase text-[#3D464D] mb-1"
                    >
                      Product #{num} Name
                    </label>
                    <input
                      id={`prod-${num}-name`}
                      type="text"
                      required
                      placeholder={`Wholesale Item #${num}`}
                      {...register(`prod${num}Name` as 'prod1Name', { required: true })}
                      className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="sm:col-span-5">
                    <label
                      htmlFor={`prod-${num}-desc`}
                      className="block text-xs font-bold uppercase text-[#3D464D] mb-1"
                    >
                      Pack Size / Specification
                    </label>
                    <input
                      id={`prod-${num}-desc`}
                      type="text"
                      required
                      placeholder="Carton of 12 x 1L bottles"
                      {...register(`prod${num}Desc` as 'prod1Desc', { required: true })}
                      className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor={`prod-${num}-price`}
                      className="block text-xs font-bold uppercase text-[#3D464D] mb-1"
                    >
                      Unit Price (KES)
                    </label>
                    <input
                      id={`prod-${num}-price`}
                      type="number"
                      min="1"
                      required
                      placeholder="3600"
                      {...register(`prod${num}Price` as 'prod1Price', { required: true })}
                      className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                  </div>
                </div>
              ))}
            </div>

            <RecaptchaWidget
              requireV2={requireV2}
              v2Verified={Boolean(v2Token)}
              onVerifyV2={(tok) => setV2Token(tok)}
              actionName="supplier_apply"
            />

            {result && (
              <div
                role="status"
                className={`p-4 border flex items-center gap-2.5 text-sm font-semibold ${
                  result.ok
                    ? 'bg-green-50 border-green-200 text-[#28a745]'
                    : 'bg-red-50 border-red-200 text-[#dc3545]'
                }`}
              >
                {result.ok && <CheckCircle2 className="w-5 h-5 flex-shrink-0" aria-hidden="true" />}
                <span>{result.msg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto min-h-[48px] min-w-[44px] bg-[#FFD333] px-8 py-3.5 text-base font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Supplier Application'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

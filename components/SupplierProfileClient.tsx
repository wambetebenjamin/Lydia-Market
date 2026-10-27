'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldCheck, MapPin, Calendar, MessageCircle, Bookmark, Award } from 'lucide-react'
import { formatKes, type Product, type Supplier } from '@/lib/data'
import { ProductCard } from '@/components/ProductCard'
import { useMarketplaceStore } from '@/lib/store'
import { getRecaptchaV3Token, RecaptchaWidget } from '@/components/RecaptchaWidget'

interface SupplierProfileClientProps {
  supplier: Supplier
  products: Product[]
}

export function SupplierProfileClient({ supplier, products }: SupplierProfileClientProps) {
  const coverWrapRef = useRef<HTMLDivElement>(null)
  const coverInnerRef = useRef<HTMLDivElement>(null)

  const savedSuppliers = useMarketplaceStore((s) => s.savedSuppliers)
  const toggleSavedSupplier = useMarketplaceStore((s) => s.toggleSavedSupplier)
  const isSaved = savedSuppliers.includes(supplier.slug)

  const [buyerName, setBuyerName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [expectedMonthlyOrderKes, setExpectedMonthlyOrderKes] = useState('150000')
  const [requireV2, setRequireV2] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  // Step 16 Effect #6: Supplier profile cover photo parallax (GSAP ScrollTrigger)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !coverWrapRef.current || !coverInnerRef.current) return

    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.fromTo(
        coverInnerRef.current,
        { yPercent: -6 },
        {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: coverWrapRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    }, coverWrapRef)

    return () => ctx.revert()
  }, [])

  const handleTradeAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    try {
      const recaptchaToken = await getRecaptchaV3Token('trade_account_request')
      const res = await fetch('/api/trade-accounts/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierSlug: supplier.slug,
          supplierName: supplier.name,
          buyerName,
          businessName,
          email,
          phone,
          expectedMonthlyOrderKes: Number(expectedMonthlyOrderKes),
          recaptchaToken,
          recaptchaV2Token: v2Token,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.requireV2) setRequireV2(true)
        setFeedback({ ok: false, msg: data.error || 'Could not submit trade account request.' })
      } else {
        setFeedback({ ok: true, msg: data.message })
        setBuyerName('')
        setBusinessName('')
        setEmail('')
        setPhone('')
      }
    } catch {
      setFeedback({ ok: false, msg: 'Network error. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  const whatsappHref = `https://wa.me/254112272061?text=${encodeURIComponent(
    supplier.whatsappMessage
  )}`

  return (
    <div className="pb-12">
      {/* Step 4 & Step 18 Cover Photo: h-40 sm:h-56 lg:h-72 w-full object-cover */}
      <div ref={coverWrapRef} className="relative h-40 sm:h-56 lg:h-72 w-full overflow-hidden bg-[#3D464D]">
        <div ref={coverInnerRef} className="relative h-40 sm:h-56 lg:h-72 w-full scale-110">
          <Image
            src={supplier.coverImage}
            alt={`${supplier.name} warehouse facility in ${supplier.county} County`}
            fill
            priority
            sizes="100vw"
            className="h-40 sm:h-56 lg:h-72 w-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[#3D464D]/45" aria-hidden="true" />
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 -mt-8 relative z-10">
        {/* Supplier Header Card */}
        <section className="bg-white border border-gray-200 p-5 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
              {/* Supplier Logo Placeholder */}
              <div className="w-20 h-20 flex-shrink-0 bg-[#3D464D] border-4 border-[#FFD333] text-[#FFD333] flex items-center justify-center text-2xl font-bold uppercase">
                {supplier.initials}
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-[#FFD333] px-2.5 py-0.5 text-xs font-bold uppercase text-[#3D464D]">
                    {supplier.category}
                  </span>
                  {supplier.verified && (
                    <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 px-2.5 py-0.5 text-xs font-bold text-[#28a745]">
                      <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                      Verified Supplier
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D464D]">
                  {supplier.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#6C757D]">
                  <span className="inline-flex items-center gap-1 font-medium text-[#3D464D]">
                    <MapPin className="w-4 h-4 text-[#3D464D]" aria-hidden="true" />
                    {supplier.county} County
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-[#3D464D]" aria-hidden="true" />
                    {supplier.yearsInBusiness} Years in Business
                  </span>
                  <span>Min Order: {formatKes(supplier.minOrderValueKes)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => toggleSavedSupplier(supplier.slug)}
                className="min-h-[44px] min-w-[44px] border border-[#3D464D] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#3D464D] hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={isSaved ? 'currentColor' : 'none'}
                  aria-hidden="true"
                />
                <span>{isSaved ? 'Saved Supplier' : 'Bookmark Supplier'}</span>
              </button>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] min-w-[44px] bg-[#28a745] px-5 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-bold text-white hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <MessageCircle className="w-4 h-4" aria-hidden="true" />
                <span>Contact Supplier</span>
              </a>
            </div>
          </div>

          <p className="text-sm sm:text-base text-[#495057] leading-relaxed border-t border-gray-200 pt-5">
            {supplier.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {supplier.certifications.map((cert) => (
              <span
                key={cert}
                className="inline-flex items-center gap-1.5 bg-[#F5F5F5] border border-gray-200 px-3 py-1.5 text-xs font-semibold text-[#3D464D]"
              >
                <Award className="w-4 h-4 text-[#FFD333]" aria-hidden="true" />
                {cert}
              </span>
            ))}
          </div>
        </section>

        {/* Supplier Product Catalogue Grid (Step 4 & Step 18: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6) */}
        <section aria-labelledby="supplier-catalogue-heading">
          <h2
            id="supplier-catalogue-heading"
            className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D] mb-6"
          >
            <span>Wholesale Catalogue ({products.length} Products)</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.slug} product={product} index={idx} />
            ))}
          </div>
        </section>

        {/* Request Trade Account Form */}
        <section
          aria-labelledby="trade-account-heading"
          className="bg-white border border-gray-200 p-6 sm:p-8 max-w-3xl"
        >
          <h2
            id="trade-account-heading"
            className="text-2xl sm:text-3xl font-bold text-[#3D464D]"
          >
            Request 30 / 60-Day Trade Account
          </h2>
          <p className="text-sm sm:text-base text-[#6C757D] mt-1 mb-6">
            Apply directly with {supplier.name} for recurring credit limits, pallet rebates, and priority dispatch scheduling.
          </p>

          <form onSubmit={handleTradeAccountSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="ta-buyer-name" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Buyer Full Name
                </label>
                <input
                  id="ta-buyer-name"
                  type="text"
                  required
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Peter Kamau"
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="ta-business-name" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Registered Business Name
                </label>
                <input
                  id="ta-business-name"
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Kamau Superette Ltd"
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="ta-email" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Business Email
                </label>
                <input
                  id="ta-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="orders@kamausuperette.co.ke"
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="ta-phone" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Phone Number
                </label>
                <input
                  id="ta-phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254722112233"
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="ta-monthly-kes" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Expected Monthly Order (KES)
                </label>
                <input
                  id="ta-monthly-kes"
                  type="number"
                  min={5000}
                  step={5000}
                  required
                  value={expectedMonthlyOrderKes}
                  onChange={(e) => setExpectedMonthlyOrderKes(e.target.value)}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>
            </div>

            <RecaptchaWidget
              requireV2={requireV2}
              v2Verified={Boolean(v2Token)}
              onVerifyV2={(tok) => setV2Token(tok)}
              actionName="trade_account_request"
            />

            {feedback && (
              <div
                role="status"
                className={`p-3.5 border text-sm font-semibold ${
                  feedback.ok
                    ? 'bg-green-50 border-green-200 text-[#28a745]'
                    : 'bg-red-50 border-red-200 text-[#dc3545]'
                }`}
              >
                {feedback.msg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto min-h-[48px] min-w-[44px] bg-[#FFD333] px-7 py-3 text-base font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              {submitting ? 'Submitting Request...' : 'Submit Trade Account Request'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

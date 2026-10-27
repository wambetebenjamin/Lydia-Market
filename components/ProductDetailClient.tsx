'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ShoppingCart,
  Check,
  ShieldCheck,
  MapPin,
  Clock,
  Package,
  Minus,
  Plus,
  FileText,
  ArrowRight,
  X,
} from 'lucide-react'
import { formatKes, type Product, type Supplier } from '@/lib/data'
import { useMarketplaceStore } from '@/lib/store'
import { ProductCard } from '@/components/ProductCard'
import { getRecaptchaV3Token, RecaptchaWidget } from '@/components/RecaptchaWidget'

interface ProductDetailClientProps {
  product: Product
  supplier?: Supplier
  relatedProducts: Product[]
}

export function ProductDetailClient({
  product,
  supplier,
  relatedProducts,
}: ProductDetailClientProps) {
  const addItem = useMarketplaceStore((s) => s.addItem)
  const [rawQty, setRawQty] = useState(String(product.moq))
  const [qtyError, setQtyError] = useState('')
  const [addedBanner, setAddedBanner] = useState(false)

  // Custom Quote Modal State
  const [quoteOpen, setQuoteOpen] = useState(false)
  const [quoteName, setQuoteName] = useState('')
  const [quoteEmail, setQuoteEmail] = useState('')
  const [quotePhone, setQuotePhone] = useState('')
  const [quoteNotes, setQuoteNotes] = useState('')
  const [requireV2, setRequireV2] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [quoteStatus, setQuoteStatus] = useState('')
  const [quoteSubmitting, setQuoteSubmitting] = useState(false)

  const validateQuantity = (val: string): number | null => {
    const num = Number(val)
    if (!val.trim() || !Number.isInteger(num) || num <= 0) {
      setQtyError(`Enter a valid whole number multiple of ${product.moq}.`)
      return null
    }
    if (num < product.moq || num % product.moq !== 0) {
      setQtyError(
        `Quantity must be a multiple of minimum order quantity (${product.moq}, ${product.moq * 2}, ${product.moq * 3}, ...).`
      )
      return null
    }
    if (num > product.availableStock) {
      setQtyError(`Maximum available stock right now is ${product.availableStock} units.`)
      return null
    }
    setQtyError('')
    return num
  }

  const handleQtyChange = (nextVal: string) => {
    setRawQty(nextVal)
    validateQuantity(nextVal)
  }

  const stepQuantity = (delta: number) => {
    const current = Number(rawQty) || product.moq
    const snapped = Math.max(
      product.moq,
      Math.round(current / product.moq) * product.moq + delta * product.moq
    )
    const bounded = Math.min(snapped, product.availableStock)
    setRawQty(String(bounded))
    setQtyError('')
  }

  const handleAddToOrder = () => {
    const valid = validateQuantity(rawQty)
    if (valid === null) return

    addItem({
      productSlug: product.slug,
      productName: product.name,
      sku: product.sku,
      supplierSlug: product.supplierSlug,
      supplierName: product.supplierName,
      county: product.county,
      unitPriceKes: product.unitPriceKes,
      unitLabel: product.unitLabel,
      moq: product.moq,
      quantity: valid,
      image: product.image,
    })
    setAddedBanner(true)
    window.setTimeout(() => setAddedBanner(false), 2400)
  }

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setQuoteSubmitting(true)
    setQuoteStatus('')

    try {
      const recaptchaToken = await getRecaptchaV3Token('custom_quote')
      const res = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: quoteName,
          email: quoteEmail,
          phone: quotePhone,
          subject: `Custom Bulk Quote: ${product.name} (${product.sku})`,
          message:
            quoteNotes ||
            `Requesting custom volume quote for ${rawQty} units of ${product.name} from ${product.supplierName}.`,
          recaptchaToken,
          recaptchaV2Token: v2Token,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.requireV2) setRequireV2(true)
        setQuoteStatus(data.error || 'Could not send quote request.')
      } else {
        setQuoteStatus(data.message || 'Custom quote request sent to supplier desk.')
        setQuoteNotes('')
      }
    } catch {
      setQuoteStatus('Network error while submitting quote request.')
    } finally {
      setQuoteSubmitting(false)
    }
  }

  const numericQty = Number(rawQty) > 0 ? Number(rawQty) : product.moq

  return (
    <div className="py-6 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#6C757D]">
          <Link
            href="/"
            className="min-h-[44px] min-w-[44px] inline-flex items-center hover:text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/catalogue?category=${encodeURIComponent(product.category)}`}
            className="min-h-[44px] min-w-[44px] inline-flex items-center hover:text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="font-semibold text-[#3D464D]">{product.name}</span>
        </nav>

        {/* Main Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white border border-gray-200 p-5 sm:p-8">
          {/* Product Image (Step 18: aspect-[4/3] w-full object-cover rounded-lg) */}
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#F5F5F5]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="aspect-[4/3] w-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Product Details & Order Form */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
              <span className="bg-[#FFD333] px-2.5 py-1 text-[#3D464D] uppercase">
                {product.category}
              </span>
              <span className="bg-[#F5F5F5] px-2.5 py-1 text-[#3D464D]">SKU: {product.sku}</span>
              <span className="inline-flex items-center gap-1 text-[#28a745] bg-green-50 border border-green-200 px-2.5 py-1">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Verified Stock
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D464D] leading-tight">
              {product.name}
            </h1>

            <div className="flex flex-wrap items-baseline gap-3 pt-1">
              <span className="text-3xl font-bold text-[#3D464D]">
                {formatKes(product.unitPriceKes)}
              </span>
              <span className="text-sm text-[#6C757D]">{product.unitLabel}</span>
            </div>

            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              {product.description}
            </p>

            {/* Key Commercial Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#F5F5F5] p-4 border border-gray-200">
              <div>
                <p className="text-xs uppercase text-[#6C757D] font-semibold">Minimum Order</p>
                <p className="text-base font-bold text-[#3D464D] mt-0.5">{product.moq} units</p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#6C757D] font-semibold">Available Stock</p>
                <p className="text-base font-bold text-[#28a745] mt-0.5 flex items-center gap-1">
                  <Package className="w-4 h-4" aria-hidden="true" />
                  {product.availableStock} ready
                </p>
              </div>
              <div>
                <p className="text-xs uppercase text-[#6C757D] font-semibold">Lead Time & Depot</p>
                <p className="text-sm font-bold text-[#3D464D] mt-0.5 flex items-center gap-1">
                  <Clock className="w-4 h-4" aria-hidden="true" />
                  {product.leadTime} ({product.county})
                </p>
              </div>
            </div>

            {/* Client-Side MOQ Validated Quantity Control */}
            <div className="space-y-2 pt-1">
              <label
                htmlFor="order-qty-input"
                className="block text-sm font-bold text-[#3D464D]"
              >
                Order Quantity (multiples of {product.moq} units)
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => stepQuantity(-1)}
                    aria-label="Decrease quantity by minimum order batch"
                    className="min-h-[44px] min-w-[44px] bg-[#FFD333] text-[#3D464D] inline-flex items-center justify-center font-bold hover:bg-[#3D464D] hover:text-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Minus className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <input
                    id="order-qty-input"
                    type="number"
                    min={product.moq}
                    step={product.moq}
                    value={rawQty}
                    onChange={(e) => handleQtyChange(e.target.value)}
                    aria-invalid={Boolean(qtyError)}
                    aria-describedby={qtyError ? 'qty-validation-error' : undefined}
                    className="w-28 min-h-[44px] border-y border-gray-300 bg-white px-3 text-center text-base font-bold text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => stepQuantity(1)}
                    aria-label="Increase quantity by minimum order batch"
                    className="min-h-[44px] min-w-[44px] bg-[#FFD333] text-[#3D464D] inline-flex items-center justify-center font-bold hover:bg-[#3D464D] hover:text-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                <span className="text-sm font-semibold text-[#3D464D]">
                  Line Estimate: <strong>{formatKes(numericQty * product.unitPriceKes)}</strong>
                </span>
              </div>

              {qtyError && (
                <p id="qty-validation-error" role="alert" className="text-sm text-red-600">
                  {qtyError}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                type="button"
                whileTap={{ scale: 0.94 }}
                animate={addedBanner ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                onClick={handleAddToOrder}
                className="flex-1 min-h-[48px] min-w-[44px] bg-[#FFD333] px-6 py-3 inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                {addedBanner ? (
                  <>
                    <Check className="w-5 h-5" aria-hidden="true" />
                    <span>Added to Wholesale Basket</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" aria-hidden="true" />
                    <span>Add to Order</span>
                  </>
                )}
              </motion.button>

              <button
                type="button"
                onClick={() => setQuoteOpen(true)}
                className="flex-1 min-h-[48px] min-w-[44px] border-2 border-[#3D464D] bg-white px-6 py-3 inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-[#3D464D] hover:bg-[#F5F5F5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
                <span>Request Custom Quote</span>
              </button>
            </div>
          </div>
        </div>

        {/* Specifications + Supplier Info Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white border border-gray-200 p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-[#3D464D] mb-4">
              Wholesale Pack Specifications
            </h2>
            <dl className="divide-y divide-gray-200">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="py-3 grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4">
                  <dt className="text-sm font-semibold text-[#6C757D]">{key}</dt>
                  <dd className="sm:col-span-2 text-sm sm:text-base font-medium text-[#3D464D]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5 bg-white border border-gray-200 p-6 flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6C757D]">
                Supplied Directly By
              </span>
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 flex-shrink-0 bg-[#3D464D] text-[#FFD333] flex items-center justify-center text-lg font-bold">
                  {supplier?.initials || 'LM'}
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#3D464D]">
                    {product.supplierName}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6C757D] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                    {product.county} County &bull; {supplier?.yearsInBusiness || 10} yrs in trade
                  </p>
                </div>
              </div>

              <p className="text-sm text-[#495057] leading-relaxed">
                {supplier?.description ||
                  'Verified Kenyan wholesale manufacturer supplying retail stores nationwide with KRA eTIMS invoicing.'}
              </p>
            </div>

            <Link
              href={`/supplier/${product.supplierSlug}`}
              className="w-full min-h-[44px] min-w-[44px] bg-[#3D464D] px-5 py-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#FFD333] hover:bg-[#FFD333] hover:text-[#3D464D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <span>View Supplier Profile & Full Catalogue</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Related Products: 4 Items From Same Category */}
        <section aria-labelledby="related-products-heading">
          <h2
            id="related-products-heading"
            className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D] mb-6"
          >
            <span>Related {product.category} Stock</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((item, idx) => (
              <ProductCard key={item.slug} product={item} index={idx} />
            ))}
          </div>
        </section>
      </div>

      {/* Step 18 Modal Pattern: items-end sm:items-center, rounded-t-2xl sm:rounded-2xl */}
      {quoteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="custom-quote-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
        >
          <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto pb-safe space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h2 id="custom-quote-title" className="text-lg sm:text-xl font-bold text-[#3D464D]">
                Request Custom Bulk Quote
              </h2>
              <button
                type="button"
                onClick={() => setQuoteOpen(false)}
                aria-label="Close custom quote dialog"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#3D464D] hover:bg-[#F5F5F5] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleQuoteSubmit} className="space-y-4">
              <div>
                <label htmlFor="quote-name" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Buyer Full Name
                </label>
                <input
                  id="quote-name"
                  type="text"
                  required
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  placeholder="Jane Wambui"
                  className="w-full min-h-[44px] border border-gray-300 px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="quote-email" className="block text-sm font-semibold text-[#3D464D] mb-1">
                    Business Email
                  </label>
                  <input
                    id="quote-email"
                    type="email"
                    required
                    value={quoteEmail}
                    onChange={(e) => setQuoteEmail(e.target.value)}
                    placeholder="buyer@shop.co.ke"
                    className="w-full min-h-[44px] border border-gray-300 px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="quote-phone" className="block text-sm font-semibold text-[#3D464D] mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    id="quote-phone"
                    type="tel"
                    required
                    value={quotePhone}
                    onChange={(e) => setQuotePhone(e.target.value)}
                    placeholder="+254712345678"
                    className="w-full min-h-[44px] border border-gray-300 px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="quote-notes" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Target Quantity & Delivery County
                </label>
                <textarea
                  id="quote-notes"
                  rows={3}
                  required
                  value={quoteNotes}
                  onChange={(e) => setQuoteNotes(e.target.value)}
                  placeholder={`Requesting pallet pricing for ${numericQty * 2} units delivered to Nakuru town...`}
                  className="w-full min-h-[88px] border border-gray-300 px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <RecaptchaWidget
                requireV2={requireV2}
                v2Verified={Boolean(v2Token)}
                onVerifyV2={(tok) => setV2Token(tok)}
                actionName="custom_quote"
              />

              {quoteStatus && (
                <p role="status" className="text-sm font-semibold text-[#28a745]">
                  {quoteStatus}
                </p>
              )}

              <button
                type="submit"
                disabled={quoteSubmitting}
                className="w-full min-h-[48px] min-w-[44px] bg-[#FFD333] px-5 py-3 text-base font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                {quoteSubmitting ? 'Sending Request...' : 'Send Custom Quote Request'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

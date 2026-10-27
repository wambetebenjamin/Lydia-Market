'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, CheckCircle2, ArrowRight, Building2 } from 'lucide-react'
import { KENYAN_COUNTIES, formatKes } from '@/lib/data'
import { useMarketplaceStore, type BasketItem } from '@/lib/store'
import { getRecaptchaV3Token, RecaptchaWidget } from '@/components/RecaptchaWidget'

interface OrdersClientProps {
  defaultCounty?: string
  businessName?: string
}

export function OrdersClient({
  defaultCounty = 'Nairobi',
  businessName = 'Wanjiku Retail Mart',
}: OrdersClientProps) {
  const basket = useMarketplaceStore((s) => s.basket)
  const updateQuantity = useMarketplaceStore((s) => s.updateQuantity)
  const removeItem = useMarketplaceStore((s) => s.removeItem)
  const clearBasket = useMarketplaceStore((s) => s.clearBasket)
  const addPlacedOrders = useMarketplaceStore((s) => s.addPlacedOrders)

  const [deliveryAddress, setDeliveryAddress] = useState(
    `${businessName}, Shop B4, Outer Ring Trade Centre`
  )
  const [county, setCounty] = useState(defaultCounty)
  const [deliveryNotes, setDeliveryNotes] = useState('')
  const [paymentTerms, setPaymentTerms] = useState<'30 days' | '60 days' | 'immediate'>('30 days')
  const [requireV2, setRequireV2] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [confirmedRefs, setConfirmedRefs] = useState<string[]>([])

  const supplierGroups = useMemo(() => {
    const map = new Map<
      string,
      { supplierSlug: string; supplierName: string; items: BasketItem[]; subtotal: number }
    >()
    for (const item of basket) {
      const existing = map.get(item.supplierSlug) || {
        supplierSlug: item.supplierSlug,
        supplierName: item.supplierName,
        items: [],
        subtotal: 0,
      }
      existing.items.push(item)
      existing.subtotal += item.unitPriceKes * item.quantity
      map.set(item.supplierSlug, existing)
    }
    return Array.from(map.values())
  }, [basket])

  const grandTotalKes = useMemo(
    () => supplierGroups.reduce((sum, g) => sum + g.subtotal, 0),
    [supplierGroups]
  )

  const handleConfirmOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (basket.length === 0) return

    setSubmitting(true)
    setErrorMsg('')

    try {
      const recaptchaToken = await getRecaptchaV3Token('place_wholesale_order')
      const res = await fetch('/api/orders/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deliveryAddress,
          county,
          deliveryNotes,
          paymentTerms,
          items: basket.map((i) => ({
            productSlug: i.productSlug,
            productName: i.productName,
            supplierSlug: i.supplierSlug,
            supplierName: i.supplierName,
            unitPriceKes: i.unitPriceKes,
            quantity: i.quantity,
          })),
          recaptchaToken,
          recaptchaV2Token: v2Token,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.requireV2) setRequireV2(true)
        setErrorMsg(data.error || 'Could not confirm order.')
      } else {
        addPlacedOrders(data.orders || [])
        setConfirmedRefs((data.orders || []).map((o: { id: string }) => o.id))
        clearBasket()
      }
    } catch {
      setErrorMsg('Network error while placing wholesale order.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D464D]">
            Wholesale Order Basket & Checkout
          </h1>
          <p className="text-sm sm:text-base text-[#6C757D] mt-1">
            Review items grouped by verified supplier, confirm delivery details, and issue official purchase orders.
          </p>
        </div>

        {confirmedRefs.length > 0 && (
          <div className="bg-white border-2 border-[#28a745] p-6 space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-7 h-7 text-[#28a745] flex-shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#3D464D]">
                  Wholesale Purchase Order Confirmed
                </h2>
                <p className="text-sm sm:text-base text-[#495057]">
                  Order reference(s) <strong>{confirmedRefs.join(', ')}</strong> have been dispatched to your suppliers and a confirmation summary has been sent via email.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/dashboard/order/${confirmedRefs[0]}`}
                className="min-h-[44px] min-w-[44px] bg-[#FFD333] px-5 py-2.5 inline-flex items-center gap-2 text-sm font-bold text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <span>Track Order {confirmedRefs[0]}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/catalogue"
                className="min-h-[44px] min-w-[44px] border border-[#3D464D] px-5 py-2.5 inline-flex items-center text-sm font-semibold text-[#3D464D] hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                Continue Sourcing Stock
              </Link>
            </div>
          </div>
        )}

        {supplierGroups.length === 0 ? (
          <div className="bg-white border border-gray-200 p-10 text-center space-y-4">
            <h2 className="text-xl font-bold text-[#3D464D]">Your wholesale basket is empty</h2>
            <p className="text-sm sm:text-base text-[#6C757D]">
              Browse verified Kenyan manufacturers and add cartons or bales directly to your multi-supplier basket.
            </p>
            <Link
              href="/catalogue"
              className="min-h-[48px] min-w-[44px] bg-[#FFD333] px-6 py-3 inline-flex items-center gap-2 text-sm font-bold text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <span>Browse Wholesale Catalogue</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 7 Columns: Supplier-Grouped Cards */}
            <div className="lg:col-span-7 space-y-6">
              {supplierGroups.map((group) => (
                <section
                  key={group.supplierSlug}
                  className="bg-white border border-gray-200 p-5 sm:p-6 space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                    <Link
                      href={`/supplier/${group.supplierSlug}`}
                      className="min-h-[44px] inline-flex items-center gap-2 text-lg sm:text-xl font-bold text-[#3D464D] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <Building2 className="w-5 h-5 text-[#FFD333]" aria-hidden="true" />
                      <span>{group.supplierName}</span>
                    </Link>
                  </div>

                  {/* Step 18: Items within group stack vertically on all sizes */}
                  <div className="flex flex-col divide-y divide-gray-200">
                    {group.items.map((item) => {
                      const lineTotal = item.unitPriceKes * item.quantity
                      return (
                        <div key={item.productSlug} className="py-4 space-y-3">
                          <div className="flex items-start gap-3.5">
                            <div className="relative h-16 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-[#F5F5F5]">
                              <Image
                                src={item.image}
                                alt={item.productName}
                                fill
                                sizes="80px"
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={`/product/${item.productSlug}`}
                                className="text-base sm:text-lg font-bold text-[#3D464D] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                {item.productName}
                              </Link>
                              <p className="text-xs sm:text-sm text-[#6C757D] mt-0.5">
                                Unit Price: {formatKes(item.unitPriceKes)} ({item.unitLabel}) &bull; MOQ: {item.moq}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="inline-flex items-center">
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.productSlug, item.quantity - item.moq)
                                }
                                aria-label={`Decrease quantity of ${item.productName}`}
                                className="min-h-[44px] min-w-[44px] bg-[#F5F5F5] border border-gray-300 inline-flex items-center justify-center text-[#3D464D] hover:bg-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <Minus className="w-4 h-4" aria-hidden="true" />
                              </button>
                              <span className="min-h-[44px] min-w-[56px] border-y border-gray-300 px-3 inline-flex items-center justify-center text-base font-bold text-[#3D464D]">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  updateQuantity(item.productSlug, item.quantity + item.moq)
                                }
                                aria-label={`Increase quantity of ${item.productName}`}
                                className="min-h-[44px] min-w-[44px] bg-[#F5F5F5] border border-gray-300 inline-flex items-center justify-center text-[#3D464D] hover:bg-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <Plus className="w-4 h-4" aria-hidden="true" />
                              </button>

                              <button
                                type="button"
                                onClick={() => removeItem(item.productSlug)}
                                aria-label={`Remove ${item.productName} from order`}
                                className="ml-2 min-h-[44px] min-w-[44px] border border-gray-200 inline-flex items-center justify-center text-[#dc3545] hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                              >
                                <Trash2 className="w-4 h-4" aria-hidden="true" />
                              </button>
                            </div>

                            <p className="text-base font-bold text-[#3D464D] text-right ml-auto">
                              {formatKes(lineTotal)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Step 18: Subtotal right-aligned text, full width on mobile */}
                  <div className="w-full pt-3 border-t border-gray-200 text-right">
                    <span className="text-xs uppercase tracking-wider text-[#6C757D] mr-2">
                      Supplier Subtotal:
                    </span>
                    <span className="text-lg font-bold text-[#3D464D]">
                      {formatKes(group.subtotal)}
                    </span>
                  </div>
                </section>
              ))}

              {/* Grand Total Summary Banner */}
              <div className="bg-[#3D464D] text-white p-5 w-full text-right">
                <span className="text-sm uppercase tracking-wider text-[#F5F5F5] mr-3">
                  Wholesale Grand Total ({supplierGroups.length}{' '}
                  {supplierGroups.length === 1 ? 'Supplier' : 'Suppliers'}):
                </span>
                <span className="text-2xl sm:text-3xl font-bold text-[#FFD333]">
                  {formatKes(grandTotalKes)}
                </span>
              </div>
            </div>

            {/* Right 5 Columns: Checkout Form */}
            <form
              onSubmit={handleConfirmOrder}
              className="lg:col-span-5 bg-white border border-gray-200 p-6 space-y-4"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-[#3D464D] pb-3 border-b border-gray-200">
                Delivery & Trade Terms Checkout
              </h2>

              <div>
                <label
                  htmlFor="checkout-address"
                  className="block text-sm font-semibold text-[#3D464D] mb-1"
                >
                  Shop / Warehouse Delivery Address
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="checkout-county"
                  className="block text-sm font-semibold text-[#3D464D] mb-1"
                >
                  Delivery County
                </label>
                <select
                  id="checkout-county"
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {KENYAN_COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c} County
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="checkout-terms"
                  className="block text-sm font-semibold text-[#3D464D] mb-1"
                >
                  Wholesale Payment Terms (LPO Placeholder)
                </label>
                <select
                  id="checkout-terms"
                  value={paymentTerms}
                  onChange={(e) =>
                    setPaymentTerms(e.target.value as '30 days' | '60 days' | 'immediate')
                  }
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="30 days">30 Days Net Trade Credit</option>
                  <option value="60 days">60 Days Net Trade Credit</option>
                  <option value="immediate">Immediate On-Delivery Settlement</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="checkout-notes"
                  className="block text-sm font-semibold text-[#3D464D] mb-1"
                >
                  Offloading & Gate Notes (Optional)
                </label>
                <textarea
                  id="checkout-notes"
                  rows={3}
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="Deliver before 4:00 PM; call shop manager on arrival..."
                  className="w-full min-h-[84px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="bg-[#F5F5F5] p-4 space-y-2 text-right">
                <div className="flex justify-between text-sm text-[#6C757D]">
                  <span> County Dispatch Handling</span>
                  <span className="font-semibold text-[#28a745]">Included</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#3D464D] pt-2 border-t border-gray-200">
                  <span>Grand Total</span>
                  <span>{formatKes(grandTotalKes)}</span>
                </div>
              </div>

              <RecaptchaWidget
                requireV2={requireV2}
                v2Verified={Boolean(v2Token)}
                onVerifyV2={(tok) => setV2Token(tok)}
                actionName="confirm_order"
              />

              {errorMsg && (
                <p role="alert" className="text-sm font-semibold text-red-600">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full min-h-[48px] min-w-[44px] bg-[#FFD333] px-6 py-3.5 text-base font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                {submitting ? 'Confirming Bulk Order...' : `Confirm Bulk Order (${formatKes(grandTotalKes)})`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

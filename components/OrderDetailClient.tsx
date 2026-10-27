'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { Check, ArrowLeft, Download, AlertTriangle } from 'lucide-react'
import { INITIAL_ORDERS, formatKes, type OrderRecord } from '@/lib/data'
import { useMarketplaceStore } from '@/lib/store'
import { getRecaptchaV3Token, RecaptchaWidget } from '@/components/RecaptchaWidget'

const TIMELINE_STEPS: OrderRecord['status'][] = [
  'Booked',
  'Confirmed',
  'Dispatched',
  'Delivered',
]

export function OrderDetailClient({
  orderId,
  initialOrder,
}: {
  orderId: string
  initialOrder?: OrderRecord
}) {
  const clientOrders = useMarketplaceStore((s) => s.placedOrders)
  const timelineRef = useRef<HTMLDivElement>(null)

  const order = useMemo(() => {
    if (initialOrder) return initialOrder
    const foundClient = clientOrders.find((o) => o.id === orderId || o.reference === orderId)
    return foundClient || INITIAL_ORDERS[0]
  }, [orderId, initialOrder, clientOrders])

  const activeIdx = TIMELINE_STEPS.indexOf(order.status)

  // Step 16 Effect #9: Order status timeline draw-in from top to bottom on order detail page (GSAP)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !timelineRef.current) return

    const steps = timelineRef.current.querySelectorAll('.timeline-step-node')
    const ctx = gsap.context(() => {
      gsap.fromTo(
        steps,
        { opacity: 0, y: 18, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.14,
          ease: 'power2.out',
        }
      )
    }, timelineRef)

    return () => ctx.revert()
  }, [order.id])

  // Report Issue Form State
  const [subject, setSubject] = useState('Delayed county dispatch')
  const [description, setDescription] = useState('')
  const [requireV2, setRequireV2] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [issueFeedback, setIssueFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  const handleDownloadLpoPdf = async () => {
    const [{ jsPDF }, QRCode] = await Promise.all([import('jspdf'), import('qrcode')])
    const doc = new jsPDF()
    const qrDataUrl = await QRCode.toDataURL(
      `https://lydiamarket.co.ke/dashboard/order/${order.reference}`
    )

    doc.setFillColor(61, 70, 77)
    doc.rect(0, 0, 210, 32, 'F')
    doc.setTextColor(255, 211, 51)
    doc.setFontSize(18)
    doc.text('LYDIA MARKET KENYA - OFFICIAL WHOLESALE LPO', 14, 20)

    doc.setTextColor(61, 70, 77)
    doc.setFontSize(11)
    doc.text(`Order Reference: ${order.reference}`, 14, 44)
    doc.text(`Date Issued: ${order.date}`, 14, 51)
    doc.text(`Verified Supplier: ${order.supplierName}`, 14, 58)
    doc.text(`Delivery Address: ${order.deliveryAddress}, ${order.county} County`, 14, 65)
    doc.text(`Payment Terms: ${order.paymentTerms} | Status: ${order.status}`, 14, 72)

    doc.addImage(qrDataUrl, 'PNG', 165, 36, 30, 30)

    let y = 88
    doc.setFillColor(255, 211, 51)
    doc.rect(14, y - 6, 182, 9, 'F')
    doc.setFontSize(10)
    doc.text('Product Description', 16, y)
    doc.text('Qty', 132, y)
    doc.text('Unit KES', 150, y)
    doc.text('Total KES', 174, y)

    y += 10
    order.items.forEach((item) => {
      doc.text(item.productName.slice(0, 56), 16, y)
      doc.text(String(item.quantity), 132, y)
      doc.text(item.unitPriceKes.toLocaleString('en-KE'), 150, y)
      doc.text(item.lineTotalKes.toLocaleString('en-KE'), 174, y)
      y += 8
    })

    doc.setFontSize(12)
    doc.text(`Grand Total: ${formatKes(order.totalKes)}`, 132, y + 10)
    doc.save(`${order.reference}-Lydia-Market-LPO.pdf`)
  }

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setIssueFeedback(null)

    try {
      const recaptchaToken = await getRecaptchaV3Token('report_order_issue')
      const res = await fetch('/api/issues/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order.reference,
          subject,
          description,
          recaptchaToken,
          recaptchaV2Token: v2Token,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.requireV2) setRequireV2(true)
        setIssueFeedback({ ok: false, msg: data.error || 'Could not submit issue report.' })
      } else {
        setIssueFeedback({ ok: true, msg: data.message })
        setDescription('')
      }
    } catch {
      setIssueFeedback({ ok: false, msg: 'Network error. Please retry.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/dashboard"
            className="min-h-[44px] min-w-[44px] inline-flex items-center gap-2 text-sm font-bold text-[#3D464D] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Back to Buyer Dashboard</span>
          </Link>

          <button
            type="button"
            onClick={handleDownloadLpoPdf}
            className="min-h-[44px] min-w-[44px] bg-[#3D464D] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#FFD333] hover:bg-[#FFD333] hover:text-[#3D464D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span>Download Official LPO (PDF + QR)</span>
          </button>
        </div>

        {/* Order Header Card */}
        <section className="bg-white border border-gray-200 p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#6C757D]">
                Purchase Order Reference
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D464D] mt-0.5">
                {order.reference}
              </h1>
              <p className="text-sm text-[#6C757D] mt-1">
                Placed on {order.date} &bull; {order.paymentTerms}
              </p>
            </div>

            <div className="text-left md:text-right space-y-1">
              <p className="text-sm font-bold text-[#3D464D]">{order.supplierName}</p>
              <p className="text-xs sm:text-sm text-[#6C757D]">
                {order.deliveryAddress}, {order.county} County
              </p>
            </div>
          </div>

          {/* Step 4 & Step 18 Status Timeline: Mobile flex flex-col gap-4, md:flex-row md:items-start */}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#3D464D] mb-4">
              Fulfilment Status Timeline
            </h2>
            <div ref={timelineRef} className="flex flex-col gap-4 md:flex-row md:items-start">
              {TIMELINE_STEPS.map((step, index) => {
                const completed = index <= activeIdx
                return (
                  <div
                    key={step}
                    className="timeline-step-node flex-1 flex items-center md:flex-col md:items-start gap-3.5 p-4 border border-gray-200 bg-[#F5F5F5]"
                  >
                    <div
                      className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-bold text-sm ${
                        completed
                          ? 'bg-[#FFD333] text-[#3D464D] border-2 border-[#3D464D]'
                          : 'bg-white text-[#6C757D] border border-gray-300'
                      }`}
                    >
                      {completed ? <Check className="w-5 h-5" aria-hidden="true" /> : index + 1}
                    </div>
                    <div>
                      <p className="text-base font-bold text-[#3D464D]">{step}</p>
                      <p className="text-xs text-[#6C757D]">
                        {completed ? 'Completed & logged' : 'Scheduled'}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Step 4 & Step 18 Order Items Table: overflow-x-auto wrapper, min-w-[480px] inner div */}
        <section className="bg-white border border-gray-200 p-6 space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#3D464D]">Order Line Items</h2>

          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#3D464D] text-white text-xs uppercase tracking-wider">
                    <th className="py-3 px-3.5 font-bold">Product Name</th>
                    <th className="py-3 px-3.5 font-bold">Quantity</th>
                    <th className="py-3 px-3.5 font-bold">Unit Price</th>
                    <th className="py-3 px-3.5 font-bold text-right">Line Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {order.items.map((item) => (
                    <tr key={item.productSlug}>
                      <td className="py-3.5 px-3.5 font-semibold text-[#3D464D]">
                        <Link
                          href={`/product/${item.productSlug}`}
                          className="min-h-[44px] inline-flex items-center hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          {item.productName}
                        </Link>
                      </td>
                      <td className="py-3.5 px-3.5 text-[#3D464D]">{item.quantity}</td>
                      <td className="py-3.5 px-3.5 text-[#495057]">
                        {formatKes(item.unitPriceKes)}
                      </td>
                      <td className="py-3.5 px-3.5 font-bold text-[#3D464D] text-right">
                        {formatKes(item.lineTotalKes)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#F5F5F5] font-bold text-[#3D464D]">
                    <td colSpan={3} className="py-4 px-3.5 text-right uppercase text-xs tracking-wider">
                      Total Order Value (KES)
                    </td>
                    <td className="py-4 px-3.5 text-right text-lg">{formatKes(order.totalKes)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* Report Issue Form */}
        <section className="bg-white border border-gray-200 p-6 max-w-2xl space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#FFD333]" aria-hidden="true" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#3D464D]">
              Report an Issue With This Order
            </h2>
          </div>

          <form onSubmit={handleReportIssue} className="space-y-4">
            <div>
              <label htmlFor="issue-subject" className="block text-sm font-semibold text-[#3D464D] mb-1">
                Issue Category
              </label>
              <select
                id="issue-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="Delayed county dispatch">Delayed county dispatch</option>
                <option value="Short carton / bale count">Short carton or bale count</option>
                <option value="Damaged outer packaging">Damaged outer packaging in transit</option>
                <option value="eTIMS invoice discrepancy">KRA eTIMS invoice discrepancy</option>
              </select>
            </div>

            <div>
              <label htmlFor="issue-desc" className="block text-sm font-semibold text-[#3D464D] mb-1">
                Issue Description
              </label>
              <textarea
                id="issue-desc"
                rows={3}
                required
                minLength={10}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide batch number, carton count, or delivery driver notes..."
                className="w-full min-h-[88px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <RecaptchaWidget
              requireV2={requireV2}
              v2Verified={Boolean(v2Token)}
              onVerifyV2={(tok) => setV2Token(tok)}
              actionName="report_order_issue"
            />

            {issueFeedback && (
              <p
                role="status"
                className={`text-sm font-semibold ${
                  issueFeedback.ok ? 'text-[#28a745]' : 'text-[#dc3545]'
                }`}
              >
                {issueFeedback.msg}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto min-h-[48px] min-w-[44px] bg-[#FFD333] px-6 py-3 text-base font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              {submitting ? 'Submitting Ticket...' : 'Submit Issue Report'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}

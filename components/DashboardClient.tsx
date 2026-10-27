'use client'

import { useEffect, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import gsap from 'gsap'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import {
  ShoppingBag,
  Truck,
  Wallet,
  BookmarkCheck,
  Eye,
  PlusCircle,
  MapPin,
} from 'lucide-react'
import {
  CATEGORY_SPEND_DATA,
  MONTHLY_SPEND_DATA,
  SUPPLIERS,
  formatKes,
  type OrderRecord,
} from '@/lib/data'
import { useMarketplaceStore } from '@/lib/store'

interface DashboardClientProps {
  buyerName: string
  businessName: string
  county: string
  serverOrders: OrderRecord[]
}

export function DashboardClient({
  buyerName,
  businessName,
  county,
  serverOrders,
}: DashboardClientProps) {
  const savedSupplierSlugs = useMarketplaceStore((s) => s.savedSuppliers)
  const clientOrders = useMarketplaceStore((s) => s.placedOrders)

  const summaryRef = useRef<HTMLDivElement>(null)

  const allOrders = useMemo(() => {
    const map = new Map<string, OrderRecord>()
    for (const o of clientOrders) map.set(o.id, o)
    for (const o of serverOrders) {
      if (!map.has(o.id)) map.set(o.id, o)
    }
    return Array.from(map.values())
  }, [clientOrders, serverOrders])

  const activeOrdersCount = allOrders.filter((o) => o.status !== 'Delivered').length
  const pendingDeliveriesCount = allOrders.filter(
    (o) => o.status === 'Confirmed' || o.status === 'Dispatched'
  ).length
  const monthSpendKes = allOrders.reduce((sum, o) => sum + o.totalKes, 0)
  const savedSuppliersList = SUPPLIERS.filter((s) => savedSupplierSlugs.includes(s.slug))

  // Step 16 Effect #7: Dashboard summary card numbers count-up on mount (GSAP)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !summaryRef.current) return

    const counters = summaryRef.current.querySelectorAll<HTMLElement>('[data-count-target]')
    const ctx = gsap.context(() => {
      counters.forEach((el) => {
        const target = Number(el.dataset.countTarget || '0')
        const prefix = el.dataset.countPrefix || ''
        const tracker = { val: 0 }
        gsap.to(tracker, {
          val: target,
          duration: 1.0,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = `${prefix}${Math.round(tracker.val).toLocaleString('en-KE')}`
          },
        })
      })
    }, summaryRef)

    return () => ctx.revert()
  }, [activeOrdersCount, pendingDeliveriesCount, monthSpendKes, savedSuppliersList.length])

  const statusBadgeClass = (status: OrderRecord['status']) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-50 border-green-200 text-[#28a745]'
      case 'Dispatched':
        return 'bg-[#FFFDF2] border-[#FFD333] text-[#3D464D]'
      case 'Confirmed':
        return 'bg-sky-50 border-sky-200 text-[#17a2b8]'
      default:
        return 'bg-[#F5F5F5] border-gray-300 text-[#3D464D]'
    }
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Welcome Header */}
        <div className="bg-white border border-gray-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#6C757D]">
              Verified Buyer Portal &bull; {county} County
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D464D] mt-1">
              {businessName}
            </h1>
            <p className="text-sm text-[#6C757D] mt-0.5">Signed in as {buyerName}</p>
          </div>

          <Link
            href="/catalogue"
            className="min-h-[44px] min-w-[44px] bg-[#FFD333] px-5 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            <PlusCircle className="w-4 h-4" aria-hidden="true" />
            <span>Place New Stock Order</span>
          </Link>
        </div>

        {/* Step 4 & Step 18 Summary Cards: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 */}
        <section aria-label="Account summary metrics" ref={summaryRef}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6C757D]">
                  Active Orders
                </p>
                <p
                  data-count-target={activeOrdersCount}
                  className="text-2xl sm:text-3xl font-bold text-[#3D464D] mt-1"
                >
                  {activeOrdersCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#FFD333] text-[#3D464D] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6C757D]">
                  Pending Deliveries
                </p>
                <p
                  data-count-target={pendingDeliveriesCount}
                  className="text-2xl sm:text-3xl font-bold text-[#3D464D] mt-1"
                >
                  {pendingDeliveriesCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#3D464D] text-[#FFD333] flex items-center justify-center">
                <Truck className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6C757D]">
                  Total Spend This Month
                </p>
                <p
                  data-count-target={monthSpendKes}
                  data-count-prefix="KES "
                  className="text-2xl sm:text-3xl font-bold text-[#3D464D] mt-1"
                >
                  {formatKes(monthSpendKes)}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#FFD333] text-[#3D464D] flex items-center justify-center">
                <Wallet className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#6C757D]">
                  Saved Suppliers
                </p>
                <p
                  data-count-target={savedSuppliersList.length}
                  className="text-2xl sm:text-3xl font-bold text-[#3D464D] mt-1"
                >
                  {savedSuppliersList.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-[#3D464D] text-[#FFD333] flex items-center justify-center">
                <BookmarkCheck className="w-6 h-6" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>

        {/* Step 4 & Step 18 Analytics Charts: Recharts LineChart + BarChart */}
        <section aria-label="Wholesale spend analytics" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 p-5 sm:p-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#3D464D]">
              Monthly Spend Over Last 6 Months (KES)
            </h2>
            <div className="w-full h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MONTHLY_SPEND_DATA} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#3D464D' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#3D464D' }}
                    tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`KES ${value.toLocaleString('en-KE')}`, 'Monthly Spend']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line
                    type="monotone"
                    dataKey="spendKes"
                    name="Wholesale Spend (KES)"
                    stroke="#3D464D"
                    strokeWidth={3}
                    dot={{ r: 5, fill: '#FFD333', stroke: '#3D464D', strokeWidth: 2 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-gray-200 p-5 sm:p-6 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-[#3D464D]">
              Spend by Product Category (KES)
            </h2>
            <div className="w-full h-48 sm:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORY_SPEND_DATA} margin={{ top: 8, right: 16, left: 4, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: '#3D464D' }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#3D464D' }}
                    tickFormatter={(v) => `${Math.round(Number(v) / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => [`KES ${value.toLocaleString('en-KE')}`, 'Category Spend']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar
                    dataKey="spendKes"
                    name="Spend by Category (KES)"
                    fill="#FFD333"
                    stroke="#3D464D"
                    strokeWidth={1.5}
                    isAnimationActive={true}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* Step 4 & Step 18 Recent Orders Table */}
        <section aria-labelledby="recent-orders-heading" className="bg-white border border-gray-200 p-5 sm:p-6">
          <h2
            id="recent-orders-heading"
            className="text-xl sm:text-2xl font-bold text-[#3D464D] mb-4"
          >
            Recent Wholesale Orders
          </h2>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[640px] px-4 sm:px-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#3D464D] text-white text-xs uppercase tracking-wider">
                    <th className="py-3.5 px-3 font-bold">Order Ref</th>
                    <th className="py-3.5 px-3 font-bold">Supplier</th>
                    <th className="py-3.5 px-3 font-bold">Items</th>
                    <th className="py-3.5 px-3 font-bold">Total KES</th>
                    <th className="py-3.5 px-3 font-bold">Status</th>
                    <th className="py-3.5 px-3 font-bold">Date</th>
                    <th className="py-3.5 px-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {allOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#F5F5F5]/70">
                      <td className="py-3 px-3 font-bold text-[#3D464D]">{order.reference}</td>
                      <td className="py-3 px-3 text-[#495057]">{order.supplierName}</td>
                      <td className="py-3 px-3 text-[#3D464D] font-medium">{order.itemsCount}</td>
                      <td className="py-3 px-3 font-bold text-[#3D464D]">
                        {formatKes(order.totalKes)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block border px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-[#6C757D]">{order.date}</td>
                      <td className="py-2 px-3 text-right">
                        <Link
                          href={`/dashboard/order/${order.id}`}
                          className="min-h-[44px] min-w-[68px] bg-[#FFD333] px-3.5 py-2 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                        >
                          <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-center mt-2 opacity-60 sm:hidden">
            Swipe sideways to inspect totals, status, and view buttons
          </p>
        </section>

        {/* Step 4 & Step 18 Saved Suppliers: grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 */}
        <section aria-labelledby="saved-suppliers-heading" className="space-y-4">
          <h2
            id="saved-suppliers-heading"
            className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D]"
          >
            <span>Saved Suppliers</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {(savedSuppliersList.length > 0 ? savedSuppliersList : SUPPLIERS.slice(0, 4)).map(
              (supplier) => (
                <Link
                  key={supplier.slug}
                  href={`/supplier/${supplier.slug}`}
                  className="product-item min-h-[44px] min-w-[44px] bg-white border border-gray-200 p-3.5 flex flex-col justify-between space-y-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#F5F5F5]">
                      <Image
                        src={supplier.coverImage}
                        alt={supplier.name}
                        fill
                        sizes="(max-width: 640px) 50vw, 25vw"
                        className="aspect-[4/3] w-full object-cover rounded-lg"
                      />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-[#3D464D] mt-2.5 line-clamp-2">
                      {supplier.name}
                    </h3>
                  </div>

                  <p className="text-xs text-[#6C757D] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#3D464D] flex-shrink-0" aria-hidden="true" />
                    <span>{supplier.county}</span>
                  </p>
                </Link>
              )
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

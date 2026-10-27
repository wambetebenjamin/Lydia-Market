'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ShieldCheck,
  Boxes,
  Activity,
  Lock,
  UtensilsCrossed,
  Sparkles,
  Smartphone,
  BookOpen,
  SprayCan,
  Sprout,
  Scissors,
  Wrench,
  UserPlus,
  SearchCheck,
  Truck,
  ClipboardCheck,
  Upload,
  PackageCheck,
  Quote,
  ArrowRight,
} from 'lucide-react'
import { CATEGORIES, PRODUCTS, SUPPLIERS, TESTIMONIALS } from '@/lib/data'
import { SupplierCard } from '@/components/SupplierCard'
import { ProductCard } from '@/components/ProductCard'

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  Sparkles,
  Smartphone,
  BookOpen,
  SprayCan,
  Sprout,
  Scissors,
  Wrench,
}

export function HomeClient() {
  const catGridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || !catGridRef.current) return

    gsap.registerPlugin(ScrollTrigger)
    const icons = catGridRef.current.querySelectorAll('.cat-icon-badge')

    const ctx = gsap.context(() => {
      gsap.fromTo(
        icons,
        { scale: 0.72, y: 14, opacity: 0 },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: catGridRef.current,
            start: 'top 85%',
            once: true,
          },
        }
      )
    }, catGridRef)

    return () => ctx.revert()
  }, [])

  const featuredSuppliers = SUPPLIERS.filter((s) => s.featured)
  const featuredProducts = PRODUCTS.slice(0, 8)

  return (
    <div className="space-y-12 sm:space-y-16 py-6 sm:py-8">
      {/* 1. MultiShop Split Hero Section */}
      <section aria-label="Wholesale Marketplace Hero">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Hero Card (MultiShop Carousel Panel Style) */}
            <div className="lg:col-span-8 relative min-h-[420px] sm:min-h-[450px] overflow-hidden bg-[#3D464D] flex items-center">
              <Image
                src="/images/hero-warehouse.jpg"
                alt="High-bay Kenyan wholesale distribution warehouse stocked with cartons"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[#3D464D]/75" aria-hidden="true" />

              <div className="relative z-10 p-6 sm:p-10 lg:p-12 max-w-2xl space-y-5">
                <span className="inline-block bg-[#FFD333] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3D464D]">
                  Kenya B2B Wholesale Marketplace
                </span>

                {/* Step 16 Effect #3 & Step 18 Hero h1 Scale */}
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight"
                >
                  Buy wholesale. Grow your business.
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
                  className="text-sm sm:text-base md:text-lg text-[#F5F5F5] leading-relaxed"
                >
                  Source directly from verified Kenyan manufacturers and primary distributors. Skip the middleman, secure transparent KES factory pricing, and manage every bulk order in one dashboard.
                </motion.p>

                {/* Step 18 Hero CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-1"
                >
                  <Link
                    href="/catalogue"
                    className="w-full sm:w-auto min-h-[48px] min-w-[44px] bg-[#FFD333] px-6 py-3 inline-flex items-center justify-center gap-2 text-sm sm:text-base font-bold text-[#3D464D] hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    <span>Browse Catalogue</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href="/register"
                    className="w-full sm:w-auto min-h-[48px] min-w-[44px] border-2 border-white bg-transparent px-6 py-3 inline-flex items-center justify-center text-sm sm:text-base font-semibold text-white hover:bg-white hover:text-[#3D464D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    Register as a Buyer
                  </Link>
                </motion.div>
              </div>
            </div>

            {/* Right MultiShop Stacked Promo Banners */}
            <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              <div className="relative min-h-[205px] overflow-hidden bg-[#3D464D] group flex items-center justify-center text-center p-6">
                <Image
                  src="/images/offer-market.jpg"
                  alt="East African wholesale market bales and grain staples"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#3D464D]/65" aria-hidden="true" />
                <div className="relative z-10 space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FFD333]">
                    Factory-Gate Margins
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Fast-Moving Shop Staples
                  </h2>
                  <Link
                    href="/catalogue?category=Food%20and%20Beverages"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center bg-[#FFD333] px-5 py-2.5 text-sm font-bold text-[#3D464D] hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    Order Staples
                  </Link>
                </div>
              </div>

              <div className="relative min-h-[205px] overflow-hidden bg-[#3D464D] group flex items-center justify-center text-center p-6">
                <Image
                  src="/images/offer-depot.jpg"
                  alt="Kenyan manufacturer dispatch loading bay and pallets"
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#3D464D]/65" aria-hidden="true" />
                <div className="relative z-10 space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#FFD333]">
                    30 & 60-Day Trade Terms
                  </p>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    Sell Direct to 12,800+ Shops
                  </h2>
                  <Link
                    href="/supplier-apply"
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center bg-[#FFD333] px-5 py-2.5 text-sm font-bold text-[#3D464D] hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    List as Supplier
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. MultiShop Trust Bar */}
      <section aria-label="Marketplace Trust Guarantees">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Verified Suppliers Only',
                desc: 'KRA PIN, KEBS marks, and physical depots audited before listing',
              },
              {
                icon: Boxes,
                title: 'Minimum Order Flexibility',
                desc: 'Practical carton and bale MOQs sized for dukas and supermarkets',
              },
              {
                icon: Activity,
                title: 'Real-Time Inventory',
                desc: 'Live depot stock counts updated directly by manufacturers',
              },
              {
                icon: Lock,
                title: 'Secure Order Management',
                desc: 'Digital LPOs, eTIMS invoices, and tracked county delivery',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div
                  key={item.title}
                  className="bg-white border border-gray-200 p-6 flex items-start gap-4"
                >
                  <div className="w-12 h-12 flex-shrink-0 bg-[#F5F5F5] flex items-center justify-center">
                    <Icon className="w-7 h-7 text-[#FFD333] stroke-[2.2]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#3D464D]">{item.title}</h3>
                    <p className="text-sm text-[#6C757D] mt-1">{item.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Product Categories (Exact Step 4 & Step 18 Grid: grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4) */}
      <section aria-labelledby="categories-heading">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="categories-heading"
            className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D] mb-6"
          >
            <span>Product Categories</span>
          </h2>

          <div ref={catGridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => {
              const IconComp = CATEGORY_ICONS[category.icon] || Boxes
              return (
                <Link
                  key={category.name}
                  href={`/catalogue?category=${encodeURIComponent(category.name)}`}
                  className="cat-item min-h-[88px] min-w-[44px] border border-gray-200 p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  <div className="cat-icon-badge w-12 h-12 flex-shrink-0 bg-[#3D464D] text-[#FFD333] flex items-center justify-center">
                    <IconComp className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-[#3D464D] leading-snug">
                      {category.name}
                    </h3>
                    <p className="text-xs text-[#6C757D] mt-0.5 line-clamp-1">
                      {category.shortDesc}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* 4. Featured Suppliers (4 Supplier Cards with Pexels images, verified badges, View Catalogue) */}
      <section aria-labelledby="featured-suppliers-heading">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <h2
              id="featured-suppliers-heading"
              className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D]"
            >
              <span>Featured Verified Suppliers</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredSuppliers.map((supplier) => (
              <SupplierCard key={supplier.slug} supplier={supplier} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Fast-Moving Wholesale Stock Preview */}
      <section aria-labelledby="fast-moving-heading">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <h2
              id="fast-moving-heading"
              className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D]"
            >
              <span>Fast-Moving Wholesale Stock</span>
            </h2>
            <Link
              href="/catalogue"
              className="min-h-[44px] min-w-[44px] px-4 inline-flex items-center justify-center bg-white border border-[#3D464D] text-sm font-bold text-[#3D464D] hover:bg-[#FFD333] whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              View All {PRODUCTS.length} Products
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product, idx) => (
              <ProductCard key={product.slug} product={product} index={idx} />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Impact Numbers Strip */}
      <section aria-label="Lydia Market Nationwide Trade Impact" className="bg-[#3D464D] py-12 text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: '340+', label: 'Verified Kenyan Suppliers' },
              { value: '12,800+', label: 'Registered Retail Buyers' },
              { value: '94,500+', label: 'Wholesale Orders Processed' },
              { value: '47', label: 'Counties Reached Across Kenya' },
            ].map((stat) => (
              <div key={stat.label} className="p-4 border border-white/15 bg-white/5">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#FFD333]">
                  {stat.value}
                </p>
                <p className="text-sm sm:text-base text-[#F5F5F5] mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. How It Works: Buyers & Suppliers */}
      <section aria-labelledby="how-it-works-heading">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <h2
              id="how-it-works-heading"
              className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D] mb-6"
            >
              <span>How Lydia Market Works for Buyers</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  icon: UserPlus,
                  title: 'Register Your Shop Account',
                  desc: 'Sign up in two minutes as a Kenyan retailer, wholesaler, school, or institution and unlock verified trade pricing.',
                },
                {
                  step: '02',
                  icon: SearchCheck,
                  title: 'Browse Verified Supplier Catalogues',
                  desc: 'Compare carton unit prices in KES, minimum order quantities, and real-time depot stock without calling middlemen.',
                },
                {
                  step: '03',
                  icon: Truck,
                  title: 'Place Bulk Orders & Track Delivery',
                  desc: 'Combine items from multiple manufacturers into one checkout, select trade credit terms, and follow dispatch live.',
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="bg-white border border-gray-200 p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-[#FFD333] text-[#3D464D] flex items-center justify-center">
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <span className="text-2xl font-bold text-[#3D464D]/25">{item.step}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#3D464D]">{item.title}</h3>
                    <p className="text-sm sm:text-base text-[#6C757D] leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div>
            <h2 className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D] mb-6">
              <span>How Lydia Market Works for Suppliers</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '01',
                  icon: ClipboardCheck,
                  title: 'Apply to List Your Company',
                  desc: 'Submit your business registration certificate, KRA PIN, and 6+ months trading history for fast verification.',
                },
                {
                  step: '02',
                  icon: Upload,
                  title: 'Upload Your Product Catalogue',
                  desc: 'Publish wholesale SKUs, carton pack sizes, KES unit pricing, county lead times, and minimum order quantities.',
                },
                {
                  step: '03',
                  icon: PackageCheck,
                  title: 'Receive & Manage Buyer Orders',
                  desc: 'Accept digital purchase orders from verified Kenyan shops across 47 counties without chasing manual spreadsheets.',
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.step} className="bg-white border border-gray-200 p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 bg-[#3D464D] text-[#FFD333] flex items-center justify-center">
                        <Icon className="w-6 h-6" aria-hidden="true" />
                      </div>
                      <span className="text-2xl font-bold text-[#3D464D]/25">{item.step}</span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#3D464D]">{item.title}</h3>
                    <p className="text-sm sm:text-base text-[#6C757D] leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 8. Testimonials from 3 Kenyan Retailers */}
      <section aria-labelledby="testimonials-heading">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="testimonials-heading"
            className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D] mb-6"
          >
            <span>Trusted by Kenyan Retailers</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((item) => (
              <article
                key={item.id}
                className="bg-white border border-gray-200 p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <Quote className="w-8 h-8 text-[#FFD333]" aria-hidden="true" />
                  <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-3.5 pt-4 border-t border-[#F5F5F5]">
                  <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#FFD333]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#3D464D]">{item.name}</h3>
                    <p className="text-xs sm:text-sm text-[#6C757D]">{item.business}</p>
                    <p className="text-xs font-semibold text-[#3D464D]">{item.county}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

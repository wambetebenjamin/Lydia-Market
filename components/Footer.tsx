'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  MessageCircle,
  Globe,
  Share2,
  Building2,
} from 'lucide-react'
import { getRecaptchaV3Token } from '@/components/RecaptchaWidget'

export function Footer() {
  const [email, setEmail] = useState('')
  const [statusMsg, setStatusMsg] = useState('')
  const [isError, setIsError] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setStatusMsg('')
    setIsError(false)

    try {
      const recaptchaToken = await getRecaptchaV3Token('newsletter_subscribe')
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recaptchaToken }),
      })
      const data = await res.json()
      if (!res.ok) {
        setIsError(true)
        setStatusMsg(data.error || 'Could not subscribe. Check your email address.')
      } else {
        setIsError(false)
        setStatusMsg(data.message || 'Subscribed to wholesale price updates.')
        setEmail('')
      }
    } catch {
      setIsError(true)
      setStatusMsg('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <footer className="bg-[#3D464D] text-[#F5F5F5] mt-16 pt-12 pb-24">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step 18 Footer Grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-white/15">
          {/* Column 1: Brand & Kenyan Trade Desk */}
          <div className="space-y-4">
            <div className="inline-flex items-center">
              <span className="bg-white px-2.5 py-1 text-xl font-bold uppercase tracking-tight text-[#3D464D]">
                Lydia
              </span>
              <span className="bg-[#FFD333] px-2.5 py-1 text-xl font-bold uppercase tracking-tight text-[#3D464D]">
                Market
              </span>
            </div>
            <p className="text-sm leading-relaxed text-[#F5F5F5]/85">
              Source smart. Sell more. Kenya&apos;s verified B2B wholesale marketplace connecting retail shops, mini-marts, and institutions directly with manufacturers and primary distributors.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#FFD333] flex-shrink-0" aria-hidden="true" />
                <span>Enterprise Road, Industrial Area, Nairobi, Kenya</span>
              </li>
              <li>
                <a
                  href="mailto:trade@lydiamarket.co.ke"
                  className="min-h-[44px] inline-flex items-center gap-2.5 hover:text-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Mail className="w-4 h-4 text-[#FFD333] flex-shrink-0" aria-hidden="true" />
                  <span>trade@lydiamarket.co.ke</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/254112272061?text=Hi%20Lydia%20Market%2C%20I%27d%20like%20to%20learn%20more%20about%20sourcing%20wholesale"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2.5 hover:text-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Phone className="w-4 h-4 text-[#FFD333] flex-shrink-0" aria-hidden="true" />
                  <span>WhatsApp Trade Desk: +254 112 272 061</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Wholesale Marketplace Links */}
          <div>
            <h4 className="text-base font-bold uppercase tracking-wider text-white mb-4">
              Marketplace
            </h4>
            <ul className="space-y-1">
              {[
                { href: '/catalogue', label: 'Browse Wholesale Catalogue' },
                { href: '/register', label: 'Register as a Buyer' },
                { href: '/supplier-apply', label: 'Apply as a Verified Supplier' },
                { href: '/orders', label: 'Order Basket & Checkout' },
                { href: '/dashboard', label: 'Buyer Spend Dashboard' },
                { href: '/about', label: 'About Lydia Market' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="min-h-[44px] inline-flex items-center gap-1.5 text-sm text-[#F5F5F5]/85 hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ChevronRight className="w-4 h-4 text-[#FFD333]" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal & Governance */}
          <div>
            <h4 className="text-base font-bold uppercase tracking-wider text-white mb-4">
              Legal & Compliance
            </h4>
            <ul className="space-y-1">
              {[
                { href: '/legal/privacy-policy', label: 'Privacy Policy (KDPA 2019)' },
                { href: '/legal/terms', label: 'Marketplace Terms of Trade' },
                { href: '/legal/cookie-policy', label: 'Cookie Policy' },
                { href: '/login', label: 'Buyer Account Sign In' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="min-h-[44px] inline-flex items-center gap-1.5 text-sm text-[#F5F5F5]/85 hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <ChevronRight className="w-4 h-4 text-[#FFD333]" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Social */}
          <div>
            <h4 className="text-base font-bold uppercase tracking-wider text-white mb-4">
              Weekly Wholesale Price Index
            </h4>
            <p className="text-sm text-[#F5F5F5]/85 mb-4">
              Receive factory gate price updates across maize meal, edible oils, hardware, and fast-moving retail stock every Monday.
            </p>
            <form onSubmit={handleSubscribe} className="w-full max-w-md space-y-2">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <label htmlFor="footer-newsletter-email" className="sr-only">
                  Business email address
                </label>
                <input
                  id="footer-newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shop@yourbusiness.co.ke"
                  className="w-full min-h-[44px] bg-white px-3.5 py-2 text-base text-[#3D464D] placeholder-[#999999] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="min-h-[44px] min-w-[44px] sm:flex-shrink-0 bg-[#FFD333] px-4 py-2 text-sm font-bold text-[#3D464D] hover:bg-[#ffdf66] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  {submitting ? 'Saving...' : 'Subscribe'}
                </button>
              </div>
              {statusMsg && (
                <p
                  role="status"
                  className={`text-xs font-medium ${
                    isError ? 'text-[#ffc107]' : 'text-[#FFD333]'
                  }`}
                >
                  {statusMsg}
                </p>
              )}
            </form>

            <h5 className="text-xs font-bold uppercase tracking-wider text-white mt-6 mb-3">
              Connect With Us
            </h5>
            <div className="flex items-center gap-2">
              <a
                href="https://wa.me/254112272061?text=Hi%20Lydia%20Market%2C%20I%27d%20like%20to%20learn%20more%20about%20sourcing%20wholesale"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lydia Market on WhatsApp"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center bg-[#FFD333] text-[#3D464D] hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
              </a>
              <a
                href="https://github.com/wambetebenjamin/Lydia-Market"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Lydia Market portal link"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center bg-[#FFD333] text-[#3D464D] hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <Globe className="w-5 h-5" aria-hidden="true" />
              </a>
              <Link
                href="/about"
                aria-label="Lydia Market community and press"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center bg-[#FFD333] text-[#3D464D] hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <Share2 className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="/supplier-apply"
                aria-label="Partner manufacturers portal"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center bg-[#FFD333] text-[#3D464D] hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <Building2 className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5F5F5]/75">
          <p className="text-center sm:text-left">
            &copy; {new Date().getFullYear()}{' '}
            <span className="text-[#FFD333] font-semibold">Lydia Market Kenya Ltd</span>. All Rights Reserved. Facilitating verified B2B wholesale trade across 47 Kenyan counties.
          </p>
          <p className="text-center sm:text-right">
            KRA eTIMS Compliant Invoices &bull; KDPA 2019 Protected
          </p>
        </div>
      </div>
    </footer>
  )
}

'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ShieldCheck, X } from 'lucide-react'

const STORAGE_KEY = 'lydia-market-cookie-consent'

interface CookiePreferences {
  necessary: true
  functional: boolean
  analytics: boolean
  marketing: boolean
  updatedAt: string
}

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [functional, setFunctional] = useState(true)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) {
        setShowBanner(true)
      }
    } catch {
      setShowBanner(false)
    }
  }, [])

  const savePreferences = (prefs: CookiePreferences) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // Ignore storage quota issues in restricted browsing modes
    }
    setShowBanner(false)
    setShowModal(false)
  }

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      updatedAt: new Date().toISOString(),
    })
  }

  const handleSaveCustom = () => {
    savePreferences({
      necessary: true,
      functional,
      analytics,
      marketing,
      updatedAt: new Date().toISOString(),
    })
  }

  if (!showBanner && !showModal) return null

  return (
    <>
      {showBanner && (
        <aside
          aria-label="Cookie consent banner"
          className="fixed inset-x-0 bottom-0 z-[9990] border-t-2 border-[#FFD333] bg-[#3D464D] text-white shadow-2xl pb-safe"
        >
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex items-start gap-3 sm:pr-16 lg:pr-0">
                <ShieldCheck className="w-6 h-6 text-[#FFD333] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm leading-relaxed text-[#F5F5F5]">
                  We use cookies in compliance with the{' '}
                  <strong className="font-semibold text-white">
                    Kenya Data Protection Act, 2019 (KDPA)
                  </strong>{' '}
                  to secure wholesale sessions, remember your supplier order basket, and improve platform reliability. Read our{' '}
                  <Link
                    href="/legal/cookie-policy"
                    className="inline-block underline text-[#FFD333] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    Cookie Policy
                  </Link>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:px-16 lg:px-0 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="min-h-[44px] min-w-[44px] border border-white/60 bg-transparent px-4 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-[#3D464D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  Manage Preferences
                </button>
                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="min-h-[44px] min-w-[44px] bg-[#FFD333] px-5 py-2.5 text-sm font-bold text-[#3D464D] hover:bg-[#ffdf66] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {showModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cookie-modal-heading"
          className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center bg-black/60 p-0 sm:p-4"
        >
          <div className="w-full max-w-lg bg-white text-[#3D464D] rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 max-h-[85vh] overflow-y-auto pb-safe">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 id="cookie-modal-heading" className="text-lg sm:text-xl font-bold text-[#3D464D]">
                Cookie Privacy Preferences (KDPA 2019)
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                aria-label="Close cookie preferences"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#3D464D] hover:bg-[#F5F5F5] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-gray-200 my-4">
              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#3D464D]">
                    Necessary Cookies (Always Active)
                  </p>
                  <p className="text-xs sm:text-sm text-[#6C757D]">
                    Required for NextAuth buyer login, CSRF security, and multi-supplier order basket storage.
                  </p>
                </div>
                <span className="min-h-[44px] min-w-[64px] inline-flex items-center justify-center bg-[#F5F5F5] border border-gray-300 px-3 text-xs font-bold uppercase text-[#3D464D]">
                  Locked
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#3D464D]">Functional Cookies</p>
                  <p className="text-xs sm:text-sm text-[#6C757D]">
                    Remember your selected Kenyan county, category filters, and saved suppliers.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={functional}
                  onClick={() => setFunctional((v) => !v)}
                  className={`min-h-[44px] min-w-[64px] px-3 text-xs font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                    functional ? 'bg-[#FFD333] text-[#3D464D]' : 'bg-[#F5F5F5] text-[#6C757D]'
                  }`}
                >
                  {functional ? 'On' : 'Off'}
                </button>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#3D464D]">Analytics Cookies</p>
                  <p className="text-xs sm:text-sm text-[#6C757D]">
                    Measure catalogue search speed and route performance across mobile networks.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics((v) => !v)}
                  className={`min-h-[44px] min-w-[64px] px-3 text-xs font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                    analytics ? 'bg-[#FFD333] text-[#3D464D]' : 'bg-[#F5F5F5] text-[#6C757D]'
                  }`}
                >
                  {analytics ? 'On' : 'Off'}
                </button>
              </div>

              <div className="py-3 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-sm sm:text-base text-[#3D464D]">Marketing Cookies</p>
                  <p className="text-xs sm:text-sm text-[#6C757D]">
                    Tailor seasonal restock alerts and trade credit promotions for your shop type.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={marketing}
                  onClick={() => setMarketing((v) => !v)}
                  className={`min-h-[44px] min-w-[64px] px-3 text-xs font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                    marketing ? 'bg-[#FFD333] text-[#3D464D]' : 'bg-[#F5F5F5] text-[#6C757D]'
                  }`}
                >
                  {marketing ? 'On' : 'Off'}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveCustom}
                className="w-full sm:w-auto min-h-[44px] min-w-[44px] border border-[#3D464D] px-5 py-2.5 text-sm font-semibold text-[#3D464D] hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                Save Preferences
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full sm:w-auto min-h-[44px] min-w-[44px] bg-[#FFD333] px-5 py-2.5 text-sm font-bold text-[#3D464D] hover:bg-[#ffdf66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

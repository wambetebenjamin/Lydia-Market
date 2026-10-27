'use client'

import Link from 'next/link'
import { RotateCcw, Home, MessageCircle } from 'lucide-react'

export function ServerErrorView({ onRetry }: { onRetry?: () => void }) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry()
    } else if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="py-14 sm:py-20">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white border border-gray-200 p-8 sm:p-12 space-y-6">
          <div className="inline-flex items-center select-none">
            <span className="bg-[#3D464D] text-[#FFD333] px-3 py-1 text-2xl font-bold">500</span>
            <span className="bg-[#FFD333] text-[#3D464D] px-3 py-1 text-2xl font-bold">
              SERVER ERROR
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#3D464D]">
            Something went wrong on our end
          </h1>
          <p className="text-sm sm:text-base text-[#6C757D] max-w-xl mx-auto leading-relaxed">
            Our wholesale trade platform encountered an unexpected interruption. Your basket items remain safely stored. Please retry or message our Nairobi desk on WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={handleRetry}
              className="w-full sm:w-auto min-h-[48px] min-w-[44px] bg-[#FFD333] px-6 py-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span>Retry</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto min-h-[48px] min-w-[44px] bg-[#3D464D] px-6 py-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-white hover:bg-[#FFD333] hover:text-[#3D464D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>Back to Homepage</span>
            </Link>

            <a
              href="https://wa.me/254112272061?text=Hello%20Lydia%20Market%2C%20I%20encountered%20an%20error%20while%20placing%20an%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[48px] min-w-[44px] border border-[#25D366] bg-[#25D366] px-6 py-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-white hover:bg-[#20bd5a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              <span>WhatsApp +254112272061</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

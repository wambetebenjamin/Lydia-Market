import Link from 'next/link'
import { Home, Grid, MessageCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="py-14 sm:py-20">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white border border-gray-200 p-8 sm:p-12 space-y-6">
          <div className="inline-flex items-center select-none">
            <span className="bg-[#3D464D] text-[#FFD333] px-3 py-1 text-2xl font-bold">404</span>
            <span className="bg-[#FFD333] text-[#3D464D] px-3 py-1 text-2xl font-bold">
              NOT FOUND
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#3D464D]">Page not found</h1>
          <p className="text-sm sm:text-base text-[#6C757D] max-w-xl mx-auto leading-relaxed">
            The wholesale product, supplier profile, or page address you requested could not be found or may have been updated.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Link
              href="/"
              className="w-full sm:w-auto min-h-[48px] min-w-[44px] bg-[#FFD333] px-6 py-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/catalogue"
              className="w-full sm:w-auto min-h-[48px] min-w-[44px] bg-[#3D464D] px-6 py-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-white hover:bg-[#FFD333] hover:text-[#3D464D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <Grid className="w-4 h-4" aria-hidden="true" />
              <span>Browse Catalogue</span>
            </Link>

            <a
              href="https://wa.me/254112272061?text=Hello%20Lydia%20Market%2C%20I%20need%20help%20finding%20a%20wholesale%20product."
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

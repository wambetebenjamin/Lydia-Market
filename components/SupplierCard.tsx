'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, MapPin, Bookmark, ArrowRight } from 'lucide-react'
import type { Supplier } from '@/lib/data'
import { useMarketplaceStore } from '@/lib/store'

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  const savedSuppliers = useMarketplaceStore((s) => s.savedSuppliers)
  const toggleSavedSupplier = useMarketplaceStore((s) => s.toggleSavedSupplier)
  const isSaved = savedSuppliers.includes(supplier.slug)

  return (
    <article className="product-item bg-white border border-gray-200 p-4 flex flex-col justify-between h-full">
      <div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#F5F5F5]">
          <Image
            src={supplier.coverImage}
            alt={supplier.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="aspect-[4/3] w-full object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={() => toggleSavedSupplier(supplier.slug)}
            aria-label={isSaved ? `Remove ${supplier.name} from saved suppliers` : `Save ${supplier.name}`}
            className={`absolute top-2.5 right-2.5 min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg border shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
              isSaved
                ? 'bg-[#FFD333] border-[#3D464D] text-[#3D464D]'
                : 'bg-white/95 border-gray-200 text-[#3D464D] hover:bg-[#FFD333]'
            }`}
          >
            <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} aria-hidden="true" />
          </button>
        </div>

        <div className="mt-3.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="bg-[#F5F5F5] px-2.5 py-1 text-xs font-semibold text-[#3D464D]">
              {supplier.category}
            </span>
            {supplier.verified && (
              <span className="inline-flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-0.5 text-xs font-semibold text-[#28a745]">
                <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
                Verified
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-[#3D464D] leading-snug">
            {supplier.name}
          </h3>

          <p className="text-xs sm:text-sm text-[#6C757D] flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#3D464D] flex-shrink-0" aria-hidden="true" />
            <span>{supplier.county} County &bull; {supplier.yearsInBusiness} yrs active</span>
          </p>

          <p className="text-sm text-[#6C757D] line-clamp-2">{supplier.description}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#F5F5F5]">
        <Link
          href={`/supplier/${supplier.slug}`}
          className="w-full min-h-[44px] min-w-[44px] bg-[#FFD333] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          <span>View Catalogue</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}

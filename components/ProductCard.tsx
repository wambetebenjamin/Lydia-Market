'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, Check, MapPin, ShieldCheck } from 'lucide-react'
import { formatKes, type Product } from '@/lib/data'
import { useMarketplaceStore } from '@/lib/store'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useMarketplaceStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAddToOrder = () => {
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
      quantity: product.moq,
      image: product.image,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.96, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.24) }}
      className="product-item bg-white border border-gray-200 p-3.5 flex flex-col justify-between h-full"
    >
      <div>
        <Link
          href={`/product/${product.slug}`}
          className="block overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#F5F5F5]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="aspect-[4/3] w-full object-cover rounded-lg transition-transform duration-500 hover:scale-105"
            />
          </div>
        </Link>

        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-xs text-[#6C757D]">
            <span className="inline-flex items-center gap-1 font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#3D464D]" aria-hidden="true" />
              {product.county}
            </span>
            <span className="bg-[#F5F5F5] px-2 py-0.5 font-semibold text-[#3D464D]">
              MOQ: {product.moq}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-bold leading-snug text-[#3D464D] line-clamp-2">
            <Link
              href={`/product/${product.slug}`}
              className="hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {product.name}
            </Link>
          </h3>

          <Link
            href={`/supplier/${product.supplierSlug}`}
            className="min-h-[44px] inline-flex items-center gap-1 text-xs sm:text-sm text-[#6C757D] hover:text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {product.verifiedSupplier && (
              <ShieldCheck className="w-4 h-4 text-[#28a745] flex-shrink-0" aria-hidden="true" />
            )}
            <span className="line-clamp-1">{product.supplierName}</span>
          </Link>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#F5F5F5] space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-lg font-bold text-[#3D464D]">{formatKes(product.unitPriceKes)}</span>
          <span className="text-xs text-[#6C757D]">{product.unitLabel}</span>
        </div>

        {/* Step 16 Effect #10: "Add to Order" micro-bounce on click */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.93 }}
          animate={added ? { scale: [1, 1.07, 1] } : { scale: 1 }}
          transition={{ type: 'spring', stiffness: 450, damping: 20 }}
          onClick={handleAddToOrder}
          className={`w-full min-h-[44px] min-w-[44px] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
            added
              ? 'bg-[#28a745] text-white'
              : 'bg-[#FFD333] text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333]'
          }`}
        >
          {added ? (
            <>
              <Check className="w-4 h-4" aria-hidden="true" />
              <span>Added +{product.moq} to Order</span>
            </>
          ) : (
            <>
              <ShoppingCart className="w-4 h-4" aria-hidden="true" />
              <span>Add to Order</span>
            </>
          )}
        </motion.button>
      </div>
    </motion.article>
  )
}

import { Suspense } from 'react'
import { CatalogueClient } from '@/components/CatalogueClient'

export const metadata = {
  title: 'Wholesale Product Catalogue | Lydia Market Kenya',
  description: 'Search and filter verified wholesale supplies across 8 commercial categories in Kenya.',
}

export default function CataloguePage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-[#3D464D] font-semibold">
          Loading wholesale catalogue...
        </div>
      }
    >
      <CatalogueClient />
    </Suspense>
  )
}

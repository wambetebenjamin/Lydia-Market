'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'
import { CATEGORIES, KENYAN_COUNTIES, PRODUCTS } from '@/lib/data'
import { ProductCard } from '@/components/ProductCard'

const PAGE_SIZE = 12

export function CatalogueClient() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [keyword, setKeyword] = useState(searchParams.get('q') || '')
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All')
  const [selectedCounty, setSelectedCounty] = useState('All')
  const [moqRange, setMoqRange] = useState('all')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [verifiedOnly, setVerifiedOnly] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false)

  useEffect(() => {
    setKeyword(searchParams.get('q') || '')
    setSelectedCategory(searchParams.get('category') || 'All')
    setCurrentPage(1)
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase()
    const minVal = minPrice ? Number(minPrice) : 0
    const maxVal = maxPrice ? Number(maxPrice) : Number.POSITIVE_INFINITY

    return PRODUCTS.filter((p) => {
      if (q) {
        const matchText =
          p.name.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
        if (!matchText) return false
      }
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false
      if (selectedCounty !== 'All' && p.county !== selectedCounty) return false
      if (verifiedOnly && !p.verifiedSupplier) return false
      if (p.unitPriceKes < minVal || p.unitPriceKes > maxVal) return false

      if (moqRange === '1-2' && (p.moq < 1 || p.moq > 2)) return false
      if (moqRange === '3-4' && (p.moq < 3 || p.moq > 4)) return false
      if (moqRange === '5+' && p.moq < 5) return false

      return true
    })
  }, [keyword, selectedCategory, selectedCounty, verifiedOnly, minPrice, maxPrice, moqRange])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const resetFilters = () => {
    setKeyword('')
    setSelectedCategory('All')
    setSelectedCounty('All')
    setMoqRange('all')
    setMinPrice('')
    setMaxPrice('')
    setVerifiedOnly(false)
    setCurrentPage(1)
    router.replace('/catalogue')
  }

  const renderFilterControls = (idPrefix: string) => (
    <div className="space-y-5">
      {/* Category */}
      <div>
        <label
          htmlFor={`${idPrefix}-category`}
          className="block text-sm font-bold uppercase tracking-wide text-[#3D464D] mb-2"
        >
          Category
        </label>
        <select
          id={`${idPrefix}-category`}
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="All">All Categories ({PRODUCTS.length})</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name} ({cat.productCount})
            </option>
          ))}
        </select>
      </div>

      {/* County */}
      <div>
        <label
          htmlFor={`${idPrefix}-county`}
          className="block text-sm font-bold uppercase tracking-wide text-[#3D464D] mb-2"
        >
          Supplier County
        </label>
        <select
          id={`${idPrefix}-county`}
          value={selectedCounty}
          onChange={(e) => {
            setSelectedCounty(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="All">All Counties</option>
          {KENYAN_COUNTIES.map((county) => (
            <option key={county} value={county}>
              {county} County
            </option>
          ))}
        </select>
      </div>

      {/* Minimum Order Quantity Range */}
      <div>
        <label
          htmlFor={`${idPrefix}-moq`}
          className="block text-sm font-bold uppercase tracking-wide text-[#3D464D] mb-2"
        >
          Minimum Order Quantity
        </label>
        <select
          id={`${idPrefix}-moq`}
          value={moqRange}
          onChange={(e) => {
            setMoqRange(e.target.value)
            setCurrentPage(1)
          }}
          className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="all">Any MOQ</option>
          <option value="1-2">1 to 2 Cartons / Bales</option>
          <option value="3-4">3 to 4 Cartons / Bales</option>
          <option value="5+">5+ Cartons / Bales</option>
        </select>
      </div>

      {/* Price Range KES */}
      <div>
        <span className="block text-sm font-bold uppercase tracking-wide text-[#3D464D] mb-2">
          Unit Price Range (KES)
        </span>
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor={`${idPrefix}-min-price`} className="sr-only">
              Minimum price in KES
            </label>
            <input
              id={`${idPrefix}-min-price`}
              type="number"
              min="0"
              placeholder="Min KES"
              value={minPrice}
              onChange={(e) => {
                setMinPrice(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] placeholder-[#999999] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
          <div>
            <label htmlFor={`${idPrefix}-max-price`} className="sr-only">
              Maximum price in KES
            </label>
            <input
              id={`${idPrefix}-max-price`}
              type="number"
              min="0"
              placeholder="Max KES"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value)
                setCurrentPage(1)
              }}
              className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] placeholder-[#999999] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>

      {/* Verified Supplier Toggle */}
      <div className="pt-2 border-t border-gray-200 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[#3D464D]">Verified Suppliers Only</span>
        <button
          type="button"
          role="switch"
          aria-checked={verifiedOnly}
          onClick={() => {
            setVerifiedOnly((v) => !v)
            setCurrentPage(1)
          }}
          className={`min-h-[44px] min-w-[64px] px-3 text-xs font-bold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
            verifiedOnly ? 'bg-[#FFD333] text-[#3D464D]' : 'bg-[#F5F5F5] text-[#6C757D]'
          }`}
        >
          {verifiedOnly ? 'On' : 'All'}
        </button>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="w-full min-h-[44px] min-w-[44px] border border-[#3D464D] bg-[#F5F5F5] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-semibold text-[#3D464D] hover:bg-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        <span>Reset Filters</span>
      </button>
    </div>
  )

  return (
    <div className="py-6 sm:py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header & Search Bar */}
        <div className="bg-white border border-gray-200 p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D464D]">
                Wholesale Product Catalogue
              </h1>
              <p className="text-sm sm:text-base text-[#6C757D] mt-1">
                Direct factory and primary distributor pricing across {filteredProducts.length} wholesale SKUs in KES.
              </p>
            </div>

            {/* Mobile Filter Trigger Button */}
            <button
              type="button"
              onClick={() => setMobileSheetOpen(true)}
              className="lg:hidden min-h-[44px] min-w-[44px] bg-[#FFD333] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
              <span>Filter</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <label htmlFor="catalogue-keyword" className="sr-only">
                Search by product name or supplier
              </label>
              <input
                id="catalogue-keyword"
                type="search"
                value={keyword}
                onChange={(e) => {
                  setKeyword(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Search by product name, SKU, or supplier name..."
                className="w-full min-h-[48px] border border-gray-300 bg-[#F5F5F5] pl-11 pr-4 py-2.5 text-base text-[#3D464D] placeholder-[#999999] focus:bg-white focus:border-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
              <Search
                className="w-5 h-5 text-[#6C757D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                aria-hidden="true"
              />
            </div>
          </div>
        </div>

        {/* Main Content Layout: Desktop Sidebar (lg:w-64 flex-shrink-0) + Product Grid */}
        <div className="flex flex-col lg:flex-row items-start gap-6">
          <aside
            aria-label="Catalogue filters"
            className="hidden lg:block lg:w-64 flex-shrink-0 bg-white border border-gray-200 p-5"
          >
            <h2 className="text-lg font-bold uppercase tracking-tight text-[#3D464D] pb-3 mb-4 border-b border-gray-200">
              Filter Stock
            </h2>
            {renderFilterControls('desktop')}
          </aside>

          <div className="flex-1 w-full space-y-6">
            {paginatedProducts.length === 0 ? (
              <div className="bg-white border border-gray-200 p-10 text-center space-y-4">
                <h2 className="text-xl font-bold text-[#3D464D]">
                  No wholesale items match your current filter
                </h2>
                <p className="text-sm sm:text-base text-[#6C757D]">
                  Adjust your KES price range, MOQ filter, or clear all filters to view all 40 verified wholesale SKUs.
                </p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="min-h-[44px] min-w-[44px] bg-[#FFD333] px-5 py-2.5 text-sm font-bold text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  Show All Wholesale Stock
                </button>
              </div>
            ) : (
              <>
                {/* Step 4 & Step 18 Exact Grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {paginatedProducts.map((product, idx) => (
                    <ProductCard key={product.slug} product={product} index={idx} />
                  ))}
                </div>

                {/* Pagination */}
                <nav
                  aria-label="Catalogue pagination"
                  className="flex flex-wrap items-center justify-center gap-2 pt-4"
                >
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="min-h-[44px] min-w-[44px] px-3.5 bg-white border border-gray-300 inline-flex items-center gap-1 text-sm font-semibold text-[#3D464D] disabled:opacity-40 hover:bg-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                    <span>Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      aria-current={pageNum === safePage ? 'page' : undefined}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`min-h-[44px] min-w-[44px] px-4 text-sm font-bold border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                        pageNum === safePage
                          ? 'bg-[#3D464D] border-[#3D464D] text-[#FFD333]'
                          : 'bg-white border-gray-300 text-[#3D464D] hover:bg-[#FFD333]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="min-h-[44px] min-w-[44px] px-3.5 bg-white border border-gray-300 inline-flex items-center gap-1 text-sm font-semibold text-[#3D464D] disabled:opacity-40 hover:bg-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                </nav>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Step 18 Mobile Filter Bottom Sheet: fixed inset-x-0 bottom-0 z-50, rounded-t-2xl, max-h-[80vh] overflow-y-auto pb-safe */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/55"
            onClick={() => setMobileSheetOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filter wholesale catalogue"
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-2xl max-h-[80vh] overflow-y-auto bg-white p-6 shadow-2xl pb-safe"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-[#3D464D]">Filter Wholesale Stock</h2>
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                aria-label="Close filter sheet"
                className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-[#3D464D] hover:bg-[#F5F5F5] rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {renderFilterControls('mobile')}

            <div className="mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setMobileSheetOpen(false)}
                className="w-full min-h-[48px] min-w-[44px] bg-[#FFD333] px-5 py-3 text-sm font-bold text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                Show {filteredProducts.length} Matching Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

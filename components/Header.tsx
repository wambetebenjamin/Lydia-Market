'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  Search,
  ShoppingCart,
  Bookmark,
  Menu,
  X,
  ChevronDown,
  PhoneCall,
  UserCheck,
  LogOut,
} from 'lucide-react'
import { CATEGORIES } from '@/lib/data'
import { useMarketplaceStore } from '@/lib/store'

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const basket = useMarketplaceStore((s) => s.basket)
  const savedSuppliers = useMarketplaceStore((s) => s.savedSuppliers)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const totalItems = basket.reduce((sum, item) => sum + item.quantity, 0)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    router.push(trimmed ? `/catalogue?q=${encodeURIComponent(trimmed)}` : '/catalogue')
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/catalogue', label: 'Catalogue' },
    { href: '/supplier-apply', label: 'Sell on Lydia' },
    { href: '/orders', label: 'Orders' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/about', label: 'About' },
  ]

  return (
    <header className="w-full shadow-sm">
      {/* Topbar Tier 1 (MultiShop secondary bar) */}
      <div className="bg-[#F5F5F5] border-b border-gray-200 hidden md:block">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs text-[#6C757D]">
            <div className="flex items-center gap-1">
              <Link
                href="/about"
                className="min-h-[44px] min-w-[44px] px-2 inline-flex items-center hover:text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                About Us
              </Link>
              <Link
                href="/supplier-apply"
                className="min-h-[44px] min-w-[44px] px-2 inline-flex items-center hover:text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                Supplier Onboarding
              </Link>
              <Link
                href="/legal/terms"
                className="min-h-[44px] min-w-[44px] px-2 inline-flex items-center hover:text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                Trade Terms
              </Link>
              <Link
                href="/legal/privacy-policy"
                className="min-h-[44px] min-w-[44px] px-2 inline-flex items-center hover:text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                KDPA Privacy
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-gray-200 font-semibold text-[#3D464D]">
                KES (KSh) Wholesale
              </span>
              {session?.user ? (
                <div className="flex items-center gap-1">
                  <Link
                    href="/dashboard"
                    className="min-h-[44px] min-w-[44px] px-3 inline-flex items-center gap-1.5 font-semibold text-[#3D464D] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    <UserCheck className="w-4 h-4 text-[#28a745]" aria-hidden="true" />
                    <span>{session.user.name || 'Buyer Portal'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="min-h-[44px] min-w-[44px] px-2.5 inline-flex items-center gap-1 text-[#6C757D] hover:text-[#dc3545] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Link
                    href="/login"
                    className="min-h-[44px] min-w-[44px] px-3 inline-flex items-center font-semibold text-[#3D464D] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="min-h-[44px] min-w-[44px] px-3 inline-flex items-center bg-[#FFD333] font-bold text-[#3D464D] hover:bg-[#ffdf66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    Register Buyer
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Topbar Tier 2: Desktop MultiShop Brand + Search + Customer Support */}
      <div className="bg-white py-3.5 hidden lg:block">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 items-center gap-6">
            <div className="col-span-4">
              <Link
                href="/"
                className="min-h-[44px] inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <span className="bg-[#3D464D] px-3 py-1.5 text-2xl font-bold uppercase tracking-tight text-[#FFD333]">
                  Lydia
                </span>
                <span className="bg-[#FFD333] px-3 py-1.5 text-2xl font-bold uppercase tracking-tight text-[#3D464D]">
                  Market
                </span>
              </Link>
            </div>

            <div className="col-span-5">
              <form onSubmit={handleSearch} className="flex w-full">
                <label htmlFor="header-search-input" className="sr-only">
                  Search wholesale products or verified suppliers
                </label>
                <input
                  id="header-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search maize meal, cooking oil, tools, suppliers..."
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] placeholder-[#999999] focus:border-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <button
                  type="submit"
                  aria-label="Search wholesale catalogue"
                  className="min-h-[44px] min-w-[48px] inline-flex items-center justify-center border border-l-0 border-gray-300 bg-[#FFD333] text-[#3D464D] hover:bg-[#ffdf66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                >
                  <Search className="w-5 h-5" aria-hidden="true" />
                </button>
              </form>
            </div>

            <div className="col-span-3 text-right">
              <p className="text-xs text-[#6C757D] uppercase tracking-wider">Wholesale Trade Desk</p>
              <a
                href="tel:+254112272061"
                className="min-h-[44px] inline-flex items-center justify-end gap-1.5 text-base font-bold text-[#3D464D] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <PhoneCall className="w-4 h-4 text-[#FFD333]" aria-hidden="true" />
                <span>+254 112 272 061</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tier 3: Main MultiShop Dark Navigation Bar */}
      <nav aria-label="Main navigation" className="bg-[#3D464D] text-white">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[60px] gap-2">
            {/* Desktop Categories Dropdown (MultiShop yellow block) */}
            <div className="relative hidden lg:block w-64 flex-shrink-0">
              <button
                type="button"
                onClick={() => setCatOpen((o) => !o)}
                aria-expanded={catOpen}
                className="w-full min-h-[60px] bg-[#FFD333] px-5 flex items-center justify-between text-[#3D464D] font-bold text-sm uppercase tracking-wide hover:bg-[#ffdf66] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <Menu className="w-5 h-5" aria-hidden="true" />
                  <span>Categories</span>
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${catOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {catOpen && (
                <div
                  onMouseLeave={() => setCatOpen(false)}
                  className="absolute left-0 top-full z-50 w-full bg-white border border-gray-200 shadow-xl divide-y divide-[#F5F5F5]"
                >
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.name}
                      href={`/catalogue?category=${encodeURIComponent(cat.name)}`}
                      onClick={() => setCatOpen(false)}
                      className="min-h-[44px] px-5 py-2.5 flex items-center justify-between text-sm text-[#3D464D] hover:bg-[#FFD333] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-[#6C757D]">({cat.productCount})</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile & Tablet Brand Logo */}
            <Link
              href="/"
              className="lg:hidden min-h-[44px] inline-flex items-center flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <span className="bg-white px-2 py-1 text-lg sm:text-xl font-bold uppercase tracking-tight text-[#3D464D]">
                Lydia
              </span>
              <span className="bg-[#FFD333] px-2 py-1 text-lg sm:text-xl font-bold uppercase tracking-tight text-[#3D464D]">
                Market
              </span>
            </Link>

            {/* Desktop Nav Links (Step 18: hidden md:flex) */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2 flex-1 lg:pl-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`min-h-[44px] min-w-[44px] px-2.5 lg:px-3.5 inline-flex items-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                      isActive ? 'text-[#FFD333] font-bold' : 'text-[#F5F5F5] hover:text-[#FFD333]'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Right Quick Badges + Mobile Hamburger (Step 18: md:hidden) */}
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                href="/dashboard"
                aria-label={`Saved suppliers: ${savedSuppliers.length}`}
                className="hidden sm:inline-flex min-h-[44px] min-w-[44px] px-2.5 items-center gap-1.5 text-sm text-white hover:text-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <Bookmark className="w-4 h-4 text-[#FFD333]" aria-hidden="true" />
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full border border-white/60 px-1 text-xs">
                  {savedSuppliers.length}
                </span>
              </Link>

              <Link
                href="/orders"
                aria-label={`Wholesale order basket: ${totalItems} units`}
                className="min-h-[44px] min-w-[44px] px-2.5 inline-flex items-center gap-1.5 text-sm text-white hover:text-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <ShoppingCart className="w-5 h-5 text-[#FFD333]" aria-hidden="true" />
                <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#FFD333] px-1.5 text-xs font-bold text-[#3D464D]">
                  {totalItems}
                </span>
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen((v) => !v)}
                aria-expanded={mobileMenuOpen}
                aria-label="Toggle navigation menu"
                className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center border border-white/30 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <Menu className="w-6 h-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Collapsible Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-white/15 py-4 space-y-4">
              <form onSubmit={handleSearch} className="flex w-full">
                <label htmlFor="mobile-search-input" className="sr-only">
                  Search wholesale products
                </label>
                <input
                  id="mobile-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products or suppliers..."
                  className="w-full min-h-[44px] bg-white px-3.5 py-2 text-base text-[#3D464D] placeholder-[#999999] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="min-h-[44px] min-w-[48px] bg-[#FFD333] inline-flex items-center justify-center text-[#3D464D] font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <Search className="w-5 h-5" aria-hidden="true" />
                </button>
              </form>

              <div className="flex flex-col divide-y divide-white/10">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="min-h-[44px] flex items-center text-base font-medium text-[#F5F5F5] hover:text-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                {session?.user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      signOut({ callbackUrl: '/' })
                    }}
                    className="min-h-[44px] flex items-center text-left text-base font-medium text-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    Sign Out ({session.user.name})
                  </button>
                ) : (
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[44px] inline-flex items-center justify-center border border-white text-sm font-semibold text-white hover:bg-white hover:text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="min-h-[44px] inline-flex items-center justify-center bg-[#FFD333] text-sm font-bold text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Register Buyer
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}

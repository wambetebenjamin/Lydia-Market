'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { LogIn, Sparkles, Chrome } from 'lucide-react'

export function LoginClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        setErrorMsg('Invalid email or password. Use your buyer account or the demo account below.')
      } else {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setErrorMsg('Unable to sign in right now. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoBuyer = () => {
    setEmail('buyer@lydiamarket.co.ke')
    setPassword('LydiaBuyer2026!')
    setErrorMsg('')
  }

  return (
    <div className="py-10 sm:py-16">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-md bg-white border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2 text-center">
            <span className="inline-block bg-[#FFD333] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3D464D]">
              Verified Buyer Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3D464D]">
              Sign In to Lydia Market
            </h1>
            <p className="text-sm text-[#6C757D]">
              Access your wholesale basket, trade credit limits, and county delivery tracking.
            </p>
          </div>

          <button
            type="button"
            onClick={fillDemoBuyer}
            className="w-full min-h-[44px] min-w-[44px] bg-[#FFFDF2] border border-[#FFD333] px-4 py-2.5 inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-[#3D464D] hover:bg-[#FFD333]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <Sparkles className="w-4 h-4 text-[#3D464D]" aria-hidden="true" />
            <span>Fill Demo Buyer Account (Wanjiku Retail Mart)</span>
          </button>

          <form onSubmit={handleCredentialsLogin} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-sm font-semibold text-[#3D464D] mb-1">
                Business Email
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="buyer@lydiamarket.co.ke"
                className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-sm font-semibold text-[#3D464D] mb-1"
              >
                Password
              </label>
              <input
                id="login-password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {errorMsg && (
              <p role="alert" className="text-sm font-semibold text-red-600">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full min-h-[48px] min-w-[44px] bg-[#FFD333] px-5 py-3 inline-flex items-center justify-center gap-2 text-base font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <LogIn className="w-5 h-5" aria-hidden="true" />
              <span>{loading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="relative py-1 text-center">
            <span className="bg-white px-3 text-xs uppercase tracking-wider text-[#6C757D]">
              Or continue with SSO
            </span>
          </div>

          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl })}
            className="w-full min-h-[48px] min-w-[44px] border border-[#3D464D] bg-white px-5 py-2.5 inline-flex items-center justify-center gap-2 text-sm font-bold text-[#3D464D] hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            <Chrome className="w-4 h-4" aria-hidden="true" />
            <span>Continue with Google Workspace</span>
          </button>

          <p className="text-center text-sm text-[#6C757D] pt-2">
            New retail buyer?{' '}
            <Link
              href="/register"
              className="min-h-[44px] inline-flex items-center font-bold text-[#3D464D] underline hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Register as a Buyer
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

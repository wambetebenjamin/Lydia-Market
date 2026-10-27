'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { UserPlus } from 'lucide-react'
import { KENYAN_COUNTIES } from '@/lib/data'
import { getRecaptchaV3Token, RecaptchaWidget } from '@/components/RecaptchaWidget'

interface RegisterFormValues {
  businessName: string
  ownerName: string
  email: string
  password: string
  county: string
  phone: string
  businessType: 'Retailer' | 'Wholesaler' | 'Institution'
}

export function RegisterClient() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      county: 'Nairobi',
      businessType: 'Retailer',
    },
  })

  const [requireV2, setRequireV2] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [serverError, setServerError] = useState('')

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError('')

    try {
      const recaptchaToken = await getRecaptchaV3Token('buyer_register')
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...values,
          recaptchaToken,
          recaptchaV2Token: v2Token,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        if (data.requireV2) setRequireV2(true)
        setServerError(data.error || 'Could not complete registration.')
        return
      }

      await signIn('credentials', {
        email: values.email,
        password: values.password,
        redirect: false,
      })
      router.push('/dashboard')
      router.refresh()
    } catch {
      setServerError('Network error while creating buyer account.')
    }
  }

  return (
    <div className="py-10 sm:py-14">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-xl bg-white border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="inline-block bg-[#FFD333] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3D464D]">
              Free Buyer Onboarding
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#3D464D]">
              Register as a Wholesale Buyer
            </h1>
            <p className="text-sm sm:text-base text-[#6C757D]">
              Open a verified trade account for your shop, mini-mart, supermarket, or institution to access factory-direct KES wholesale rates.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-business" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Business Name
                </label>
                <input
                  id="reg-business"
                  type="text"
                  placeholder="Baraka Minimart"
                  {...register('businessName', { required: 'Business name is required', minLength: 2 })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                {errors.businessName && (
                  <p className="text-xs text-red-600 mt-1">{errors.businessName.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reg-owner" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Owner / Buyer Full Name
                </label>
                <input
                  id="reg-owner"
                  type="text"
                  placeholder="Joseph Otieno"
                  {...register('ownerName', { required: 'Owner name is required', minLength: 2 })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                {errors.ownerName && (
                  <p className="text-xs text-red-600 mt-1">{errors.ownerName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-email" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Business Email
                </label>
                <input
                  id="reg-email"
                  type="email"
                  placeholder="orders@barakaminimart.co.ke"
                  {...register('email', { required: 'Valid email is required' })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="reg-password" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Password (min 8 chars)
                </label>
                <input
                  id="reg-password"
                  type="password"
                  placeholder="Create strong password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Minimum 8 characters' },
                  })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
                {errors.password && (
                  <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="reg-county" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  County
                </label>
                <select
                  id="reg-county"
                  {...register('county', { required: true })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {KENYAN_COUNTIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Phone Number
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  placeholder="+254712345678"
                  {...register('phone', { required: 'Phone number required', minLength: 9 })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label htmlFor="reg-type" className="block text-sm font-semibold text-[#3D464D] mb-1">
                  Business Type
                </label>
                <select
                  id="reg-type"
                  {...register('businessType', { required: true })}
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                  <option value="Institution">Institution</option>
                </select>
              </div>
            </div>

            <RecaptchaWidget
              requireV2={requireV2}
              v2Verified={Boolean(v2Token)}
              onVerifyV2={(tok) => setV2Token(tok)}
              actionName="buyer_register"
            />

            {serverError && (
              <p role="alert" className="text-sm font-semibold text-red-600">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[48px] min-w-[44px] bg-[#FFD333] px-6 py-3 inline-flex items-center justify-center gap-2 text-base font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              <UserPlus className="w-5 h-5" aria-hidden="true" />
              <span>{isSubmitting ? 'Creating Buyer Account...' : 'Create Wholesale Buyer Account'}</span>
            </button>
          </form>

          <p className="text-center text-sm text-[#6C757D]">
            Already registered?{' '}
            <Link
              href="/login"
              className="min-h-[44px] inline-flex items-center font-bold text-[#3D464D] underline hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

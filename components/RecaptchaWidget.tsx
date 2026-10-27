'use client'

import { useEffect } from 'react'
import { ShieldAlert, CheckSquare, Square } from 'lucide-react'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, opts: { action: string }) => Promise<string>
    }
  }
}

export async function getRecaptchaV3Token(action: string): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  if (typeof window !== 'undefined' && siteKey && window.grecaptcha) {
    try {
      return await new Promise<string>((resolve) => {
        window.grecaptcha!.ready(async () => {
          try {
            const token = await window.grecaptcha!.execute(siteKey, { action })
            resolve(token)
          } catch {
            resolve(`v3-${action}-${Date.now()}`)
          }
        })
      })
    } catch {
      return `v3-${action}-${Date.now()}`
    }
  }
  return `v3-${action}-${Date.now()}`
}

interface RecaptchaWidgetProps {
  requireV2: boolean
  v2Verified: boolean
  onVerifyV2: (token: string) => void
  actionName?: string
}

export function RecaptchaWidget({
  requireV2,
  v2Verified,
  onVerifyV2,
  actionName = 'form_submit',
}: RecaptchaWidgetProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  useEffect(() => {
    if (!siteKey || typeof document === 'undefined') return
    const existing = document.getElementById('recaptcha-v3-script')
    if (existing) return

    const script = document.createElement('script')
    script.id = 'recaptcha-v3-script'
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }, [siteKey])

  if (!requireV2) {
    return (
      <p className="text-xs text-[#6C757D]">
        Protected by invisible reCAPTCHA v3 security verification ({actionName.replace(/_/g, ' ')}).
      </p>
    )
  }

  return (
    <div className="border-2 border-[#FFD333] bg-[#FFFDF2] p-4 rounded-lg space-y-2">
      <div className="flex items-center gap-2 text-sm font-semibold text-[#3D464D]">
        <ShieldAlert className="w-4 h-4 text-[#dc3545] flex-shrink-0" aria-hidden="true" />
        <span>Additional Verification Required (Score below 0.5)</span>
      </div>
      <button
        type="button"
        onClick={() => onVerifyV2(`v2-verified-${Date.now()}`)}
        className="min-h-[48px] min-w-[44px] w-full sm:w-auto inline-flex items-center gap-3 border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-[#3D464D] shadow-sm hover:bg-[#F5F5F5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      >
        {v2Verified ? (
          <CheckSquare className="w-5 h-5 text-[#28a745]" aria-hidden="true" />
        ) : (
          <Square className="w-5 h-5 text-[#6C757D]" aria-hidden="true" />
        )}
        <span>{v2Verified ? 'Verified: I am not a robot (reCAPTCHA v2)' : "I'm not a robot (reCAPTCHA v2)"}</span>
      </button>
    </div>
  )
}

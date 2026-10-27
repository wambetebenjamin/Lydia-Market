import { Suspense } from 'react'
import { LoginClient } from '@/components/LoginClient'

export const metadata = {
  title: 'Buyer Sign In | Lydia Market Kenya',
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-7xl mx-auto px-4 py-12 text-center font-semibold text-[#3D464D]">
          Loading sign-in portal...
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  )
}

'use client'

import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'
import Lenis from 'lenis'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 2,
      infinite: false,
      autoRaf: true,
    })

    return () => {
      lenis.destroy()
    }
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}

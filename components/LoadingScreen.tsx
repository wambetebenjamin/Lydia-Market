'use client'

import { useEffect, useState } from 'react'

export function LoadingScreen() {
  const [visible, setVisible] = useState(false)
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [canSkip, setCanSkip] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem('lydia-market-preloader-seen') === '1') {
        return
      }
      sessionStorage.setItem('lydia-market-preloader-seen', '1')
    } catch {
      return
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(prefersReduced)
    setVisible(true)

    const skipTimer = window.setTimeout(() => {
      setCanSkip(true)
    }, 3000)

    let current = 0
    const interval = window.setInterval(() => {
      current = Math.min(100, current + 14)
      setProgress(current)
      if (current >= 100) {
        window.clearInterval(interval)
        window.setTimeout(() => {
          setVisible(false)
        }, 180)
      }
    }, 85)

    return () => {
      window.clearTimeout(skipTimer)
      window.clearInterval(interval)
    }
  }, [])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Loading Lydia Market, ${progress}% complete`}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-[#F5F5F5] px-4 text-[#3D464D]"
    >
      {reducedMotion ? (
        <p className="text-lg font-bold tracking-wide text-[#3D464D]">
          Loading Lydia Market: {progress}%
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center gap-5">
          {/* Stacked wholesale cartons building 1 -> 2 -> 3 */}
          <svg
            width="68"
            height="84"
            viewBox="0 0 68 84"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {/* Bottom carton */}
            <g className="transition-opacity duration-200" style={{ opacity: progress >= 10 ? 1 : 0.25 }}>
              <rect x="10" y="56" width="48" height="22" fill="#FFD333" stroke="#3D464D" strokeWidth="2.5" />
              <line x1="34" y1="56" x2="34" y2="65" stroke="#3D464D" strokeWidth="2.5" />
            </g>
            {/* Middle carton */}
            <g className="transition-opacity duration-200" style={{ opacity: progress >= 40 ? 1 : 0.12 }}>
              <rect x="10" y="31" width="48" height="22" fill="#FFD333" stroke="#3D464D" strokeWidth="2.5" />
              <line x1="34" y1="31" x2="34" y2="40" stroke="#3D464D" strokeWidth="2.5" />
            </g>
            {/* Top carton */}
            <g className="transition-opacity duration-200" style={{ opacity: progress >= 70 ? 1 : 0.08 }}>
              <rect x="10" y="6" width="48" height="22" fill="#FFD333" stroke="#3D464D" strokeWidth="2.5" />
              <line x1="34" y1="6" x2="34" y2="15" stroke="#3D464D" strokeWidth="2.5" />
            </g>
          </svg>

          {/* Wordmark appearing beside the stacked column */}
          <div
            className="flex flex-col items-center sm:items-start transition-opacity duration-300"
            style={{ opacity: progress >= 75 ? 1 : 0.2 }}
          >
            <div className="inline-flex items-center">
              <span className="bg-[#3D464D] px-3 py-1.5 text-2xl font-bold uppercase tracking-tight text-[#FFD333]">
                Lydia
              </span>
              <span className="bg-[#FFD333] px-3 py-1.5 text-2xl font-bold uppercase tracking-tight text-[#3D464D]">
                Market
              </span>
            </div>
            <span className="mt-1.5 text-xs font-medium uppercase tracking-wider text-[#6C757D]">
              Source smart. Sell more. ({progress}%)
            </span>
          </div>
        </div>
      )}

      {canSkip && (
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="mt-6 min-h-[44px] min-w-[44px] border border-[#3D464D] bg-white px-5 py-2.5 text-sm font-semibold text-[#3D464D] hover:bg-[#FFD333] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        >
          Skip Intro
        </button>
      )}
    </div>
  )
}

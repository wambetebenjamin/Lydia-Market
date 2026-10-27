'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

const VOICE_TOUR_SCRIPT =
  "Welcome to Lydia Market, Kenya's B2B wholesale platform where retailers source products directly from verified manufacturers and distributors. Browse thousands of products across food, electronics, textiles, and more. Place bulk orders, track deliveries, and manage all your supplier relationships from one dashboard. No more middlemen. No more overpriced stock. Register as a buyer today and start sourcing smarter."

export function VoiceTourButton() {
  const [speaking, setSpeaking] = useState(false)
  const [muted, setMuted] = useState(true)
  const [hasEnded, setHasEnded] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const triggeredOnceRef = useRef(false)

  const speakTour = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setMuted(false)
      setSpeaking(true)
      setTimeout(() => {
        setSpeaking(false)
        setMuted(true)
        setHasEnded(true)
      }, 4000)
      return
    }

    try {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(VOICE_TOUR_SCRIPT)
      utterance.rate = 0.95
      utterance.pitch = 1.1
      utterance.lang = 'en-KE'

      utterance.onstart = () => {
        setSpeaking(true)
        setMuted(false)
      }
      utterance.onend = () => {
        setSpeaking(false)
        setMuted(true)
        setHasEnded(true)
      }
      utterance.onerror = () => {
        setSpeaking(false)
        setMuted(true)
        setHasEnded(true)
      }

      window.speechSynthesis.speak(utterance)
      setSpeaking(true)
      setMuted(false)
    } catch {
      setSpeaking(false)
      setMuted(true)
    }
  }, [])

  useEffect(() => {
    try {
      if (sessionStorage.getItem('lydia-market-voice-tour-played') === '1') {
        triggeredOnceRef.current = true
        return
      }
    } catch {
      // Ignore storage error
    }

    const handleFirstInteraction = () => {
      if (triggeredOnceRef.current) return
      triggeredOnceRef.current = true
      try {
        sessionStorage.setItem('lydia-market-voice-tour-played', '1')
      } catch {
        // Ignore storage error
      }
      speakTour()
    }

    window.addEventListener('scroll', handleFirstInteraction, { once: true, passive: true })
    window.addEventListener('click', handleFirstInteraction, { once: true })

    return () => {
      window.removeEventListener('scroll', handleFirstInteraction)
      window.removeEventListener('click', handleFirstInteraction)
    }
  }, [speakTour])

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    triggeredOnceRef.current = true
    try {
      sessionStorage.setItem('lydia-market-voice-tour-played', '1')
    } catch {
      // Ignore storage error
    }

    if (speaking && !muted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel()
      }
      setSpeaking(false)
      setMuted(true)
      setHasEnded(true)
    } else {
      speakTour()
    }
  }

  const tooltipLabel = hasEnded ? 'Replay tour' : 'Hear what this site is about'

  return (
    <div className="fixed left-6 bottom-safe z-[9998] flex items-center gap-2.5">
      <button
        type="button"
        onClick={handleToggle}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        aria-label="Site voice tour, click to mute"
        title={tooltipLabel}
        className={`relative inline-flex h-14 w-14 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#3D464D] border-2 border-[#FFD333] text-[#FFD333] shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
          speaking ? 'voice-speaking-ring' : ''
        }`}
      >
        {speaking && !muted ? (
          <Volume2 className="h-6 w-6" aria-hidden="true" />
        ) : (
          <VolumeX className="h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {showTooltip && (
        <span
          role="tooltip"
          className="hidden sm:inline-block rounded-lg bg-[#3D464D] px-3 py-1.5 text-xs font-semibold text-white shadow-lg whitespace-nowrap"
        >
          {tooltipLabel}
        </span>
      )}
    </div>
  )
}

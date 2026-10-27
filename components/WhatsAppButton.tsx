'use client'

import { useState } from 'react'
import { MessageCircle } from 'lucide-react'

const WHATSAPP_URL =
  'https://wa.me/254112272061?text=Hi%20Lydia%20Market%2C%20I%27d%20like%20to%20learn%20more%20about%20sourcing%20wholesale'

export function WhatsAppButton() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="fixed right-6 bottom-safe z-[9998] flex items-center gap-2.5">
      {hovered && (
        <span
          role="tooltip"
          className="hidden sm:inline-block rounded-lg bg-[#3D464D] px-3 py-1.5 text-xs font-semibold text-white shadow-lg whitespace-nowrap"
        >
          Chat with us on WhatsApp
        </span>
      )}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="whatsapp-entrance-pulse inline-flex h-14 w-14 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-[#28a745] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
      >
        <MessageCircle className="h-7 w-7" aria-hidden="true" />
      </a>
    </div>
  )
}

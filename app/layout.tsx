import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { LoadingScreen } from '@/components/LoadingScreen'
import { CookieConsent } from '@/components/CookieConsent'
import { WhatsAppButton } from '@/components/WhatsAppButton'
import { VoiceTourButton } from '@/components/VoiceTourButton'

export const metadata: Metadata = {
  title: 'Lydia Market | Source smart. Sell more. Kenya B2B Wholesale Marketplace',
  description:
    'Buy wholesale directly from verified Kenyan manufacturers and primary distributors. Compare factory KES prices, manage multi-supplier bulk orders, and track nationwide delivery.',
  keywords: [
    'Kenya wholesale marketplace',
    'B2B wholesale Nairobi',
    'Kenyan manufacturers',
    'bulk duka supplies',
    'Lydia Market',
  ],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#F5F5F5] text-[#495057] antialiased">
        <Providers>
          <LoadingScreen />
          <Header />
          <main id="main-content" className="flex-1 w-full">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <VoiceTourButton />
          <CookieConsent />
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}

'use client'

import { ServerErrorView } from '@/components/ServerErrorView'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="en-KE">
      <body className="bg-[#F5F5F5] text-[#3D464D]">
        <ServerErrorView onRetry={reset} />
      </body>
    </html>
  )
}

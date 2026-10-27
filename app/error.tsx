'use client'

import { ServerErrorView } from '@/components/ServerErrorView'

export default function ErrorBoundary({ reset }: { error: Error; reset: () => void }) {
  return <ServerErrorView onRetry={reset} />
}

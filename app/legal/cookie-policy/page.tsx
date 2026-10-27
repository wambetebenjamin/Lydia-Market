export const metadata = {
  title: 'Cookie Policy | Lydia Market Kenya',
}

export default function CookiePolicyPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white border border-gray-200 p-6 sm:p-10 space-y-6 text-[#3D464D]">
          <header className="border-b border-gray-200 pb-5 space-y-2">
            <span className="inline-block bg-[#FFD333] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3D464D]">
              Storage & Cookie Transparency
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3D464D]">Cookie Policy</h1>
            <p className="text-sm text-[#6C757D]">Aligned with Kenya Data Protection Act 2019</p>
          </header>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">1. Strictly Necessary Cookies & Local Storage</h2>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              Essential storage keys keep your wholesale session and multi-supplier basket working across page reloads:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base text-[#495057]">
              <li><code>authjs.session-token</code>: Maintains encrypted buyer authentication on protected `/orders` and `/dashboard` routes.</li>
              <li><code>lydia-market-store-v1</code>: Stores your wholesale carton basket and saved suppliers locally in your browser.</li>
              <li><code>lydia-market-cookie-consent</code>: Remembers whether you selected Accept All, Reject Non-Essential, or custom preferences.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">2. Analytics & Security Cookies</h2>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              When permitted, privacy-focused performance telemetry via Vercel Analytics and Speed Insights measures page load responsiveness across mobile networks, while Google reCAPTCHA v3 protects public submission endpoints against automated bot traffic.
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}

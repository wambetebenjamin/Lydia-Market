export const metadata = {
  title: 'Terms of Service | Lydia Market Kenya',
}

export default function TermsPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white border border-gray-200 p-6 sm:p-10 space-y-6 text-[#3D464D]">
          <header className="border-b border-gray-200 pb-5 space-y-2">
            <span className="inline-block bg-[#FFD333] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3D464D]">
              Commercial Wholesale Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3D464D]">Terms of Service</h1>
            <p className="text-sm text-[#6C757D]">Governing Law: Laws of the Republic of Kenya</p>
          </header>

          <section className="bg-[#FFFDF2] border-2 border-[#FFD333] p-5 space-y-2">
            <h2 className="text-lg font-bold text-[#3D464D]">
              1. Marketplace Role & Non-Seller of Record Disclaimer
            </h2>
            <p className="text-sm sm:text-base text-[#3D464D] leading-relaxed font-medium">
              Lydia Market operates strictly as a B2B technology platform facilitating commercial connections, wholesale discovery, and purchase order transmission between business buyers and verified manufacturers or distributors. Lydia Market is not the seller of record for goods listed on the marketplace, does not take legal title to inventory, and all tax invoices (KRA eTIMS) and statutory product warranties originate directly from the supplying manufacturer or distributor.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">2. Business Eligibility & MOQ Rules</h2>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              Access to wholesale ordering is intended exclusively for commercial buyers including retail shops, supermarkets, pharmacies, wholesalers, and registered institutions. Orders must satisfy each SKU&rsquo;s stated Minimum Order Quantity (MOQ) and carton multiple rules.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">3. Pricing in KES & Trade Account Terms</h2>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              All wholesale unit prices, supplier subtotals, and order totals are denominated in Kenyan Shillings (KES). Placeholder credit terms (Immediate, 30 Days Net, or 60 Days Net) remain subject to trade account approval by the fulfilling supplier.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">4. Dispute Resolution</h2>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              Buyers may log short-delivery or damaged-carton tickets directly from their Order Detail portal within 48 hours of offloading. Any unresolved commercial dispute shall be governed by the laws of Kenya.
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Privacy Policy (Kenya Data Protection Act 2019) | Lydia Market',
}

export default function PrivacyPolicyPage() {
  return (
    <div className="py-8 sm:py-12">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <article className="bg-white border border-gray-200 p-6 sm:p-10 space-y-6 text-[#3D464D]">
          <header className="border-b border-gray-200 pb-5 space-y-2">
            <span className="inline-block bg-[#FFD333] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3D464D]">
              KDPA 2019 Compliant Notice
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#3D464D]">Privacy Policy</h1>
            <p className="text-sm text-[#6C757D]">Effective Date: October 2026 &bull; Entity: Lydia Market Kenya Ltd</p>
          </header>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">1. Data Controller & Statutory Framework</h2>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              Lydia Market Kenya Ltd (Enterprise Road, Industrial Area, Nairobi) processes personal and business contact information strictly in accordance with the <strong>Kenya Data Protection Act, 2019 (Act No. 24 of 2019)</strong> and regulations issued by the Office of the Data Protection Commissioner (ODPC).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">2. Categories of Data We Collect</h2>
            <ul className="list-disc pl-6 space-y-1.5 text-sm sm:text-base text-[#495057]">
              <li>Buyer Account Data: Owner full name, business name, business type, email address, phone number, and county delivery address.</li>
              <li>Supplier Verification Data: Certificate of Incorporation details, Business Registration Number, KRA PIN, warehouse location, and trade representative contact records.</li>
              <li>Wholesale Order & Trade Credit Records: Purchase orders, supplier subtotals in KES, requested payment terms, and fulfilment timestamps.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">3. Lawful Basis & Purpose of Processing</h2>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              Under Section 30 of the Kenya Data Protection Act 2019, we process your data to perform wholesale order routing contracts between buyers and verified suppliers, verify KRA tax compliance on trade accounts, protect forms against automated fraud, and dispatch county delivery updates.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-bold">4. Data Subject Rights Under KDPA 2019</h2>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              Under Section 26 of the Act, you have the right to be informed of the use to which your personal data is put, access your personal data in our custody, object to processing, and request correction or deletion of inaccurate data. Submit requests to <strong>privacy@lydiamarket.co.ke</strong> or WhatsApp <strong>+254 112 272 061</strong>.
            </p>
          </section>
        </article>
      </div>
    </div>
  )
}

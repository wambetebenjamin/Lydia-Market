import Image from 'next/image'
import Link from 'next/link'
import { Award, Globe2, ShieldCheck, TrendingUp, Newspaper } from 'lucide-react'
import { TEAM_MEMBERS, PRESS_MENTIONS } from '@/lib/data'

export const metadata = {
  title: 'About Us | Lydia Market Kenya',
  description:
    'Learn how Lydia Market connects Kenyan retailers directly with manufacturers and primary wholesale distributors across all 47 counties.',
}

export default function AboutPage() {
  return (
    <div className="py-6 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Story Banner */}
        <section className="bg-white border border-gray-200 p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block bg-[#FFD333] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3D464D]">
              Our Kenyan Wholesale Mission
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D464D] leading-tight">
              Source smart. Sell more. Built for Kenya&rsquo;s independent retail backbone.
            </h1>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              Across Kenya, neighborhood dukas, mini-marts, pharmacies, agro-vets, and hardware merchants supply over 75% of household essentials. Yet for decades, independent shopkeepers lost margins to fragmented middlemen, opaque pricing, and costly trips to congested wholesale depots.
            </p>
            <p className="text-sm sm:text-base text-[#495057] leading-relaxed">
              Founded in Nairobi&rsquo;s Industrial Area, Lydia Market connects retail buyers directly with KRA-verified manufacturers, grain millers, and primary importers. Every listing shows transparent factory-direct KES wholesale pricing, clear minimum order quantities, and scheduled dispatch across all 47 counties.
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-[#F5F5F5] border border-gray-200">
            <Image
              src="/images/hero-warehouse.jpg"
              alt="Lydia Market regional distribution hub in Nairobi Kenya"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="aspect-[4/3] w-full object-cover rounded-lg"
            />
          </div>
        </section>

        {/* Pillars */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            {
              icon: ShieldCheck,
              title: '100% Verified Suppliers',
              desc: 'Every listed manufacturer undergoes Certificate of Incorporation, KRA PIN, and KEBS verification.',
            },
            {
              icon: TrendingUp,
              title: 'Stronger Retail Margins',
              desc: 'Factory-direct bulk cartons help dukas and mini-marts save 12% to 22% on core fast-moving lines.',
            },
            {
              icon: Globe2,
              title: 'All 47 Counties Reached',
              desc: 'Coordinated route consolidation from Mombasa, Nairobi, Nakuru, Eldoret, and Kisumu hubs.',
            },
            {
              icon: Award,
              title: 'Transparent Trade Terms',
              desc: 'Digital LPO records, clear MOQ multiples, and structured 30-day or 60-day supplier trade accounts.',
            },
          ].map((pillar) => {
            const Icon = pillar.icon
            return (
              <div key={pillar.title} className="bg-white border border-gray-200 p-6 space-y-3">
                <div className="w-12 h-12 bg-[#FFD333] text-[#3D464D] flex items-center justify-center">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h2 className="text-lg font-bold text-[#3D464D]">{pillar.title}</h2>
                <p className="text-sm text-[#6C757D] leading-relaxed">{pillar.desc}</p>
              </div>
            )
          })}
        </section>

        {/* Leadership Team */}
        <section aria-labelledby="leadership-heading" className="space-y-6">
          <h2
            id="leadership-heading"
            className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D]"
          >
            <span>Leadership Team</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_MEMBERS.map((member) => (
              <article
                key={member.name}
                className="product-item bg-white border border-gray-200 overflow-hidden flex flex-col"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F5F5]">
                  <Image
                    src={member.image}
                    alt={`${member.name}, ${member.role} at Lydia Market`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-lg font-bold text-[#3D464D]">{member.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#6C757D] mt-0.5">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-sm text-[#495057] leading-relaxed pt-2 border-t border-gray-100">
                    {member.bio}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Press Mentions */}
        <section aria-labelledby="press-heading" className="space-y-6">
          <h2
            id="press-heading"
            className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D]"
          >
            <span>Press & Industry Coverage</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRESS_MENTIONS.map((press) => (
              <div key={press.headline} className="bg-white border border-gray-200 p-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#6C757D]">
                  <span className="inline-flex items-center gap-1.5 text-[#3D464D]">
                    <Newspaper className="w-4 h-4 text-[#FFD333]" aria-hidden="true" />
                    {press.outlet}
                  </span>
                  <span>{press.date}</span>
                </div>
                <p className="text-base sm:text-lg font-bold text-[#3D464D] leading-snug">
                  &ldquo;{press.headline}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#3D464D] text-white p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Ready to restock your shop smarter?</h2>
            <p className="text-sm text-[#F5F5F5] mt-1">
              Explore 40+ wholesale lines across 8 commercial categories today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/catalogue"
              className="min-h-[48px] min-w-[44px] bg-[#FFD333] px-6 py-3 inline-flex items-center justify-center text-sm font-bold text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              Browse Wholesale Catalogue
            </Link>
            <Link
              href="/contact"
              className="min-h-[48px] min-w-[44px] border border-white px-6 py-3 inline-flex items-center justify-center text-sm font-bold text-white hover:bg-white hover:text-[#3D464D] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            >
              Contact Trade Desk
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

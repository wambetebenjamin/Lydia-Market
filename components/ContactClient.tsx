'use client'

import { useState } from 'react'
import { MapPin, Phone, Mail, MessageCircle, Send } from 'lucide-react'
import { getRecaptchaV3Token, RecaptchaWidget } from '@/components/RecaptchaWidget'

export function ContactClient() {
  const [enquiryType, setEnquiryType] = useState<'Buyer Enquiry' | 'Supplier Enquiry'>(
    'Buyer Enquiry'
  )
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [requireV2, setRequireV2] = useState(false)
  const [v2Token, setV2Token] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)

    try {
      const recaptchaToken = await getRecaptchaV3Token('send_enquiry')
      const res = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enquiryType,
          name,
          businessName,
          email,
          phone,
          subject,
          message,
          recaptchaToken,
          recaptchaV2Token: v2Token,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        if (data.requireV2) setRequireV2(true)
        setFeedback({ ok: false, msg: data.error || 'Unable to send enquiry.' })
      } else {
        setFeedback({ ok: true, msg: data.message })
        setSubject('')
        setMessage('')
      }
    } catch {
      setFeedback({ ok: false, msg: 'Network error while submitting enquiry.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="py-6 sm:py-10">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="section-title text-2xl sm:text-3xl lg:text-4xl font-bold uppercase tracking-tight text-[#3D464D]">
            <span>Contact Wholesale Trade Desk</span>
          </h1>
          <p className="text-sm sm:text-base text-[#6C757D] mt-2">
            Speak with our Nairobi buyer support team or manufacturer onboarding specialists.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 bg-white border border-gray-200 p-6 sm:p-8 space-y-6">
            {/* Buyer / Supplier Tabs */}
            <div role="tablist" aria-label="Enquiry type" className="grid grid-cols-2 gap-3">
              {(['Buyer Enquiry', 'Supplier Enquiry'] as const).map((tab) => {
                const active = enquiryType === tab
                return (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={active}
                    type="button"
                    onClick={() => setEnquiryType(tab)}
                    className={`min-h-[48px] min-w-[44px] px-4 py-2.5 text-sm sm:text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active
                        ? 'bg-[#FFD333] text-[#3D464D]'
                        : 'bg-[#F5F5F5] text-[#3D464D] hover:bg-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                )
              })}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cnt-name" className="block text-sm font-semibold text-[#3D464D] mb-1">
                    Full Name
                  </label>
                  <input
                    id="cnt-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Grace Wanjiku"
                    className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cnt-business"
                    className="block text-sm font-semibold text-[#3D464D] mb-1"
                  >
                    Shop / Company Name
                  </label>
                  <input
                    id="cnt-business"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Wanjiku Retail Mart"
                    className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cnt-email" className="block text-sm font-semibold text-[#3D464D] mb-1">
                    Email Address
                  </label>
                  <input
                    id="cnt-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="orders@wanjikumart.co.ke"
                    className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>

                <div>
                  <label htmlFor="cnt-phone" className="block text-sm font-semibold text-[#3D464D] mb-1">
                    Phone Number
                  </label>
                  <input
                    id="cnt-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254712345678"
                    className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="cnt-subject"
                  className="block text-sm font-semibold text-[#3D464D] mb-1"
                >
                  Subject
                </label>
                <input
                  id="cnt-subject"
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={
                    enquiryType === 'Buyer Enquiry'
                      ? 'Bulk pallet delivery schedule to Nakuru'
                      : 'Onboarding our edible oils product range'
                  }
                  className="w-full min-h-[44px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="cnt-message"
                  className="block text-sm font-semibold text-[#3D464D] mb-1"
                >
                  Message
                </label>
                <textarea
                  id="cnt-message"
                  rows={4}
                  required
                  minLength={10}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share product SKUs, target county, or account question..."
                  className="w-full min-h-[100px] border border-gray-300 bg-white px-3.5 py-2 text-base text-[#3D464D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <RecaptchaWidget
                requireV2={requireV2}
                v2Verified={Boolean(v2Token)}
                onVerifyV2={(tok) => setV2Token(tok)}
                actionName="contact_enquiry"
              />

              {feedback && (
                <p
                  role="status"
                  className={`text-sm font-semibold ${
                    feedback.ok ? 'text-[#28a745]' : 'text-[#dc3545]'
                  }`}
                >
                  {feedback.msg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto min-h-[48px] min-w-[44px] bg-[#FFD333] px-7 py-3 inline-flex items-center justify-center gap-2 text-base font-bold text-[#3D464D] hover:bg-[#3D464D] hover:text-[#FFD333] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <Send className="w-4 h-4" aria-hidden="true" />
                <span>{submitting ? 'Sending Enquiry...' : `Send ${enquiryType}`}</span>
              </button>
            </form>
          </div>

          {/* Office Details Column */}
          <aside className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-gray-200 p-6 space-y-4">
              <h2 className="text-xl font-bold text-[#3D464D]">Head Office & Trade Hub</h2>

              <div className="space-y-3 text-sm sm:text-base text-[#495057]">
                <p className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#FFD333] flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <span>
                    Lydia Market Plaza, Enterprise Road, Industrial Area, P.O. Box 48910-00100, Nairobi, Kenya
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#FFD333] flex-shrink-0" aria-hidden="true" />
                  <a
                    href="tel:+254112272061"
                    className="min-h-[44px] inline-flex items-center font-semibold text-[#3D464D] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    +254 112 272 061
                  </a>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#FFD333] flex-shrink-0" aria-hidden="true" />
                  <a
                    href="mailto:support@lydiamarket.co.ke"
                    className="min-h-[44px] inline-flex items-center font-semibold text-[#3D464D] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    support@lydiamarket.co.ke
                  </a>
                </p>
              </div>

              <a
                href={`https://wa.me/254112272061?text=${encodeURIComponent(
                  'Hello Lydia Market trade desk, I have a wholesale enquiry.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full min-h-[48px] min-w-[44px] bg-[#25D366] px-5 py-3 inline-flex items-center justify-center gap-2 text-sm font-bold text-white hover:bg-[#20bd5a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
              >
                <MessageCircle className="w-5 h-5" aria-hidden="true" />
                <span>Chat Directly on WhatsApp (+254 112 272 061)</span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

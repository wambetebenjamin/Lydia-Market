import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { z } from 'zod'
import { lydiaStore } from '@/lib/server-store'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const providers = [
  Credentials({
    name: 'Buyer Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(rawCredentials) {
      const parsed = loginSchema.safeParse(rawCredentials)
      if (!parsed.success) return null

      const buyer = lydiaStore.buyers.find(
        (b) => b.email.toLowerCase() === parsed.data.email.toLowerCase() && b.password === parsed.data.password
      )
      if (!buyer) return null

      return {
        id: buyer.id,
        name: buyer.ownerName,
        email: buyer.email,
      }
    },
  }),
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
      ]
    : []),
]

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    'lydia-market-kenya-wholesale-secret-2026-key',
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        const buyer = lydiaStore.buyers.find((b) => b.email.toLowerCase() === user.email?.toLowerCase())
        if (buyer) {
          token.businessName = buyer.businessName
          token.county = buyer.county
          token.businessType = buyer.businessType
          token.phone = buyer.phone
        }
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const meta = session.user as unknown as Record<string, unknown>
        meta.businessName = token.businessName || 'Wanjiku Retail Mart'
        meta.county = token.county || 'Nairobi'
        meta.businessType = token.businessType || 'Retailer'
        meta.phone = token.phone || '+254712345678'
      }
      return session
    },
  },
})

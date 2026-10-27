import { notFound } from 'next/navigation'
import { PRODUCTS, SUPPLIERS, getSupplierBySlug } from '@/lib/data'
import { SupplierProfileClient } from '@/components/SupplierProfileClient'

export function generateStaticParams() {
  return SUPPLIERS.map((s) => ({ slug: s.slug }))
}

export default async function SupplierProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supplier = getSupplierBySlug(slug)

  if (!supplier) {
    notFound()
  }

  const products = PRODUCTS.filter((p) => p.supplierSlug === supplier.slug)

  return <SupplierProfileClient supplier={supplier} products={products} />
}

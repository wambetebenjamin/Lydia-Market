import { notFound } from 'next/navigation'
import { PRODUCTS, getProductBySlug, getSupplierBySlug } from '@/lib/data'
import { ProductDetailClient } from '@/components/ProductDetailClient'

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const supplier = getSupplierBySlug(product.supplierSlug)
  const relatedProducts = PRODUCTS.filter(
    (item) => item.category === product.category && item.slug !== product.slug
  ).slice(0, 4)

  return (
    <ProductDetailClient
      product={product}
      supplier={supplier}
      relatedProducts={relatedProducts}
    />
  )
}

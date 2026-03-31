import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockProducts, mockCategories } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import ProductForm from '@/components/products/ProductForm'
import { Product, Category } from '@/types'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let product: Product | null = null
  let categories: Category[] = []

  if (isSupabaseConfigured) {
    const supabase = await createClient()
    const [{ data: p }, { data: c }] = await Promise.all([
      supabase.from('products').select('*, categories(name)').eq('id', id).single(),
      supabase.from('categories').select('*').order('name'),
    ])
    product = p as Product | null
    categories = c ?? []
  } else {
    product = mockProducts.find((p) => p.id === id) ?? null
    categories = mockCategories
  }

  if (!product) notFound()

  return (
    <div>
      <Header title="Ürünü Düzenle" description={`${product.name} bilgilerini güncelleyin`} />
      <ProductForm categories={categories} product={product} />
    </div>
  )
}

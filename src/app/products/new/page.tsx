import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockCategories } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import ProductForm from '@/components/products/ProductForm'
import { Category } from '@/types'

export default async function NewProductPage() {
  let categories: Category[] = []

  if (isSupabaseConfigured) {
    const supabase = await createClient()
    const { data } = await supabase.from('categories').select('*').order('name')
    categories = data ?? []
  } else {
    categories = mockCategories
  }

  return (
    <div>
      <Header title="Yeni Ürün" description="Envantere yeni bir ürün ekleyin" />
      <ProductForm categories={categories} />
    </div>
  )
}

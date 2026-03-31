import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockProducts } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import ProductTable from '@/components/products/ProductTable'
import Button from '@/components/ui/Button'
import { Product } from '@/types'

export default async function ProductsPage() {
  let products: Product[] = []

  if (isSupabaseConfigured) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('products')
      .select('*, categories(name)')
      .order('created_at', { ascending: false })
    products = (data as Product[]) ?? []
  } else {
    products = mockProducts
  }

  return (
    <div>
      <Header
        title="Ürünler"
        description="Tüm ürünleri yönetin"
        actions={
          <Link href="/products/new">
            <Button>+ Yeni Ürün</Button>
          </Link>
        }
      />
      <ProductTable products={products} />
    </div>
  )
}

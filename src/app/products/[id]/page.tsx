import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockProducts, mockMovements } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import DeleteProductButton from '@/components/products/DeleteProductButton'
import MovementTable from '@/components/movements/MovementTable'
import MovementForm from '@/components/movements/MovementForm'
import { formatCurrency, formatNumber } from '@/lib/utils/formatters'
import { Product, StockMovement } from '@/types'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  let product: Product | null = null
  let movements: StockMovement[] = []

  if (isSupabaseConfigured) {
    const supabase = await createClient()
    const [{ data: p }, { data: m }] = await Promise.all([
      supabase.from('products').select('*, categories(name)').eq('id', id).single(),
      supabase
        .from('stock_movements')
        .select('*, products(name, sku, unit)')
        .eq('product_id', id)
        .order('created_at', { ascending: false })
        .limit(20),
    ])
    product = p as Product | null
    movements = (m as StockMovement[]) ?? []
  } else {
    product = mockProducts.find((p) => p.id === id) ?? null
    movements = mockMovements.filter((m) => m.product_id === id)
  }

  if (!product) notFound()

  const p = product
  const isLow = p.current_stock < p.min_stock_level

  return (
    <div>
      <Header
        title={p.name}
        description={`SKU: ${p.sku}`}
        actions={
          <div className="flex gap-2">
            <Link href={`/products/${id}/edit`}>
              <Button variant="secondary" size="sm">Düzenle</Button>
            </Link>
            <DeleteProductButton id={id} name={p.name} />
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Mevcut Stok</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(p.current_stock)}{' '}
            <span className="text-base font-normal text-gray-500">{p.unit}</span>
          </p>
          {isLow && <Badge variant="danger" className="mt-2">Düşük Stok</Badge>}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Min Stok Seviyesi</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatNumber(p.min_stock_level)}{' '}
            <span className="text-base font-normal text-gray-500">{p.unit}</span>
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Birim Fiyat</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(p.price)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">Stok Değeri</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(p.current_stock * p.price)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Stok Hareketi Ekle</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            {isSupabaseConfigured ? (
              <MovementForm productId={id} productName={p.name} unit={p.unit} />
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">
                Stok hareketi eklemek için Supabase bağlantısı gereklidir.
              </p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Son Hareketler</h2>
          <MovementTable movements={movements} hideProduct />
        </div>
      </div>
    </div>
  )
}

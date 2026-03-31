import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockLowStock } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import { LowStockProduct } from '@/types'
import { formatNumber, formatCurrency } from '@/lib/utils/formatters'

function getCriticalityVariant(shortage: number, minLevel: number): 'danger' | 'warning' | 'info' {
  const ratio = minLevel > 0 ? shortage / minLevel : 0
  if (ratio > 0.75) return 'danger'
  if (ratio > 0.25) return 'warning'
  return 'info'
}

export default async function LowStockPage() {
  let items: LowStockProduct[] = []

  if (isSupabaseConfigured) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('low_stock_products')
      .select('*')
      .order('shortage', { ascending: false })
    items = (data as LowStockProduct[]) ?? []
  } else {
    items = mockLowStock
  }

  return (
    <div>
      <Header
        title="Düşük Stok Uyarıları"
        description={`${items.length} ürün minimum stok seviyesinin altında`}
      />

      {items.length === 0 ? (
        <EmptyState
          title="Düşük stoklu ürün yok"
          description="Tüm ürünler minimum stok seviyesinin üzerinde"
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Ürün</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-right">Mevcut Stok</th>
                <th className="px-4 py-3 text-right">Min Seviye</th>
                <th className="px-4 py-3 text-right">Eksik Miktar</th>
                <th className="px-4 py-3 text-right">Eksik Değer</th>
                <th className="px-4 py-3 text-right">Kritiklik</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => {
                const critVariant = getCriticalityVariant(item.shortage, item.min_stock_level)
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-gray-400 text-xs font-mono">{item.sku}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{item.category_name ?? '—'}</td>
                    <td className="px-4 py-3 text-right font-medium text-red-600">
                      {formatNumber(item.current_stock)} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {formatNumber(item.min_stock_level)} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-red-700">
                      {formatNumber(item.shortage)} {item.unit}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {formatCurrency(item.shortage * item.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Badge variant={critVariant}>
                        {critVariant === 'danger' ? 'Kritik' : critVariant === 'warning' ? 'Uyarı' : 'Düşük'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/products/${item.id}`}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Stok Ekle →
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

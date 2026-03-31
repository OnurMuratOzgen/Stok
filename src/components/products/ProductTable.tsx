'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Product } from '@/types'
import { formatCurrency, formatNumber } from '@/lib/utils/formatters'
import Badge from '@/components/ui/Badge'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'

interface ProductTableProps {
  products: Product[]
}

export default function ProductTable({ products }: ProductTableProps) {
  const [search, setSearch] = useState('')

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Ürün adı veya SKU ile ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Ürün bulunamadı"
          description={search ? 'Arama kriterlerinizi değiştirin' : 'Henüz ürün eklenmemiş'}
          action={
            !search ? (
              <Link href="/products/new">
                <Button size="sm">İlk Ürünü Ekle</Button>
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-4 py-3">Ürün</th>
                <th className="px-4 py-3">SKU</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3 text-right">Mevcut Stok</th>
                <th className="px-4 py-3 text-right">Min Stok</th>
                <th className="px-4 py-3 text-right">Birim Fiyat</th>
                <th className="px-4 py-3 text-right">Durum</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((product) => {
                const isLow = product.current_stock < product.min_stock_level
                return (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{product.name}</td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {product.categories?.name ?? <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatNumber(product.current_stock)} {product.unit}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-500">
                      {formatNumber(product.min_stock_level)} {product.unit}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {isLow ? (
                        <Badge variant="danger">Düşük</Badge>
                      ) : (
                        <Badge variant="success">Normal</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Detay →
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

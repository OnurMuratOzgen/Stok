import Link from 'next/link'
import { LowStockProduct } from '@/types'
import { formatNumber } from '@/lib/utils/formatters'
import Badge from '@/components/ui/Badge'

interface LowStockSummaryProps {
  items: LowStockProduct[]
}

export default function LowStockSummary({ items }: LowStockSummaryProps) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-gray-400 py-4 text-center">Tüm stoklar yeterli seviyede</p>
    )
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((item) => {
        const ratio = item.min_stock_level > 0 ? item.shortage / item.min_stock_level : 0
        return (
          <Link
            key={item.id}
            href={`/products/${item.id}`}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                {item.name}
              </p>
              <p className="text-xs text-gray-400">
                {formatNumber(item.current_stock)} / {formatNumber(item.min_stock_level)} {item.unit}
              </p>
            </div>
            <Badge variant={ratio > 0.75 ? 'danger' : ratio > 0.25 ? 'warning' : 'info'}>
              -{formatNumber(item.shortage)} {item.unit}
            </Badge>
          </Link>
        )
      })}
      {items.length > 5 && (
        <Link
          href="/low-stock"
          className="block text-center text-xs text-blue-600 hover:text-blue-800 py-2 font-medium"
        >
          +{items.length - 5} daha fazla görüntüle →
        </Link>
      )}
    </div>
  )
}

import { StockMovement } from '@/types'
import { formatDateTime, formatNumber } from '@/lib/utils/formatters'
import MovementBadge from './MovementBadge'
import EmptyState from '@/components/ui/EmptyState'

interface MovementTableProps {
  movements: StockMovement[]
  hideProduct?: boolean
}

export default function MovementTable({ movements, hideProduct }: MovementTableProps) {
  if (movements.length === 0) {
    return <EmptyState title="Henüz hareket yok" description="Bu ürün için stok hareketi kaydedilmedi" />
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            <th className="px-4 py-3">Tür</th>
            {!hideProduct && <th className="px-4 py-3">Ürün</th>}
            <th className="px-4 py-3 text-right">Miktar</th>
            <th className="px-4 py-3">Not</th>
            <th className="px-4 py-3">Tarih</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {movements.map((m) => (
            <tr key={m.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <MovementBadge type={m.type} />
              </td>
              {!hideProduct && (
                <td className="px-4 py-3 text-gray-700">
                  {m.products?.name ?? '—'}
                  <span className="text-gray-400 text-xs ml-1">({m.products?.sku})</span>
                </td>
              )}
              <td className="px-4 py-3 text-right font-medium">
                <span className={m.type === 'in' ? 'text-green-600' : 'text-red-600'}>
                  {m.type === 'in' ? '+' : '-'}{formatNumber(m.quantity)} {m.products?.unit ?? ''}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-500 text-xs">{m.note ?? '—'}</td>
              <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">
                {formatDateTime(m.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

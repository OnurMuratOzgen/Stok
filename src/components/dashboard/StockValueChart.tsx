'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { CategoryStockValue } from '@/types'
import { formatCurrency } from '@/lib/utils/formatters'

interface StockValueChartProps {
  data: CategoryStockValue[]
}

export default function StockValueChart({ data }: StockValueChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        Henüz veri yok
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={(v) =>
            new Intl.NumberFormat('tr-TR', { notation: 'compact' }).format(v)
          }
        />
        <Tooltip
          formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Stok Degeri']}
          contentStyle={{ fontSize: '13px', borderRadius: '8px' }}
        />
        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

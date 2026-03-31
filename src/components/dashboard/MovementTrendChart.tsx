'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { MovementTrend } from '@/types'
import { formatNumber } from '@/lib/utils/formatters'

interface MovementTrendChartProps {
  data: MovementTrend[]
}

export default function MovementTrendChart({ data }: MovementTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-sm text-gray-400">
        Son 30 günde hareket yok
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
        <defs>
          <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatNumber(v)} />
        <Tooltip
          formatter={(value, name) => [
            formatNumber(Number(value ?? 0)),
            name === 'in' ? 'Giris' : 'Cikis',
          ]}
          contentStyle={{ fontSize: '13px', borderRadius: '8px' }}
        />
        <Legend
          formatter={(value) => (value === 'in' ? 'Giris' : 'Cikis')}
          wrapperStyle={{ fontSize: '13px' }}
        />
        <Area
          type="monotone"
          dataKey="in"
          stroke="#22c55e"
          strokeWidth={2}
          fill="url(#colorIn)"
        />
        <Area
          type="monotone"
          dataKey="out"
          stroke="#ef4444"
          strokeWidth={2}
          fill="url(#colorOut)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

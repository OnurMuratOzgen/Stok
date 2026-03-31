import { clsx } from 'clsx'

interface StatsCardProps {
  title: string
  value: string
  subValue?: string
  variant?: 'default' | 'warning' | 'danger'
  icon: React.ReactNode
}

export default function StatsCard({ title, value, subValue, variant = 'default', icon }: StatsCardProps) {
  const iconBg = {
    default: 'bg-blue-100 text-blue-600',
    warning: 'bg-yellow-100 text-yellow-600',
    danger: 'bg-red-100 text-red-600',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4">
      <div className={clsx('p-3 rounded-xl', iconBg[variant])}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {subValue && <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>}
      </div>
    </div>
  )
}

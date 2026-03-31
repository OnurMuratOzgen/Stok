import { clsx } from 'clsx'

interface BadgeProps {
  variant?: 'success' | 'danger' | 'warning' | 'info' | 'gray'
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant = 'gray', children, className }: BadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-700',
    danger: 'bg-red-100 text-red-700',
    warning: 'bg-yellow-100 text-yellow-700',
    info: 'bg-blue-100 text-blue-700',
    gray: 'bg-gray-100 text-gray-700',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

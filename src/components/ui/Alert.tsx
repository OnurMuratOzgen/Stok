import { clsx } from 'clsx'

interface AlertProps {
  variant?: 'error' | 'warning' | 'success' | 'info'
  children: React.ReactNode
  className?: string
}

export default function Alert({ variant = 'error', children, className }: AlertProps) {
  const variants = {
    error: 'bg-red-50 border-red-200 text-red-700',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    success: 'bg-green-50 border-green-200 text-green-700',
    info: 'bg-blue-50 border-blue-200 text-blue-700',
  }

  return (
    <div className={clsx('border rounded-lg px-4 py-3 text-sm', variants[variant], className)}>
      {children}
    </div>
  )
}

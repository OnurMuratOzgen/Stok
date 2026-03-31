'use client'

import { useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MovementSchema, MovementFormData } from '@/lib/utils/validators'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

interface MovementFormProps {
  productId: string
  productName: string
  unit: string
}

export default function MovementForm({ productId, productName, unit }: MovementFormProps) {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MovementFormData>({
    resolver: zodResolver(MovementSchema) as Resolver<MovementFormData>,
    defaultValues: { product_id: productId, type: 'in', quantity: 1 },
  })

  const movementType = watch('type')

  async function onSubmit(data: MovementFormData) {
    setApiError(null)
    setSuccess(false)

    const res = await fetch('/api/movements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      setApiError(typeof body.error === 'string' ? body.error : 'Bir hata oluştu')
      return
    }

    setSuccess(true)
    reset({ product_id: productId, type: 'in', quantity: 1, note: '' })
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {apiError && <Alert variant="error">{apiError}</Alert>}
      {success && <Alert variant="success">Stok hareketi kaydedildi!</Alert>}

      <input type="hidden" {...register('product_id')} />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Hareket Türü</label>
        <div className="flex gap-2">
          <label
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 cursor-pointer text-sm font-medium transition-colors ${
              movementType === 'in'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <input type="radio" value="in" className="sr-only" {...register('type')} />
            Giris
          </label>
          <label
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border-2 cursor-pointer text-sm font-medium transition-colors ${
              movementType === 'out'
                ? 'border-red-500 bg-red-50 text-red-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            }`}
          >
            <input type="radio" value="out" className="sr-only" {...register('type')} />
            Cikis
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Miktar ({unit})
        </label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('quantity')}
        />
        {errors.quantity && <p className="text-xs text-red-500 mt-1">{errors.quantity.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Not (opsiyonel)</label>
        <input
          type="text"
          placeholder="Örn: Tedarikçi X'ten alındı"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...register('note')}
        />
      </div>

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full"
        variant={movementType === 'in' ? 'primary' : 'danger'}
      >
        {movementType === 'in' ? 'Stok Girisi Yap' : 'Stok Cikisi Yap'}
      </Button>
    </form>
  )
}

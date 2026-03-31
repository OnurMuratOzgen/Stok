'use client'

import { useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { ProductSchema, ProductFormData } from '@/lib/utils/validators'
import { Category, Product } from '@/types'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import Alert from '@/components/ui/Alert'

interface ProductFormProps {
  categories: Category[]
  product?: Product
}

const UNITS = ['Adet', 'Kg', 'Lt', 'Kutu', 'Paket', 'Metre', 'Ton']

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter()
  const [apiError, setApiError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(ProductSchema) as Resolver<ProductFormData>,
    defaultValues: product
      ? {
          name: product.name,
          sku: product.sku,
          category_id: product.category_id ?? undefined,
          unit: product.unit,
          min_stock_level: product.min_stock_level,
          price: product.price,
        }
      : { unit: 'Adet', min_stock_level: 0, price: 0 },
  })

  async function onSubmit(data: ProductFormData) {
    setApiError(null)
    const url = product ? `/api/products/${product.id}` : '/api/products'
    const method = product ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      const body = await res.json()
      setApiError(typeof body.error === 'string' ? body.error : 'Bir hata oluştu')
      return
    }

    router.push('/products')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-lg">
      {apiError && <Alert variant="error">{apiError}</Alert>}

      <Input
        id="name"
        label="Ürün Adı"
        placeholder="Örn: A4 Kağıt"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        id="sku"
        label="SKU / Barkod"
        placeholder="Örn: KRT-A4-80"
        error={errors.sku?.message}
        {...register('sku')}
      />

      <Select
        id="category_id"
        label="Kategori"
        error={errors.category_id?.message}
        {...register('category_id')}
      >
        <option value="">Kategori seçin (opsiyonel)</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </Select>

      <Select id="unit" label="Birim" error={errors.unit?.message} {...register('unit')}>
        {UNITS.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="min_stock_level"
          label="Min Stok Seviyesi"
          type="number"
          min="0"
          step="0.01"
          error={errors.min_stock_level?.message}
          {...register('min_stock_level')}
        />
        <Input
          id="price"
          label="Birim Fiyat (₺)"
          type="number"
          min="0"
          step="0.01"
          error={errors.price?.message}
          {...register('price')}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" loading={isSubmitting}>
          {product ? 'Güncelle' : 'Ürün Ekle'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          İptal
        </Button>
      </div>
    </form>
  )
}

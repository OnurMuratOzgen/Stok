import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(1, 'Ürün adı gerekli'),
  sku: z.string().min(1, 'SKU gerekli'),
  category_id: z.string().nullable().optional(),
  unit: z.string().min(1, 'Birim gerekli'),
  min_stock_level: z.coerce.number().min(0, 'Min stok seviyesi 0 veya üzeri olmalı'),
  price: z.coerce.number().min(0, 'Fiyat 0 veya üzeri olmalı'),
})

export type ProductFormData = z.infer<typeof ProductSchema>

export const MovementSchema = z.object({
  product_id: z.string().min(1, 'Ürün seçimi gerekli'),
  type: z.enum(['in', 'out']),
  quantity: z.coerce.number().min(0.01, 'Miktar 0\'dan büyük olmalı'),
  note: z.string().optional(),
})

export type MovementFormData = z.infer<typeof MovementSchema>

export const CategorySchema = z.object({
  name: z.string().min(1, 'Kategori adı gerekli'),
})

export type CategoryFormData = z.infer<typeof CategorySchema>

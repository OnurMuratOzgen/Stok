export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Product {
  id: string
  name: string
  sku: string
  category_id: string | null
  unit: string
  min_stock_level: number
  price: number
  current_stock: number
  created_at: string
  updated_at: string
  categories?: { name: string } | null
}

export interface StockMovement {
  id: string
  product_id: string
  type: 'in' | 'out'
  quantity: number
  note: string | null
  created_at: string
  products?: { name: string; sku: string; unit: string } | null
}

export interface LowStockProduct {
  id: string
  name: string
  sku: string
  unit: string
  current_stock: number
  min_stock_level: number
  price: number
  category_id: string | null
  category_name: string | null
  shortage: number
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalProducts: number
  totalStockValue: number
  lowStockCount: number
  todayIn: number
  todayOut: number
}

export interface CategoryStockValue {
  category: string
  value: number
}

export interface MovementTrend {
  date: string
  in: number
  out: number
}

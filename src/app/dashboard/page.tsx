import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockProducts, mockMovements, mockLowStock } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import StatsCard from '@/components/dashboard/StatsCard'
import StockValueChart from '@/components/dashboard/StockValueChart'
import MovementTrendChart from '@/components/dashboard/MovementTrendChart'
import LowStockSummary from '@/components/dashboard/LowStockSummary'
import { CategoryStockValue, LowStockProduct, MovementTrend } from '@/types'
import { formatCurrency } from '@/lib/utils/formatters'
import { subDays, startOfDay, format } from 'date-fns'

export default async function DashboardPage() {
  let totalProducts = 0
  let totalStockValue = 0
  let lowStockItems: LowStockProduct[] = []
  let todayIn = 0
  let todayOut = 0
  let categoryData: CategoryStockValue[] = []
  let trendData: MovementTrend[] = []

  if (isSupabaseConfigured) {
    const supabase = await createClient()
    const todayStart = startOfDay(new Date()).toISOString()
    const thirtyDaysAgo = subDays(new Date(), 30).toISOString()

    const [
      { count },
      { data: stockValue },
      { data: lowStock },
      { data: todayMovements },
      { data: trendMovements },
      { data: categoryProducts },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('current_stock, price'),
      supabase.from('low_stock_products').select('*').order('shortage', { ascending: false }),
      supabase.from('stock_movements').select('type, quantity').gte('created_at', todayStart),
      supabase
        .from('stock_movements')
        .select('type, quantity, created_at')
        .gte('created_at', thirtyDaysAgo)
        .order('created_at'),
      supabase.from('products').select('price, current_stock, categories(name)'),
    ])

    totalProducts = count ?? 0
    totalStockValue = (stockValue ?? []).reduce((s, p) => s + p.current_stock * p.price, 0)
    lowStockItems = (lowStock as LowStockProduct[]) ?? []
    todayIn = (todayMovements ?? []).filter((m) => m.type === 'in').reduce((s, m) => s + m.quantity, 0)
    todayOut = (todayMovements ?? []).filter((m) => m.type === 'out').reduce((s, m) => s + m.quantity, 0)

    const catMap: Record<string, number> = {}
    for (const p of categoryProducts ?? []) {
      const catName = (p.categories as unknown as { name: string } | null)?.name ?? 'Kategorisiz'
      catMap[catName] = (catMap[catName] ?? 0) + p.current_stock * p.price
    }
    categoryData = Object.entries(catMap)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)

    const trendMap: Record<string, { in: number; out: number }> = {}
    for (let i = 29; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'd MMM')
      trendMap[d] = { in: 0, out: 0 }
    }
    for (const m of trendMovements ?? []) {
      const d = format(new Date(m.created_at), 'd MMM')
      if (trendMap[d]) trendMap[d][m.type as 'in' | 'out'] += m.quantity
    }
    trendData = Object.entries(trendMap).map(([date, vals]) => ({ date, ...vals }))
  } else {
    // Mock data
    totalProducts = mockProducts.length
    totalStockValue = mockProducts.reduce((s, p) => s + p.current_stock * p.price, 0)
    lowStockItems = mockLowStock
    todayIn = 62
    todayOut = 20

    const catMap: Record<string, number> = {}
    for (const p of mockProducts) {
      const cat = p.categories?.name ?? 'Kategorisiz'
      catMap[cat] = (catMap[cat] ?? 0) + p.current_stock * p.price
    }
    categoryData = Object.entries(catMap)
      .map(([category, value]) => ({ category, value }))
      .sort((a, b) => b.value - a.value)

    trendData = Array.from({ length: 30 }, (_, i) => ({
      date: format(subDays(new Date(), 29 - i), 'd MMM'),
      in: Math.floor(Math.random() * 80 + 10),
      out: Math.floor(Math.random() * 50 + 5),
    }))
  }

  return (
    <div>
      <Header title="Dashboard" description="Envanter genel durumu" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Toplam Ürün"
          value={`${totalProducts}`}
          subValue="kayıtlı ürün"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatsCard
          title="Toplam Stok Değeri"
          value={formatCurrency(totalStockValue)}
          subValue="mevcut envanter değeri"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          title="Düşük Stok"
          value={`${lowStockItems.length}`}
          subValue="ürün kritik seviyede"
          variant={lowStockItems.length > 0 ? 'danger' : 'default'}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          }
        />
        <StatsCard
          title="Bugünkü Hareketler"
          value={`+${todayIn.toFixed(0)} / -${todayOut.toFixed(0)}`}
          subValue="giriş / çıkış"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Kategori Bazlı Stok Değeri</h2>
          <StockValueChart data={categoryData} />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">30 Günlük Hareket Trendi</h2>
          <MovementTrendChart data={trendData} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Düşük Stok Uyarıları</h2>
          {lowStockItems.length > 0 && (
            <a href="/low-stock" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
              Tümünü gör →
            </a>
          )}
        </div>
        <LowStockSummary items={lowStockItems} />
      </div>
    </div>
  )
}

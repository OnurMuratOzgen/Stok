import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { mockMovements } from '@/lib/mock-data'
import Header from '@/components/layout/Header'
import MovementTable from '@/components/movements/MovementTable'
import { StockMovement } from '@/types'

export default async function MovementsPage() {
  let movements: StockMovement[] = []

  if (isSupabaseConfigured) {
    const supabase = await createClient()
    const { data } = await supabase
      .from('stock_movements')
      .select('*, products(name, sku, unit)')
      .order('created_at', { ascending: false })
      .limit(100)
    movements = (data as StockMovement[]) ?? []
  } else {
    movements = mockMovements
  }

  return (
    <div>
      <Header title="Stok Hareketleri" description="Tüm giriş ve çıkış hareketleri" />
      <MovementTable movements={movements} />
    </div>
  )
}

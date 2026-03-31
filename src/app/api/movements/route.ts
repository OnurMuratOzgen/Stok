import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MovementSchema } from '@/lib/utils/validators'

export async function GET(req: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(req.url)
  const productId = searchParams.get('product_id')
  const limit = Number(searchParams.get('limit') ?? 50)

  let query = supabase
    .from('stock_movements')
    .select('*, products(name, sku, unit)')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (productId) {
    query = query.eq('product_id', productId)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const body = await req.json()
  const parsed = MovementSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  // Çıkış ise mevcut stoğu kontrol et
  if (parsed.data.type === 'out') {
    const { data: product } = await supabase
      .from('products')
      .select('current_stock, name')
      .eq('id', parsed.data.product_id)
      .single()

    if (product && product.current_stock < parsed.data.quantity) {
      return NextResponse.json(
        { error: `Yetersiz stok. Mevcut: ${product.current_stock}` },
        { status: 422 }
      )
    }
  }

  const { data, error } = await supabase
    .from('stock_movements')
    .insert(parsed.data)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

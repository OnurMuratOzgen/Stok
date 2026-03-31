import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/supabase/config'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Stok Takip',
  description: 'Envanter Yonetim Sistemi',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let lowStockCount = 0

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient()
      const { count } = await supabase
        .from('low_stock_products')
        .select('*', { count: 'exact', head: true })
      lowStockCount = count ?? 0
    } catch {
      // Supabase bağlantı hatası — sessizce yoksay
    }
  }

  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full flex bg-gray-50">
        <Sidebar lowStockCount={lowStockCount} />
        <main className="flex-1 overflow-y-auto p-8">
          {!isSupabaseConfigured && (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-sm font-semibold text-amber-800">Supabase Yapilandirmasi Gerekli</p>
              <p className="mt-1 text-sm text-amber-700">
                <code className="font-mono bg-amber-100 px-1 rounded">.env.local</code> dosyasina{' '}
                <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code> ve{' '}
                <code className="font-mono bg-amber-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code> degerlerini ekleyin,
                ardindan sunucuyu yeniden baslatın.
              </p>
            </div>
          )}
          {children}
        </main>
      </body>
    </html>
  )
}

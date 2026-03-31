import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import { createClient } from '@/lib/supabase/server'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'Stok Takip',
  description: 'Envanter Yonetim Sistemi',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { count: lowStockCount } = await supabase
    .from('low_stock_products')
    .select('*', { count: 'exact', head: true })

  return (
    <html lang="tr" className={`${geist.variable} h-full antialiased`}>
      <body className="h-full flex bg-gray-50">
        <Sidebar lowStockCount={lowStockCount ?? 0} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </body>
    </html>
  )
}

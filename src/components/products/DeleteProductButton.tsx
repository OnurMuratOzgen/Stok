'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export default function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    await fetch(`/api/products/${id}`, { method: 'DELETE' })
    setLoading(false)
    setOpen(false)
    router.push('/products')
    router.refresh()
  }

  return (
    <>
      <Button variant="danger" size="sm" onClick={() => setOpen(true)}>
        Sil
      </Button>
      <Modal
        open={open}
        title="Ürünü Sil"
        onClose={() => setOpen(false)}
        onConfirm={handleDelete}
        confirmLabel="Evet, Sil"
        confirmVariant="danger"
        loading={loading}
      >
        <p>
          <strong>{name}</strong> ürününü silmek istediginize emin misiniz? Bu ürüne ait tüm stok
          hareketleri de silinecektir.
        </p>
      </Modal>
    </>
  )
}

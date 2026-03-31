'use client'

import { useEffect, useRef } from 'react'
import Button from './Button'

interface ModalProps {
  open: boolean
  title: string
  children: React.ReactNode
  onClose: () => void
  onConfirm?: () => void
  confirmLabel?: string
  confirmVariant?: 'primary' | 'danger'
  loading?: boolean
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  onConfirm,
  confirmLabel = 'Onayla',
  confirmVariant = 'primary',
  loading,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  }, [open])

  if (!open) return null

  return (
    <dialog
      ref={dialogRef}
      className="rounded-xl shadow-xl p-0 backdrop:bg-black/40 w-full max-w-md"
      onClose={onClose}
    >
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <div className="text-sm text-gray-600">{children}</div>
        {onConfirm && (
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="secondary" onClick={onClose} disabled={loading}>
              Vazgec
            </Button>
            <Button variant={confirmVariant} onClick={onConfirm} loading={loading}>
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </dialog>
  )
}

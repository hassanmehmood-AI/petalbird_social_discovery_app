"use client"

import { useState } from "react"
import { AlertDialog } from "@base-ui/react/alert-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void | Promise<void>
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = true,
  onConfirm,
}: ConfirmDialogProps) {
  const [pending, setPending] = useState(false)

  async function handleConfirm() {
    setPending(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } finally {
      setPending(false)
    }
  }

  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop
          className={cn(
            "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
            "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-200"
          )}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <AlertDialog.Popup
            className={cn(
              "w-full max-w-sm rounded-2xl bg-card border border-outline-variant/20 shadow-[0_8px_40px_rgba(123,127,239,0.16)] p-6",
              "data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 transition-all duration-200"
            )}
          >
            <AlertDialog.Title className="text-lg font-bold font-heading text-on-surface">
              {title}
            </AlertDialog.Title>
            {description && (
              <AlertDialog.Description className="text-sm text-on-surface-variant mt-1">
                {description}
              </AlertDialog.Description>
            )}
            <div className="flex justify-end gap-2 mt-6">
              <AlertDialog.Close
                render={<Button variant="outline" disabled={pending} />}
              >
                {cancelLabel}
              </AlertDialog.Close>
              <Button
                variant={destructive ? "destructive" : "default"}
                disabled={pending}
                onClick={handleConfirm}
              >
                {pending ? "Please wait…" : confirmLabel}
              </Button>
            </div>
          </AlertDialog.Popup>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}

export { ConfirmDialog }

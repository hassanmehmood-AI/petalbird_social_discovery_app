import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root
const DialogTrigger = DialogPrimitive.Trigger

function DialogPortal({ children, ...props }: DialogPrimitive.Portal.Props) {
  return (
    <DialogPrimitive.Portal {...props}>
      <DialogPrimitive.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm",
          "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 transition-opacity duration-200"
        )}
      />
      {children}
    </DialogPrimitive.Portal>
  )
}

function DialogContent({ className, children, ...props }: DialogPrimitive.Popup.Props) {
  return (
    <DialogPortal>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <DialogPrimitive.Popup
          className={cn(
            "w-full max-w-md rounded-2xl bg-card border border-outline-variant/20 shadow-[0_8px_40px_rgba(123,127,239,0.16)] p-6",
            "data-[starting-style]:opacity-0 data-[starting-style]:scale-95 data-[ending-style]:opacity-0 data-[ending-style]:scale-95 transition-all duration-200",
            className
          )}
          {...props}
        >
          {children}
          <DialogPrimitive.Close
            className="absolute top-4 right-4 rounded-full p-1 text-on-surface-variant hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </DialogPrimitive.Close>
        </DialogPrimitive.Popup>
      </div>
    </DialogPortal>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-bold font-heading text-on-surface pr-6", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-on-surface-variant mt-1", className)}
      {...props}
    />
  )
}

const DialogClose = DialogPrimitive.Close

export { Dialog, DialogTrigger, DialogPortal, DialogContent, DialogTitle, DialogDescription, DialogClose }

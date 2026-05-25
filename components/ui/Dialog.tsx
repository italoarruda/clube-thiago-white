'use client'
import * as RadixDialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Dialog({ children, ...props }: RadixDialog.DialogProps) {
  return <RadixDialog.Root {...props}>{children}</RadixDialog.Root>
}

export const DialogTrigger = RadixDialog.Trigger

interface DialogContentProps extends RadixDialog.DialogContentProps {
  title: string
  description?: string
}

export function DialogContent({ title, description, children, className, ...props }: DialogContentProps) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
      <RadixDialog.Content
        className={cn(
          'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
          'bg-[var(--card-bg)] rounded-xl shadow-xl border border-[var(--border)]',
          'w-full max-w-lg max-h-[90vh] overflow-y-auto p-6',
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <RadixDialog.Title className="text-lg font-semibold">{title}</RadixDialog.Title>
            {description && (
              <RadixDialog.Description className="text-sm text-[var(--muted)] mt-0.5">
                {description}
              </RadixDialog.Description>
            )}
          </div>
          <RadixDialog.Close className="p-1.5 rounded-lg hover:bg-[var(--border)] transition-colors">
            <X size={18} />
          </RadixDialog.Close>
        </div>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  )
}

export const DialogClose = RadixDialog.Close

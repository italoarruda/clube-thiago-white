import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'h-9 w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  ),
)
Input.displayName = 'Input'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-[var(--foreground)]">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={id}
        className={cn(
          'w-full rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-24',
          error && 'border-red-500',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  ),
)
Textarea.displayName = 'Textarea'

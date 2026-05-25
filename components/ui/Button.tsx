import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

const button = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-[var(--border)] text-[var(--foreground)] hover:bg-slate-200 dark:hover:bg-slate-700',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        ghost: 'text-[var(--foreground)] hover:bg-[var(--border)]',
        outline: 'border border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--border)]',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-10 px-6',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(button({ variant, size }), className)} {...props} />
  ),
)
Button.displayName = 'Button'

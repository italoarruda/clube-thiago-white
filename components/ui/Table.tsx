import { cn } from '@/lib/utils'

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className={cn('w-full text-sm', className)} {...props} />
    </div>
  )
}

export function Thead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn('bg-slate-50 dark:bg-slate-800/50 text-[var(--muted)] text-xs uppercase tracking-wide', className)}
      {...props}
    />
  )
}

export function Tbody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-[var(--border)]', className)} {...props} />
}

export function Tr({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('bg-[var(--card-bg)] hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors', className)}
      {...props}
    />
  )
}

export function Th({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return <th className={cn('px-4 py-3 text-left font-semibold', className)} {...props} />
}

export function Td({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3', className)} {...props} />
}

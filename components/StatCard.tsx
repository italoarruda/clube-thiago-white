import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple'
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
}

export function StatCard({ title, value, icon: Icon, description, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-[var(--card-bg)] border border-[var(--border)] rounded-xl p-5 flex items-start gap-4">
      <div className={cn('p-3 rounded-xl', colorMap[color])}>
        <Icon size={22} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-[var(--muted)]">{title}</p>
        <p className="text-2xl font-bold mt-0.5 truncate">{value}</p>
        {description && <p className="text-xs text-[var(--muted)] mt-1">{description}</p>}
      </div>
    </div>
  )
}

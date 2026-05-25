'use client'
import * as RadixSelect from '@radix-ui/react-select'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps {
  label?: string
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  options: { value: string; label: string }[]
  className?: string
  disabled?: boolean
}

export function Select({ label, placeholder, value, onValueChange, options, className, disabled }: SelectProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && <label className="text-sm font-medium text-[var(--foreground)]">{label}</label>}
      <RadixSelect.Root value={value} onValueChange={onValueChange} disabled={disabled}>
        <RadixSelect.Trigger className="flex h-9 w-full items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card-bg)] px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50">
          <RadixSelect.Value placeholder={placeholder ?? 'Selecione...'} />
          <ChevronDown size={16} className="text-[var(--muted)]" />
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content className="z-50 bg-[var(--card-bg)] border border-[var(--border)] rounded-lg shadow-lg overflow-hidden min-w-32">
            <RadixSelect.Viewport className="p-1">
              {options.map(opt => (
                <RadixSelect.Item
                  key={opt.value}
                  value={opt.value}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded cursor-pointer hover:bg-[var(--border)] focus:bg-[var(--border)] focus:outline-none"
                >
                  <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="ml-auto">
                    <Check size={14} />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  )
}

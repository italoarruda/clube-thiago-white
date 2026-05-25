import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatDate(date: string | null | undefined): string {
  if (!date) return '—'
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('pt-BR')
}

export function formatMonth(date: string): string {
  const d = new Date(date + 'T00:00:00')
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
}

export function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}-01`
}

export function currentYear(): number {
  return new Date().getFullYear()
}

export function currentMonthKey(): string {
  const now = new Date()
  return monthKey(now.getFullYear(), now.getMonth() + 1)
}

export function getMonthsOfYear(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) => monthKey(year, i + 1))
}

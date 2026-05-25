import { describe, it, expect } from 'vitest'
import { formatCurrency, formatDate, monthKey, getMonthsOfYear } from '../../lib/utils'

describe('formatCurrency', () => {
  it('formata valor em reais', () => {
    expect(formatCurrency(100)).toBe('R$ 100,00')
  })

  it('formata zero corretamente', () => {
    expect(formatCurrency(0)).toBe('R$ 0,00')
  })

  it('formata valor negativo', () => {
    expect(formatCurrency(-50.5)).toBe('-R$ 50,50')
  })
})

describe('formatDate', () => {
  it('formata data ISO para pt-BR', () => {
    const result = formatDate('2025-01-15')
    expect(result).toBe('15/01/2025')
  })

  it('retorna traço para null', () => {
    expect(formatDate(null)).toBe('—')
  })

  it('retorna traço para undefined', () => {
    expect(formatDate(undefined)).toBe('—')
  })
})

describe('monthKey', () => {
  it('gera chave no formato YYYY-MM-01', () => {
    expect(monthKey(2025, 3)).toBe('2025-03-01')
  })

  it('padeia mês com zero', () => {
    expect(monthKey(2025, 1)).toBe('2025-01-01')
  })

  it('gera dezembro corretamente', () => {
    expect(monthKey(2025, 12)).toBe('2025-12-01')
  })
})

describe('getMonthsOfYear', () => {
  it('retorna 12 meses', () => {
    expect(getMonthsOfYear(2025)).toHaveLength(12)
  })

  it('começa em janeiro', () => {
    expect(getMonthsOfYear(2025)[0]).toBe('2025-01-01')
  })

  it('termina em dezembro', () => {
    expect(getMonthsOfYear(2025)[11]).toBe('2025-12-01')
  })
})

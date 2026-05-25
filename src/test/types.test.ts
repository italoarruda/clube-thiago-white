import { describe, it, expect } from 'vitest'
import {
  CARGO_LABELS,
  STATUS_LABELS,
  STATUS_MENSALIDADE_LABELS,
  ESTADO_PATRIMONIO_LABELS,
  TIPO_ATA_LABELS,
  TIPO_ATO_LABELS,
  MESES,
} from '../../lib/types'

describe('CARGO_LABELS', () => {
  it('tem rótulo para todos os cargos', () => {
    const cargos = ['desbravador', 'conselheiro', 'instrutor', 'aspirante', 'diretor'] as const
    cargos.forEach(c => {
      expect(CARGO_LABELS[c]).toBeTruthy()
    })
  })
})

describe('STATUS_LABELS', () => {
  it('tem rótulo para todos os status', () => {
    const status = ['ativo', 'inativo', 'transferido', 'desligado'] as const
    status.forEach(s => {
      expect(STATUS_LABELS[s]).toBeTruthy()
    })
  })
})

describe('STATUS_MENSALIDADE_LABELS', () => {
  it('tem rótulo para todos os status de mensalidade', () => {
    const status = ['pendente', 'pago', 'atrasado', 'isento'] as const
    status.forEach(s => {
      expect(STATUS_MENSALIDADE_LABELS[s]).toBeTruthy()
    })
  })
})

describe('MESES', () => {
  it('tem 12 meses', () => {
    expect(MESES).toHaveLength(12)
  })

  it('começa com Janeiro', () => {
    expect(MESES[0]).toBe('Janeiro')
  })

  it('termina com Dezembro', () => {
    expect(MESES[11]).toBe('Dezembro')
  })
})

describe('TIPO_ATA_LABELS', () => {
  it('tem rótulo para todos os tipos de ata', () => {
    const tipos = ['diretoria', 'clube', 'pais', 'extraordinaria'] as const
    tipos.forEach(t => {
      expect(TIPO_ATA_LABELS[t]).toBeTruthy()
    })
  })
})

describe('TIPO_ATO_LABELS', () => {
  it('tem rótulo para todos os tipos de ato', () => {
    const tipos = ['resolucao', 'portaria', 'circular', 'oficio'] as const
    tipos.forEach(t => {
      expect(TIPO_ATO_LABELS[t]).toBeTruthy()
    })
  })
})

describe('ESTADO_PATRIMONIO_LABELS', () => {
  it('tem rótulo para todos os estados', () => {
    const estados = ['otimo', 'bom', 'regular', 'ruim', 'baixado'] as const
    estados.forEach(e => {
      expect(ESTADO_PATRIMONIO_LABELS[e]).toBeTruthy()
    })
  })
})

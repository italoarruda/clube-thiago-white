import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import MensalidadesPage from '@/app/mensalidades/page'

const { mockClient } = vi.hoisted(() => {
  const desbravadores = [
    { id: 'd1', nome: 'João Pedro Alves', unidade_id: 'u1', status: 'ativo' },
    { id: 'd2', nome: 'Larissa Menezes',  unidade_id: 'u1', status: 'ativo' },
  ]
  const unidades = [{ id: 'u1', nome: 'Águias' }]
  const mensalidades = [
    { id: 'm1', desbravador_id: 'd1', mes_referencia: '2026-01-01', valor: 30, status: 'pago',    data_pagamento: '2026-01-08' },
    { id: 'm2', desbravador_id: 'd1', mes_referencia: '2026-02-01', valor: 30, status: 'pendente', data_pagamento: null },
    { id: 'm3', desbravador_id: 'd2', mes_referencia: '2026-01-01', valor: 30, status: 'pago',    data_pagamento: '2026-01-05' },
  ]
  const tableData: Record<string, unknown[]> = { desbravadores, unidades, mensalidades }
  const makeChain = (data: unknown[]) => {
    const r: Record<string, unknown> = {}
    const c = () => r
    r.select = c; r.eq = c; r.neq = c; r.gte = c; r.lte = c; r.order = c; r.limit = c
    r.upsert = () => Promise.resolve({ error: null })
    r.then = (resolve: (v: unknown) => void) => Promise.resolve({ data, error: null }).then(resolve)
    return r
  }
  return { mockClient: { from: (t: string) => makeChain(tableData[t] ?? []) } }
})

vi.mock('@/lib/supabase/client', () => ({ supabase: mockClient }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/mensalidades' }))

describe('MensalidadesPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renderiza o título da página', () => {
    render(<MensalidadesPage />)
    expect(screen.getByText(/Mensalidades/i)).toBeTruthy()
  })

  it('exibe nomes dos desbravadores no grid após carregamento', async () => {
    render(<MensalidadesPage />)
    await waitFor(() => {
      expect(screen.getByText('João Pedro Alves')).toBeTruthy()
      expect(screen.getByText('Larissa Menezes')).toBeTruthy()
    })
  })

  it('exibe cabeçalhos dos meses', async () => {
    render(<MensalidadesPage />)
    await waitFor(() => {
      expect(screen.getByText('Jan')).toBeTruthy()
    })
  })

  it('exibe total arrecadado', () => {
    render(<MensalidadesPage />)
    expect(screen.getByText(/Total arrecadado/i)).toBeTruthy()
  })
})

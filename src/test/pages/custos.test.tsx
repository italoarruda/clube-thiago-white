import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CustosPage from '@/app/custos/page'

const { mockClient } = vi.hoisted(() => {
  const custos = [
    { id: 'cu1', descricao: 'Uniformes novos', valor: 480, data: '2026-01-20', categoria: 'material', fornecedor: 'Uniformes Fortaleza', nota_fiscal: null, status_pagamento: 'pago' },
    { id: 'cu2', descricao: 'Transporte acampamento', valor: 350, data: '2026-04-15', categoria: 'transporte', fornecedor: 'Van do Irmão Josias', nota_fiscal: null, status_pagamento: 'pago' },
  ]
  const tableData: Record<string, unknown[]> = { custos }
  const makeChain = (data: unknown[]) => {
    const r: Record<string, unknown> = {}
    const c = () => r
    r.select = c; r.eq = c; r.neq = c; r.gte = c; r.lte = c; r.order = c; r.limit = c
    r.insert = () => Promise.resolve({ error: null })
    r.delete = () => ({ eq: () => Promise.resolve({ error: null }) })
    r.then = (resolve: (v: unknown) => void) => Promise.resolve({ data, error: null }).then(resolve)
    return r
  }
  return { mockClient: { from: (t: string) => makeChain(tableData[t] ?? []) } }
})

vi.mock('@/lib/supabase/client', () => ({ supabase: mockClient }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/custos' }))

describe('CustosPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renderiza o título da página', () => {
    render(<CustosPage />)
    expect(screen.getByText(/Custos/i)).toBeTruthy()
  })

  it('exibe botão de novo custo', () => {
    render(<CustosPage />)
    expect(screen.getAllByText(/Novo Custo/i).length).toBeGreaterThan(0)
  })

  it('exibe despesas após carregamento', async () => {
    render(<CustosPage />)
    await waitFor(() => {
      expect(screen.getByText('Uniformes novos')).toBeTruthy()
    })
  })

  it('exibe resumo de pendente e pago', async () => {
    render(<CustosPage />)
    await waitFor(() => {
      expect(screen.getByText(/Pendente:/i)).toBeTruthy()
    })
  })
})

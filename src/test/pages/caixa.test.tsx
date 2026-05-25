import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import CaixaPage from '@/app/caixa/page'

const { mockClient } = vi.hoisted(() => {
  const caixa_transacoes = [
    { id: 't1', tipo: 'entrada', descricao: 'Mensalidades Janeiro', valor: 180, data: '2026-01-31', categoria: 'mensalidade', created_at: '2026-01-31T10:00:00Z' },
    { id: 't2', tipo: 'saida',   descricao: 'Material artesanato',  valor: 85,  data: '2026-02-15', categoria: 'material',    created_at: '2026-02-15T10:00:00Z' },
  ]
  const tableData: Record<string, unknown[]> = { caixa_transacoes }
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
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/caixa' }))

describe('CaixaPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renderiza o título da página', () => {
    render(<CaixaPage />)
    expect(screen.getByText(/Caixa/i)).toBeTruthy()
  })

  it('exibe cards de Entradas, Saídas e Saldo', () => {
    render(<CaixaPage />)
    expect(screen.getByText('Entradas')).toBeTruthy()
    expect(screen.getByText('Saídas')).toBeTruthy()
    expect(screen.getByText('Saldo')).toBeTruthy()
  })

  it('exibe botão de novo lançamento', () => {
    render(<CaixaPage />)
    expect(screen.getByText(/Novo Lançamento/i)).toBeTruthy()
  })

  it('exibe transações após carregamento', async () => {
    render(<CaixaPage />)
    await waitFor(() => {
      expect(screen.getByText('Mensalidades Janeiro')).toBeTruthy()
      expect(screen.getByText('Material artesanato')).toBeTruthy()
    })
  })
})

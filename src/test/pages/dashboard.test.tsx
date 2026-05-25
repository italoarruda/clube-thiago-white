import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import DashboardPage from '@/app/dashboard/page'

// Recharts usa ResizeObserver que não existe no jsdom
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }

const { mockClient } = vi.hoisted(() => {
  const desbravadores = [
    { id: 'd1', status: 'ativo', unidade_id: 'u1' },
    { id: 'd2', status: 'ativo', unidade_id: 'u2' },
  ]
  const mensalidades = [
    { desbravador_id: 'd1', mes_referencia: '2026-05-01', status: 'pago',    valor: 30 },
    { desbravador_id: 'd2', mes_referencia: '2026-05-01', status: 'pendente', valor: 30 },
  ]
  const caixa_transacoes = [
    { id: 't1', tipo: 'entrada', descricao: 'Mensalidades', valor: 180, data: '2026-01-31', categoria: 'mensalidade', created_at: '2026-01-31T10:00:00Z' },
    { id: 't2', tipo: 'saida',   descricao: 'Material',     valor: 85,  data: '2026-02-15', categoria: 'material',    created_at: '2026-02-15T10:00:00Z' },
  ]
  const patrimonio = [
    { valor_aquisicao: 1200, estado: 'bom' },
  ]
  const unidades = [
    { id: 'u1', nome: 'Águias' },
    { id: 'u2', nome: 'Falcões' },
  ]
  const tableData: Record<string, unknown[]> = { desbravadores, mensalidades, caixa_transacoes, patrimonio, unidades }
  const makeChain = (data: unknown[]) => {
    const r: Record<string, unknown> = {}
    const c = () => r
    r.select = c; r.eq = c; r.neq = c; r.gte = c; r.lte = c; r.order = c; r.limit = c
    r.then = (resolve: (v: unknown) => void) => Promise.resolve({ data, error: null }).then(resolve)
    return r
  }
  return { mockClient: { from: (t: string) => makeChain(tableData[t] ?? []) } }
})

vi.mock('@/lib/supabase/client', () => ({ supabase: mockClient }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/dashboard' }))

describe('DashboardPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('exibe indicador de carregamento inicialmente', () => {
    render(<DashboardPage />)
    expect(screen.getByText(/Carregando/i)).toBeTruthy()
  })

  it('renderiza título Dashboard após carregamento', async () => {
    render(<DashboardPage />)
    await waitFor(() => {
      expect(screen.getByText('Dashboard')).toBeTruthy()
    })
  })

  it('exibe cards de estatísticas', async () => {
    render(<DashboardPage />)
    await waitFor(() => {
      expect(screen.getByText('Desbravadores Ativos')).toBeTruthy()
      expect(screen.getByText('Saldo de Caixa')).toBeTruthy()
      expect(screen.getByText('Patrimônio Total')).toBeTruthy()
    })
  })

  it('exibe seção de últimas transações de caixa', async () => {
    render(<DashboardPage />)
    await waitFor(() => {
      expect(screen.getByText(/Últimas Transações/i)).toBeTruthy()
    })
  })
})

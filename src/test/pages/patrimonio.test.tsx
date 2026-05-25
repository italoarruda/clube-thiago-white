import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import PatrimonioPage from '@/app/patrimonio/page'

const { mockClient } = vi.hoisted(() => {
  const patrimonio = [
    { id: 'p1', nome: 'Projetor Epson', descricao: 'Projetor sala', numero_tombamento: 'TW-001', valor_aquisicao: 1200, data_aquisicao: '2020-03-15', estado: 'bom', localizacao: 'Sala principal', foto_url: null, obs: null },
    { id: 'p2', nome: 'Notebook Dell', descricao: 'Notebook secretaria', numero_tombamento: 'TW-002', valor_aquisicao: 2800, data_aquisicao: '2021-08-10', estado: 'otimo', localizacao: 'Secretaria', foto_url: null, obs: null },
  ]
  const tableData: Record<string, unknown[]> = { patrimonio }
  const makeChain = (data: unknown[]) => {
    const r: Record<string, unknown> = {}
    const c = () => r
    r.select = c; r.eq = c; r.neq = c; r.gte = c; r.lte = c; r.order = c; r.limit = c
    r.insert = () => Promise.resolve({ data: [{ id: 'new' }], error: null })
    r.delete = () => ({ eq: () => Promise.resolve({ error: null }) })
    r.then = (resolve: (v: unknown) => void) => Promise.resolve({ data, error: null }).then(resolve)
    return r
  }
  return { mockClient: { from: (t: string) => makeChain(tableData[t] ?? []) } }
})

vi.mock('@/lib/supabase/client', () => ({ supabase: mockClient }))
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/patrimonio' }))

describe('PatrimonioPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renderiza o título da página', () => {
    render(<PatrimonioPage />)
    expect(screen.getByText(/Patrimônio/i)).toBeTruthy()
  })

  it('exibe botão de novo bem', () => {
    render(<PatrimonioPage />)
    expect(screen.getByText(/Novo Bem/i)).toBeTruthy()
  })

  it('exibe bens após carregamento', async () => {
    render(<PatrimonioPage />)
    await waitFor(() => {
      expect(screen.getByText('Projetor Epson')).toBeTruthy()
      expect(screen.getByText('Notebook Dell')).toBeTruthy()
    })
  })
})

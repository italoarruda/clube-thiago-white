import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import AtasPage from '@/app/atas/page'

const { mockClient } = vi.hoisted(() => {
  const atas = [
    { id: 'a1', numero: 1, data: '2026-01-15', tipo: 'diretoria', local: 'Sede', pauta: 'Planejamento 2026', conteudo: 'Conteúdo da ata.', aprovada: true, data_aprovacao: '2026-02-15' },
    { id: 'a2', numero: 2, data: '2026-03-22', tipo: 'clube',     local: 'Sede', pauta: 'Relatório trimestral',  conteudo: 'Conteúdo.', aprovada: false, data_aprovacao: null },
  ]
  const tableData: Record<string, unknown[]> = { atas }
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
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/atas' }))

describe('AtasPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renderiza o título da página', () => {
    render(<AtasPage />)
    expect(screen.getAllByText(/Atas/i).length).toBeGreaterThan(0)
  })

  it('exibe botão de nova ata', () => {
    render(<AtasPage />)
    expect(screen.getByText(/Nova Ata/i)).toBeTruthy()
  })

  it('exibe atas após carregamento', async () => {
    render(<AtasPage />)
    await waitFor(() => {
      // Tabela exibe data da ata em formato pt-BR
      expect(screen.getByText('15/01/2026')).toBeTruthy()
    })
  })

  it('exibe contagem de atas registradas', async () => {
    render(<AtasPage />)
    await waitFor(() => {
      expect(screen.getByText(/atas registradas/i)).toBeTruthy()
    })
  })
})

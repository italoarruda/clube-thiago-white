import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import AtosPage from '@/app/atos/page'

const { mockClient } = vi.hoisted(() => {
  const atos = [
    { id: 'at1', numero: 1, data: '2026-01-20', tipo: 'resolucao', assunto: 'Regimento Interno 2026',          conteudo: 'Conteúdo do ato.', assinante: 'Fernanda Costa Souza' },
    { id: 'at2', numero: 2, data: '2026-03-01', tipo: 'portaria',  assunto: 'Designação de Conselheiro',       conteudo: 'Conteúdo.',        assinante: 'Fernanda Costa Souza' },
  ]
  const tableData: Record<string, unknown[]> = { atos }
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
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/atos' }))

describe('AtosPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renderiza o título da página', () => {
    render(<AtosPage />)
    expect(screen.getAllByText(/Atos/i).length).toBeGreaterThan(0)
  })

  it('exibe botão de novo ato', () => {
    render(<AtosPage />)
    expect(screen.getByText(/Novo Ato/i)).toBeTruthy()
  })

  it('exibe atos após carregamento', async () => {
    render(<AtosPage />)
    await waitFor(() => {
      expect(screen.getByText(/Regimento Interno 2026/i)).toBeTruthy()
      expect(screen.getByText(/Designação de Conselheiro/i)).toBeTruthy()
    })
  })
})

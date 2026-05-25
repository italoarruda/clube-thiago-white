import { render, screen, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import DesbravadoresPage from '@/app/cadastros/desbravadores/page'

const { mockClient } = vi.hoisted(() => {
  const desbravadores = [
    {
      id: '00000003-0000-0000-0000-000000000001',
      nome: 'João Pedro Alves', cpf: '111.222.333-01',
      data_nascimento: '2013-03-15', sexo: 'masculino', data_ingresso: '2022-01-10',
      unidade_id: '00000001-0000-0000-0000-000000000001', classe_id: 'c3',
      cargo: 'desbravador', status: 'ativo',
      responsavel_nome: 'Maria Alves', responsavel_contato: '(85) 99771-2001',
      unidade: { id: '00000001-0000-0000-0000-000000000001', nome: 'Águias' },
      classe: { id: 'c3', nome: 'Pesquisador', nivel: 3 },
    },
    {
      id: '00000003-0000-0000-0000-000000000002',
      nome: 'Larissa Menezes', cpf: '111.222.333-02',
      data_nascimento: '2012-07-22', sexo: 'feminino', data_ingresso: '2021-03-05',
      unidade_id: '00000001-0000-0000-0000-000000000001', classe_id: 'c2',
      cargo: 'desbravador', status: 'ativo',
      responsavel_nome: 'Roberto Menezes', responsavel_contato: '(85) 99771-2002',
      unidade: { id: '00000001-0000-0000-0000-000000000001', nome: 'Águias' },
      classe: { id: 'c2', nome: 'Companheiro', nivel: 2 },
    },
  ]
  const unidades = [
    { id: '00000001-0000-0000-0000-000000000001', nome: 'Águias', lider_nome: 'Ana', lider_contato: '', ativo: true },
  ]
  const tableData: Record<string, unknown[]> = { desbravadores, unidades }
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
vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }), usePathname: () => '/cadastros/desbravadores' }))

describe('DesbravadoresPage', () => {
  beforeEach(() => { vi.clearAllMocks() })

  it('renderiza o título da página', () => {
    render(<DesbravadoresPage />)
    expect(screen.getByText(/Desbravadores/i)).toBeTruthy()
  })

  it('exibe botão de novo desbravador', () => {
    render(<DesbravadoresPage />)
    expect(screen.getByText(/Novo Desbravador/i)).toBeTruthy()
  })

  it('exibe nomes dos desbravadores após carregamento', async () => {
    render(<DesbravadoresPage />)
    await waitFor(() => {
      expect(screen.getByText('João Pedro Alves')).toBeTruthy()
      expect(screen.getByText('Larissa Menezes')).toBeTruthy()
    })
  })

  it('exibe campo de busca por nome', () => {
    render(<DesbravadoresPage />)
    expect(screen.getByPlaceholderText(/Buscar por nome/i)).toBeTruthy()
  })
})

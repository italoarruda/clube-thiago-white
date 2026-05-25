// Shared Supabase mock factory for page tests.
// Returns a chainable builder that resolves with { data, error: null }.

export function makeSupabaseMock(tableData: Record<string, unknown[]>) {
  const builder = (data: unknown[]) => {
    const obj: Record<string, unknown> = {}
    const chain = () => obj
    obj.select = chain
    obj.eq = chain
    obj.neq = chain
    obj.gte = chain
    obj.lte = chain
    obj.order = chain
    obj.limit = chain
    obj.upsert = () => Promise.resolve({ error: null })
    obj.insert = () => Promise.resolve({ error: null })
    obj.delete = () => ({ eq: () => Promise.resolve({ error: null }) })
    // Make the object thenable so `await supabase.from(...).select(...)...` works
    obj.then = (resolve: (v: { data: unknown[]; error: null }) => void) =>
      Promise.resolve({ data, error: null }).then(resolve)
    return obj
  }

  return {
    from: (table: string) => builder(tableData[table] ?? []),
  }
}

// ─── Default seed data mirrors supabase/seed.sql ─────────────────────────────

export const MOCK_UNIDADES = [
  { id: '00000001-0000-0000-0000-000000000001', nome: 'Águias',  lider_nome: 'Ana Paula Ferreira', lider_contato: '(85) 99881-1001', ativo: true },
  { id: '00000001-0000-0000-0000-000000000002', nome: 'Falcões', lider_nome: 'Carlos Eduardo Lima', lider_contato: '(85) 99881-1002', ativo: true },
]

export const MOCK_CLASSES = [
  { id: 'c1', nome: 'Amigo',       nivel: 1, descricao: '' },
  { id: 'c2', nome: 'Companheiro', nivel: 2, descricao: '' },
  { id: 'c3', nome: 'Pesquisador', nivel: 3, descricao: '' },
]

export const MOCK_ESPECIALIDADES = [
  { id: '00000002-0000-0000-0000-000000000001', nome: 'Fotografia',         area: 'Artes', nivel: 1, descricao: '', ativo: true },
  { id: '00000002-0000-0000-0000-000000000002', nome: 'Primeiros Socorros', area: 'Saúde', nivel: 2, descricao: '', ativo: true },
]

export const MOCK_DESBRAVADORES = [
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

export const MOCK_MENSALIDADES = [
  { id: 'm1', desbravador_id: '00000003-0000-0000-0000-000000000001', mes_referencia: '2026-01-01', valor: 30, status: 'pago',    data_pagamento: '2026-01-08' },
  { id: 'm2', desbravador_id: '00000003-0000-0000-0000-000000000001', mes_referencia: '2026-02-01', valor: 30, status: 'pendente', data_pagamento: null },
  { id: 'm3', desbravador_id: '00000003-0000-0000-0000-000000000002', mes_referencia: '2026-01-01', valor: 30, status: 'pago',    data_pagamento: '2026-01-05' },
]

export const MOCK_TRANSACOES = [
  { id: 't1', tipo: 'entrada', descricao: 'Mensalidades Janeiro', valor: 180, data: '2026-01-31', categoria: 'mensalidade', created_at: '2026-01-31T10:00:00Z' },
  { id: 't2', tipo: 'saida',   descricao: 'Material artesanato',  valor: 85,  data: '2026-02-15', categoria: 'material',    created_at: '2026-02-15T10:00:00Z' },
]

export const MOCK_CUSTOS = [
  { id: 'cu1', descricao: 'Uniformes novos', valor: 480, data: '2026-01-20', categoria: 'material', fornecedor: 'Uniformes Fortaleza', nota_fiscal: null, status_pagamento: 'pago' },
]

export const MOCK_PATRIMONIO = [
  { id: 'p1', nome: 'Projetor Epson', descricao: 'Projetor sala', numero_tombamento: 'TW-001', valor_aquisicao: 1200, data_aquisicao: '2020-03-15', estado: 'bom', localizacao: 'Sala principal', foto_url: null, obs: null },
]

export const MOCK_ATAS = [
  { id: 'a1', numero: 1, data: '2026-01-15', tipo: 'diretoria', local: 'Sede', pauta: 'Planejamento 2026', conteudo: 'Conteúdo da ata.', aprovada: true, data_aprovacao: '2026-02-15' },
]

export const MOCK_ATOS = [
  { id: 'at1', numero: 1, data: '2026-01-20', tipo: 'resolucao', assunto: 'Regimento Interno 2026', conteudo: 'Conteúdo do ato.', assinante: 'Fernanda Costa Souza' },
]

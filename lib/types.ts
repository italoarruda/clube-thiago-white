// ============================================================
// Tipos base do sistema
// ============================================================

export type CargoDesbravador = 'desbravador' | 'conselheiro' | 'instrutor' | 'aspirante' | 'diretor'
export type StatusDesbravador = 'ativo' | 'inativo' | 'transferido' | 'desligado'
export type SexoDesbravador = 'masculino' | 'feminino'
export type StatusMensalidade = 'pendente' | 'pago' | 'atrasado' | 'isento'
export type TipoTransacao = 'entrada' | 'saida'
export type StatusCusto = 'pendente' | 'pago'
export type EstadoPatrimonio = 'otimo' | 'bom' | 'regular' | 'ruim' | 'baixado'
export type TipoAta = 'diretoria' | 'clube' | 'pais' | 'extraordinaria'
export type TipoAto = 'resolucao' | 'portaria' | 'circular' | 'oficio'
export type StatusEspecialidade = 'em_andamento' | 'concluida'
export type CategoriacCaixa = 'mensalidade' | 'evento' | 'doacao' | 'material' | 'outro'
export type CategoriaCusto = 'material' | 'evento' | 'manutencao' | 'alimentacao' | 'transporte' | 'outro'

export interface Unidade {
  id: string
  nome: string
  lider_nome: string | null
  lider_contato: string | null
  ativo: boolean
  created_at: string
}

export interface Classe {
  id: string
  nome: string
  nivel: number
  descricao: string | null
  created_at: string
}

export interface Especialidade {
  id: string
  nome: string
  area: string
  nivel: number
  descricao: string | null
  ativo: boolean
  created_at: string
}

export interface Desbravador {
  id: string
  nome: string
  cpf: string | null
  rg: string | null
  data_nascimento: string | null
  sexo: SexoDesbravador | null
  data_ingresso: string
  unidade_id: string | null
  classe_id: string | null
  cargo: CargoDesbravador
  status: StatusDesbravador
  responsavel_nome: string | null
  responsavel_cpf: string | null
  responsavel_contato: string | null
  endereco: string | null
  foto_url: string | null
  observacoes: string | null
  created_at: string
  unidade?: Unidade | null
  classe?: Classe | null
}

export interface DesbravadorEspecialidade {
  id: string
  desbravador_id: string
  especialidade_id: string
  status: StatusEspecialidade
  data_conclusao: string | null
  created_at: string
  especialidade?: Especialidade
}

export interface Mensalidade {
  id: string
  desbravador_id: string
  mes_referencia: string
  valor: number
  data_pagamento: string | null
  status: StatusMensalidade
  observacao: string | null
  created_at: string
  desbravador?: Pick<Desbravador, 'id' | 'nome' | 'unidade_id'>
}

export interface CaixaTransacao {
  id: string
  tipo: TipoTransacao
  descricao: string
  valor: number
  data: string
  categoria: CategoriacCaixa
  referencia: string | null
  created_at: string
}

export interface Custo {
  id: string
  descricao: string
  valor: number
  data: string
  categoria: CategoriaCusto
  fornecedor: string | null
  nota_fiscal: string | null
  status_pagamento: StatusCusto
  created_at: string
}

export interface Patrimonio {
  id: string
  nome: string
  descricao: string | null
  numero_tombamento: string | null
  valor_aquisicao: number | null
  data_aquisicao: string | null
  estado: EstadoPatrimonio
  localizacao: string | null
  foto_url: string | null
  observacoes: string | null
  created_at: string
}

export interface Ata {
  id: string
  numero: number
  data: string
  tipo: TipoAta
  local: string | null
  pauta: string | null
  conteudo: string | null
  aprovada: boolean
  data_aprovacao: string | null
  created_at: string
}

export interface Ato {
  id: string
  numero: number
  data: string
  tipo: TipoAto
  assunto: string
  conteudo: string | null
  assinante: string | null
  created_at: string
}

// Labels de exibição
export const CARGO_LABELS: Record<CargoDesbravador, string> = {
  desbravador: 'Desbravador',
  conselheiro: 'Conselheiro',
  instrutor: 'Instrutor',
  aspirante: 'Aspirante',
  diretor: 'Diretor',
}

export const STATUS_LABELS: Record<StatusDesbravador, string> = {
  ativo: 'Ativo',
  inativo: 'Inativo',
  transferido: 'Transferido',
  desligado: 'Desligado',
}

export const STATUS_MENSALIDADE_LABELS: Record<StatusMensalidade, string> = {
  pendente: 'Pendente',
  pago: 'Pago',
  atrasado: 'Atrasado',
  isento: 'Isento',
}

export const ESTADO_PATRIMONIO_LABELS: Record<EstadoPatrimonio, string> = {
  otimo: 'Ótimo',
  bom: 'Bom',
  regular: 'Regular',
  ruim: 'Ruim',
  baixado: 'Baixado',
}

export const TIPO_ATA_LABELS: Record<TipoAta, string> = {
  diretoria: 'Reunião de Diretoria',
  clube: 'Reunião de Clube',
  pais: 'Reunião de Pais',
  extraordinaria: 'Reunião Extraordinária',
}

export const TIPO_ATO_LABELS: Record<TipoAto, string> = {
  resolucao: 'Resolução',
  portaria: 'Portaria',
  circular: 'Circular',
  oficio: 'Ofício',
}

export const CATEGORIA_CAIXA_LABELS: Record<CategoriacCaixa, string> = {
  mensalidade: 'Mensalidade',
  evento: 'Evento',
  doacao: 'Doação',
  material: 'Material',
  outro: 'Outro',
}

export const CATEGORIA_CUSTO_LABELS: Record<CategoriaCusto, string> = {
  material: 'Material',
  evento: 'Evento',
  manutencao: 'Manutenção',
  alimentacao: 'Alimentação',
  transporte: 'Transporte',
  outro: 'Outro',
}

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

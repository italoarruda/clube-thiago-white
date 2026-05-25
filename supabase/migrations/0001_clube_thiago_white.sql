-- ============================================================
-- Sistema de Gerenciamento — Clube de Desbravadores Thiago White
-- ============================================================

-- Enums
CREATE TYPE cargo_desbravador AS ENUM ('desbravador', 'conselheiro', 'instrutor', 'aspirante', 'diretor');
CREATE TYPE status_desbravador AS ENUM ('ativo', 'inativo', 'transferido', 'desligado');
CREATE TYPE sexo_desbravador AS ENUM ('masculino', 'feminino');
CREATE TYPE status_mensalidade AS ENUM ('pendente', 'pago', 'atrasado', 'isento');
CREATE TYPE tipo_transacao AS ENUM ('entrada', 'saida');
CREATE TYPE status_custo AS ENUM ('pendente', 'pago');
CREATE TYPE estado_patrimonio AS ENUM ('otimo', 'bom', 'regular', 'ruim', 'baixado');
CREATE TYPE tipo_ata AS ENUM ('diretoria', 'clube', 'pais', 'extraordinaria');
CREATE TYPE tipo_ato AS ENUM ('resolucao', 'portaria', 'circular', 'oficio');
CREATE TYPE status_especialidade AS ENUM ('em_andamento', 'concluida');
CREATE TYPE categoria_caixa AS ENUM ('mensalidade', 'evento', 'doacao', 'material', 'outro');
CREATE TYPE categoria_custo AS ENUM ('material', 'evento', 'manutencao', 'alimentacao', 'transporte', 'outro');

-- ============================================================
-- Unidades
-- ============================================================
CREATE TABLE public.unidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  lider_nome TEXT,
  lider_contato TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.unidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage unidades" ON public.unidades FOR ALL TO authenticated USING (true);

-- ============================================================
-- Classes
-- ============================================================
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  nivel INTEGER NOT NULL CHECK (nivel BETWEEN 1 AND 6),
  descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage classes" ON public.classes FOR ALL TO authenticated USING (true);

INSERT INTO public.classes (nome, nivel, descricao) VALUES
  ('Amigo', 1, 'Primeira classe — 10 anos'),
  ('Companheiro', 2, 'Segunda classe — 11 anos'),
  ('Pesquisador', 3, 'Terceira classe — 12 anos'),
  ('Pioneiro', 4, 'Quarta classe — 13 anos'),
  ('Excursionista', 5, 'Quinta classe — 14 anos'),
  ('Guia', 6, 'Sexta classe — 15 anos');

-- ============================================================
-- Especialidades
-- ============================================================
CREATE TABLE public.especialidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  area TEXT NOT NULL,
  nivel INTEGER NOT NULL DEFAULT 1 CHECK (nivel BETWEEN 1 AND 3),
  descricao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.especialidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage especialidades" ON public.especialidades FOR ALL TO authenticated USING (true);

-- ============================================================
-- Desbravadores
-- ============================================================
CREATE TABLE public.desbravadores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cpf TEXT,
  rg TEXT,
  data_nascimento DATE,
  sexo sexo_desbravador,
  data_ingresso DATE NOT NULL DEFAULT CURRENT_DATE,
  unidade_id UUID REFERENCES public.unidades(id) ON DELETE SET NULL,
  classe_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  cargo cargo_desbravador NOT NULL DEFAULT 'desbravador',
  status status_desbravador NOT NULL DEFAULT 'ativo',
  responsavel_nome TEXT,
  responsavel_cpf TEXT,
  responsavel_contato TEXT,
  endereco TEXT,
  foto_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.desbravadores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage desbravadores" ON public.desbravadores FOR ALL TO authenticated USING (true);

-- ============================================================
-- Desbravador × Especialidades
-- ============================================================
CREATE TABLE public.desbravador_especialidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desbravador_id UUID NOT NULL REFERENCES public.desbravadores(id) ON DELETE CASCADE,
  especialidade_id UUID NOT NULL REFERENCES public.especialidades(id) ON DELETE CASCADE,
  status status_especialidade NOT NULL DEFAULT 'em_andamento',
  data_conclusao DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (desbravador_id, especialidade_id)
);

ALTER TABLE public.desbravador_especialidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage desbravador_especialidades" ON public.desbravador_especialidades FOR ALL TO authenticated USING (true);

-- ============================================================
-- Mensalidades
-- ============================================================
CREATE TABLE public.mensalidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  desbravador_id UUID NOT NULL REFERENCES public.desbravadores(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  valor NUMERIC(10,2) NOT NULL DEFAULT 0,
  data_pagamento DATE,
  status status_mensalidade NOT NULL DEFAULT 'pendente',
  observacao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (desbravador_id, mes_referencia)
);

ALTER TABLE public.mensalidades ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage mensalidades" ON public.mensalidades FOR ALL TO authenticated USING (true);

-- ============================================================
-- Caixa
-- ============================================================
CREATE TABLE public.caixa_transacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo tipo_transacao NOT NULL,
  descricao TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria categoria_caixa NOT NULL DEFAULT 'outro',
  referencia TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.caixa_transacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage caixa_transacoes" ON public.caixa_transacoes FOR ALL TO authenticated USING (true);

-- ============================================================
-- Custos
-- ============================================================
CREATE TABLE public.custos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT NOT NULL,
  valor NUMERIC(10,2) NOT NULL,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  categoria categoria_custo NOT NULL DEFAULT 'outro',
  fornecedor TEXT,
  nota_fiscal TEXT,
  status_pagamento status_custo NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.custos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage custos" ON public.custos FOR ALL TO authenticated USING (true);

-- ============================================================
-- Patrimônio
-- ============================================================
CREATE TABLE public.patrimonio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  numero_tombamento TEXT UNIQUE,
  valor_aquisicao NUMERIC(10,2),
  data_aquisicao DATE,
  estado estado_patrimonio NOT NULL DEFAULT 'bom',
  localizacao TEXT,
  foto_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.patrimonio ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage patrimonio" ON public.patrimonio FOR ALL TO authenticated USING (true);

-- ============================================================
-- Atas
-- ============================================================
CREATE TABLE public.atas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero INTEGER NOT NULL,
  data DATE NOT NULL,
  tipo tipo_ata NOT NULL DEFAULT 'clube',
  local TEXT,
  pauta TEXT,
  conteudo TEXT,
  aprovada BOOLEAN NOT NULL DEFAULT false,
  data_aprovacao DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.atas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage atas" ON public.atas FOR ALL TO authenticated USING (true);

-- ============================================================
-- Atos
-- ============================================================
CREATE TABLE public.atos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero INTEGER NOT NULL,
  data DATE NOT NULL,
  tipo tipo_ato NOT NULL DEFAULT 'resolucao',
  assunto TEXT NOT NULL,
  conteudo TEXT,
  assinante TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.atos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can manage atos" ON public.atos FOR ALL TO authenticated USING (true);

-- Indexes
CREATE INDEX idx_desbravadores_unidade ON public.desbravadores(unidade_id);
CREATE INDEX idx_desbravadores_classe ON public.desbravadores(classe_id);
CREATE INDEX idx_desbravadores_status ON public.desbravadores(status);
CREATE INDEX idx_mensalidades_desbravador ON public.mensalidades(desbravador_id);
CREATE INDEX idx_mensalidades_mes ON public.mensalidades(mes_referencia);
CREATE INDEX idx_mensalidades_status ON public.mensalidades(status);
CREATE INDEX idx_caixa_data ON public.caixa_transacoes(data);
CREATE INDEX idx_caixa_tipo ON public.caixa_transacoes(tipo);
CREATE INDEX idx_custos_data ON public.custos(data);
CREATE INDEX idx_patrimonio_estado ON public.patrimonio(estado);
CREATE INDEX idx_atas_data ON public.atas(data);
CREATE INDEX idx_atos_data ON public.atos(data);

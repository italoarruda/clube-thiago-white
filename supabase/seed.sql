-- Seed data para desenvolvimento local
-- Clube de Desbravadores Thiago White

-- ─── Unidades ────────────────────────────────────────────────────────────────
INSERT INTO unidades (id, nome, lider_nome, lider_contato, ativo) VALUES
  ('00000001-0000-0000-0000-000000000001', 'Águias',   'Ana Paula Ferreira',    '(85) 99881-1001', true),
  ('00000001-0000-0000-0000-000000000002', 'Falcões',  'Carlos Eduardo Lima',   '(85) 99881-1002', true),
  ('00000001-0000-0000-0000-000000000003', 'Leões',    'Fernanda Costa Souza',  '(85) 99881-1003', true);

-- ─── Especialidades ──────────────────────────────────────────────────────────
INSERT INTO especialidades (id, nome, area, nivel, descricao, ativo) VALUES
  ('00000002-0000-0000-0000-000000000001', 'Fotografia',        'Artes e Artesanato', 1, 'Fundamentos de fotografia digital e composição', true),
  ('00000002-0000-0000-0000-000000000002', 'Primeiros Socorros','Saúde e Ciência',    2, 'Técnicas básicas de primeiros socorros',           true),
  ('00000002-0000-0000-0000-000000000003', 'Jardinagem',        'Natureza',           1, 'Cultivo de plantas e hortas',                      true),
  ('00000002-0000-0000-0000-000000000004', 'Culinária',         'Artes e Artesanato', 1, 'Receitas e técnicas culinárias básicas',            true),
  ('00000002-0000-0000-0000-000000000005', 'Astronomia',        'Saúde e Ciência',    3, 'Constelações, planetas e observação noturna',      true);

-- ─── Desbravadores ───────────────────────────────────────────────────────────
INSERT INTO desbravadores (
  id, nome, cpf, data_nascimento, sexo, data_ingresso,
  unidade_id, classe_id, cargo, status,
  responsavel_nome, responsavel_contato
) VALUES
  (
    '00000003-0000-0000-0000-000000000001',
    'João Pedro Alves', '111.222.333-01',
    '2013-03-15', 'masculino', '2022-01-10',
    '00000001-0000-0000-0000-000000000001',
    (SELECT id FROM classes WHERE nivel = 3 LIMIT 1),
    'desbravador', 'ativo', 'Maria Alves', '(85) 99771-2001'
  ),
  (
    '00000003-0000-0000-0000-000000000002',
    'Larissa Menezes', '111.222.333-02',
    '2012-07-22', 'feminino', '2021-03-05',
    '00000001-0000-0000-0000-000000000001',
    (SELECT id FROM classes WHERE nivel = 4 LIMIT 1),
    'desbravador', 'ativo', 'Roberto Menezes', '(85) 99771-2002'
  ),
  (
    '00000003-0000-0000-0000-000000000003',
    'Pedro Henrique Rocha', '111.222.333-03',
    '2011-11-08', 'masculino', '2020-01-15',
    '00000001-0000-0000-0000-000000000002',
    (SELECT id FROM classes WHERE nivel = 5 LIMIT 1),
    'conselheiro', 'ativo', 'Silvia Rocha', '(85) 99771-2003'
  ),
  (
    '00000003-0000-0000-0000-000000000004',
    'Beatriz Santos', '111.222.333-04',
    '2013-05-30', 'feminino', '2022-03-20',
    '00000001-0000-0000-0000-000000000002',
    (SELECT id FROM classes WHERE nivel = 2 LIMIT 1),
    'desbravador', 'ativo', 'Paulo Santos', '(85) 99771-2004'
  ),
  (
    '00000003-0000-0000-0000-000000000005',
    'Lucas Carvalho', '111.222.333-05',
    '2012-09-18', 'masculino', '2021-01-08',
    '00000001-0000-0000-0000-000000000003',
    (SELECT id FROM classes WHERE nivel = 4 LIMIT 1),
    'desbravador', 'ativo', 'Helena Carvalho', '(85) 99771-2005'
  ),
  (
    '00000003-0000-0000-0000-000000000006',
    'Isabela Gomes', '111.222.333-06',
    '2014-01-25', 'feminino', '2023-01-12',
    '00000001-0000-0000-0000-000000000003',
    (SELECT id FROM classes WHERE nivel = 1 LIMIT 1),
    'desbravador', 'ativo', 'José Gomes', '(85) 99771-2006'
  ),
  (
    '00000003-0000-0000-0000-000000000007',
    'Thiago Oliveira', '111.222.333-07',
    '2011-06-14', 'masculino', '2019-03-01',
    '00000001-0000-0000-0000-000000000001',
    (SELECT id FROM classes WHERE nivel = 6 LIMIT 1),
    'instrutor', 'ativo', 'Marcos Oliveira', '(85) 99771-2007'
  ),
  (
    '00000003-0000-0000-0000-000000000008',
    'Camila Pereira', '111.222.333-08',
    '2013-12-03', 'feminino', '2022-06-10',
    '00000001-0000-0000-0000-000000000002',
    (SELECT id FROM classes WHERE nivel = 2 LIMIT 1),
    'desbravador', 'inativo', 'Sandra Pereira', '(85) 99771-2008'
  );

-- ─── Desbravador × Especialidades ────────────────────────────────────────────
INSERT INTO desbravador_especialidades (desbravador_id, especialidade_id, status, data_conclusao) VALUES
  ('00000003-0000-0000-0000-000000000001', '00000002-0000-0000-0000-000000000001', 'concluida',   '2024-06-15'),
  ('00000003-0000-0000-0000-000000000001', '00000002-0000-0000-0000-000000000002', 'em_andamento', NULL),
  ('00000003-0000-0000-0000-000000000002', '00000002-0000-0000-0000-000000000004', 'concluida',   '2024-08-20'),
  ('00000003-0000-0000-0000-000000000003', '00000002-0000-0000-0000-000000000005', 'concluida',   '2024-11-10'),
  ('00000003-0000-0000-0000-000000000005', '00000002-0000-0000-0000-000000000003', 'em_andamento', NULL),
  ('00000003-0000-0000-0000-000000000007', '00000002-0000-0000-0000-000000000002', 'concluida',   '2023-05-01');

-- ─── Mensalidades (jan–jun 2026) ─────────────────────────────────────────────
INSERT INTO mensalidades (desbravador_id, mes_referencia, valor, status, data_pagamento) VALUES
  ('00000003-0000-0000-0000-000000000001', '2026-01-01', 30, 'pago',     '2026-01-08'),
  ('00000003-0000-0000-0000-000000000001', '2026-02-01', 30, 'pago',     '2026-02-10'),
  ('00000003-0000-0000-0000-000000000001', '2026-03-01', 30, 'pago',     '2026-03-07'),
  ('00000003-0000-0000-0000-000000000001', '2026-04-01', 30, 'pago',     '2026-04-12'),
  ('00000003-0000-0000-0000-000000000001', '2026-05-01', 30, 'pago',     '2026-05-06'),
  ('00000003-0000-0000-0000-000000000001', '2026-06-01', 30, 'pendente',  NULL),

  ('00000003-0000-0000-0000-000000000002', '2026-01-01', 30, 'pago',     '2026-01-05'),
  ('00000003-0000-0000-0000-000000000002', '2026-02-01', 30, 'atrasado',  NULL),
  ('00000003-0000-0000-0000-000000000002', '2026-03-01', 30, 'pago',     '2026-03-20'),
  ('00000003-0000-0000-0000-000000000002', '2026-04-01', 30, 'pago',     '2026-04-03'),
  ('00000003-0000-0000-0000-000000000002', '2026-05-01', 30, 'pago',     '2026-05-09'),
  ('00000003-0000-0000-0000-000000000002', '2026-06-01', 30, 'pendente',  NULL),

  ('00000003-0000-0000-0000-000000000003', '2026-01-01', 30, 'isento',   NULL),
  ('00000003-0000-0000-0000-000000000003', '2026-02-01', 30, 'isento',   NULL),
  ('00000003-0000-0000-0000-000000000003', '2026-03-01', 30, 'isento',   NULL),
  ('00000003-0000-0000-0000-000000000003', '2026-04-01', 30, 'isento',   NULL),
  ('00000003-0000-0000-0000-000000000003', '2026-05-01', 30, 'isento',   NULL),
  ('00000003-0000-0000-0000-000000000003', '2026-06-01', 30, 'isento',   NULL),

  ('00000003-0000-0000-0000-000000000004', '2026-01-01', 30, 'pago',     '2026-01-15'),
  ('00000003-0000-0000-0000-000000000004', '2026-02-01', 30, 'pago',     '2026-02-14'),
  ('00000003-0000-0000-0000-000000000004', '2026-03-01', 30, 'atrasado',  NULL),
  ('00000003-0000-0000-0000-000000000004', '2026-04-01', 30, 'pago',     '2026-04-08'),
  ('00000003-0000-0000-0000-000000000004', '2026-05-01', 30, 'pendente',  NULL),
  ('00000003-0000-0000-0000-000000000004', '2026-06-01', 30, 'pendente',  NULL),

  ('00000003-0000-0000-0000-000000000005', '2026-01-01', 30, 'pago',     '2026-01-11'),
  ('00000003-0000-0000-0000-000000000005', '2026-02-01', 30, 'pago',     '2026-02-07'),
  ('00000003-0000-0000-0000-000000000005', '2026-03-01', 30, 'pago',     '2026-03-13'),
  ('00000003-0000-0000-0000-000000000005', '2026-04-01', 30, 'pago',     '2026-04-10'),
  ('00000003-0000-0000-0000-000000000005', '2026-05-01', 30, 'pago',     '2026-05-05'),
  ('00000003-0000-0000-0000-000000000005', '2026-06-01', 30, 'pago',     '2026-06-02'),

  ('00000003-0000-0000-0000-000000000006', '2026-01-01', 30, 'pago',     '2026-01-20'),
  ('00000003-0000-0000-0000-000000000006', '2026-02-01', 30, 'pendente',  NULL),
  ('00000003-0000-0000-0000-000000000006', '2026-03-01', 30, 'pendente',  NULL),
  ('00000003-0000-0000-0000-000000000006', '2026-04-01', 30, 'pago',     '2026-04-18'),
  ('00000003-0000-0000-0000-000000000006', '2026-05-01', 30, 'pendente',  NULL),
  ('00000003-0000-0000-0000-000000000006', '2026-06-01', 30, 'pendente',  NULL),

  ('00000003-0000-0000-0000-000000000007', '2026-01-01', 30, 'pago',     '2026-01-03'),
  ('00000003-0000-0000-0000-000000000007', '2026-02-01', 30, 'pago',     '2026-02-03'),
  ('00000003-0000-0000-0000-000000000007', '2026-03-01', 30, 'pago',     '2026-03-04'),
  ('00000003-0000-0000-0000-000000000007', '2026-04-01', 30, 'pago',     '2026-04-01'),
  ('00000003-0000-0000-0000-000000000007', '2026-05-01', 30, 'pago',     '2026-05-02'),
  ('00000003-0000-0000-0000-000000000007', '2026-06-01', 30, 'pago',     '2026-06-03'),

  ('00000003-0000-0000-0000-000000000008', '2026-01-01', 30, 'pago',     '2026-01-18'),
  ('00000003-0000-0000-0000-000000000008', '2026-02-01', 30, 'atrasado',  NULL);

-- ─── Caixa ────────────────────────────────────────────────────────────────────
-- Enum categoria_caixa: mensalidade, evento, doacao, material, outro
INSERT INTO caixa_transacoes (tipo, descricao, valor, data, categoria) VALUES
  ('entrada', 'Mensalidades Janeiro 2026',        180.00, '2026-01-31', 'mensalidade'),
  ('entrada', 'Mensalidades Fevereiro 2026',       150.00, '2026-02-28', 'mensalidade'),
  ('saida',   'Compra de material de artesanato',   85.50, '2026-02-15', 'material'),
  ('entrada', 'Doação — Igreja Central',           200.00, '2026-03-10', 'doacao'),
  ('saida',   'Aluguel espaço evento de Páscoa',   120.00, '2026-03-25', 'evento'),
  ('entrada', 'Mensalidades Março 2026',           160.00, '2026-03-31', 'mensalidade'),
  ('saida',   'Lanche acampamento abril',           95.00, '2026-04-20', 'outro'),
  ('entrada', 'Venda de artesanato feira',          75.00, '2026-04-22', 'evento'),
  ('saida',   'Manutenção sala de reuniões',        60.00, '2026-05-05', 'outro'),
  ('entrada', 'Mensalidades Abril 2026',           155.00, '2026-04-30', 'mensalidade');

-- ─── Custos ──────────────────────────────────────────────────────────────────
-- Enum categoria_custo: material, evento, manutencao, alimentacao, transporte, outro
INSERT INTO custos (descricao, valor, data, categoria, fornecedor, status_pagamento) VALUES
  ('Uniformes novos — 8 unidades',          480.00, '2026-01-20', 'material',     'Uniformes Fortaleza',  'pago'),
  ('Transporte acampamento anual',           350.00, '2026-04-15', 'transporte',   'Van do Irmão Josias',  'pago'),
  ('Ingredientes culinária mês de maio',      68.00, '2026-05-12', 'alimentacao',  'Mercadão do Bairro',   'pendente'),
  ('Impressão certificados especialidades',   45.00, '2026-06-01', 'material',     'Gráfica Rápida',       'pendente');

-- ─── Patrimônio ──────────────────────────────────────────────────────────────
INSERT INTO patrimonio (nome, descricao, numero_tombamento, valor_aquisicao, data_aquisicao, estado, localizacao) VALUES
  ('Projetor Epson XGA',   'Projetor para apresentações e cultos',    'TW-001', 1200.00, '2020-03-15', 'bom',    'Sala principal'),
  ('Notebook Dell Inspiron','Notebook para secretaria do clube',       'TW-002', 2800.00, '2021-08-10', 'otimo',  'Secretaria'),
  ('Mesa de Ping-Pong',    'Mesa para atividades recreativas',         'TW-003',  650.00, '2019-01-20', 'regular','Salão recreativo'),
  ('Kit Primeiros Socorros','Maleta completa de primeiros socorros',   'TW-004',  180.00, '2023-05-05', 'otimo',  'Armário secretaria');

-- ─── Atas ─────────────────────────────────────────────────────────────────────
INSERT INTO atas (numero, data, tipo, local, pauta, conteudo, aprovada, data_aprovacao) VALUES
  (
    1, '2026-01-15', 'diretoria', 'Sede do Clube',
    'Planejamento anual 2026; Eleição de novos conselheiros; Calendário de eventos',
    'Reunidos os membros da diretoria, iniciou-se com oração às 19h30. Foram aprovadas as atividades para o ano de 2026, incluindo o acampamento de abril e a feira de especialidades em novembro. O irmão Carlos foi eleito novo conselheiro da unidade Falcões por unanimidade.',
    true, '2026-02-15'
  ),
  (
    2, '2026-03-22', 'clube', 'Sede do Clube',
    'Relatório de mensalidades; Organização do acampamento; Inscrição de especialidades',
    'Reunião geral do clube com presença de 32 desbravadores. A diretora apresentou o relatório financeiro do primeiro trimestre. Foram sorteadas as barracas para o acampamento de abril.',
    false, NULL
  ),
  (
    3, '2026-05-10', 'pais', 'Salão da Igreja',
    'Apresentação dos desbravadores; Prestação de contas; Informes sobre campori',
    'Reunião com pais e responsáveis. A diretora Fernanda apresentou o desempenho do clube no primeiro semestre. Foram informados os detalhes do campori regional previsto para outubro.',
    true, '2026-05-24'
  );

-- ─── Atos ─────────────────────────────────────────────────────────────────────
INSERT INTO atos (numero, data, tipo, assunto, conteudo, assinante) VALUES
  (
    1, '2026-01-20', 'resolucao',
    'Aprovação do Regimento Interno 2026',
    'O Clube de Desbravadores Thiago White, em reunião de diretoria realizada em 15 de janeiro de 2026, RESOLVE aprovar o Regimento Interno para o ano de 2026, conforme documento em anexo, a vigorar a partir desta data.',
    'Fernanda Costa Souza — Diretora do Clube'
  ),
  (
    2, '2026-03-01', 'portaria',
    'Designação de Conselheiro — Unidade Falcões',
    'PORTARIA Nº 01/2026. A Diretora do Clube designa o irmão Carlos Eduardo Lima para exercer a função de Conselheiro da Unidade Falcões, a partir de 01 de março de 2026.',
    'Fernanda Costa Souza — Diretora do Clube'
  );

import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  PageBreak,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
} from 'docx'
import { writeFileSync } from 'fs'

const TITULO = 'Sistema de Gerenciamento — Clube de Desbravadores Thiago White'
const VERSAO = '1.0.0'
const DATA = new Date().toLocaleDateString('pt-BR')

function h1(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 200 },
  })
}

function h2(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 160 },
  })
}

function h3(text: string): Paragraph {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 240, after: 120 },
  })
}

function p(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 24 })],
    spacing: { after: 120 },
  })
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 24 })],
    bullet: { level: 0 },
    spacing: { after: 80 },
  })
}

function bold(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24 })],
    spacing: { after: 120 },
  })
}

function tableRow(cells: string[], isHeader = false): TableRow {
  return new TableRow({
    children: cells.map(c =>
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: c, bold: isHeader, size: 22 })] })],
        shading: isHeader ? { type: ShadingType.SOLID, color: '2563EB', fill: '2563EB' } : undefined,
        width: { size: 100 / cells.length, type: WidthType.PERCENTAGE },
      }),
    ),
  })
}

function dataTable(headers: string[], rows: string[][]): Table {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      tableRow(headers, true),
      ...rows.map(r => tableRow(r)),
    ],
  })
}

const doc = new Document({
  sections: [
    {
      children: [
        // Capa
        new Paragraph({
          children: [new TextRun({ text: '', break: 3 })],
        }),
        new Paragraph({
          children: [new TextRun({ text: '⚜', size: 80 })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: TITULO, bold: true, size: 48 })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 200 },
        }),
        new Paragraph({
          children: [new TextRun({ text: 'Documentação de Uso do Sistema', size: 32 })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: `Versão ${VERSAO} · ${DATA}`, size: 24, color: '64748b' })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200 },
        }),

        // Quebra de página
        new Paragraph({ children: [new PageBreak()] }),

        // 1. Visão Geral
        h1('1. Visão Geral do Sistema'),
        p('O Sistema de Gerenciamento do Clube de Desbravadores Thiago White é uma aplicação web completa para gerenciar todas as operações do clube: cadastros de membros, controles financeiros, patrimônio, atas e relatórios oficiais.'),
        p('O sistema foi desenvolvido com as seguintes tecnologias:'),
        bullet('Next.js 15 com App Router e TypeScript'),
        bullet('Tailwind CSS 4 para estilização'),
        bullet('Supabase (PostgreSQL + Auth) para banco de dados'),
        bullet('Radix UI para componentes de interface'),
        bullet('Recharts para gráficos e visualizações'),

        // 2. Acesso
        h1('2. Acesso ao Sistema'),
        p('O sistema é acessado via navegador web. Para configurar o ambiente:'),
        h2('2.1 Requisitos'),
        bullet('Node.js 18 ou superior'),
        bullet('pnpm (gerenciador de pacotes)'),
        bullet('Conta no Supabase (gratuita em supabase.com)'),

        h2('2.2 Instalação'),
        bold('1. Clone o repositório:'),
        p('git clone https://github.com/italoarruda/clube-thiago-white.git'),
        bold('2. Instale as dependências:'),
        p('pnpm install'),
        bold('3. Configure as variáveis de ambiente:'),
        p('Copie o arquivo .env.example para .env.local e preencha com as chaves do Supabase.'),
        bold('4. Execute o schema no Supabase:'),
        p('Abra o arquivo supabase/migrations/0001_clube_thiago_white.sql e execute no SQL Editor do Supabase.'),
        bold('5. Inicie o servidor de desenvolvimento:'),
        p('pnpm dev'),
        p('O sistema ficará disponível em http://localhost:3000'),

        new Paragraph({ children: [new PageBreak()] }),

        // 3. Dashboard
        h1('3. Dashboard'),
        p('O Dashboard é a tela inicial do sistema, exibindo um resumo geral do clube.'),
        h2('3.1 Elementos exibidos'),
        bullet('Cards de resumo: Total de desbravadores ativos, inadimplentes no mês atual, saldo de caixa e valor total do patrimônio'),
        bullet('Gráfico de barras: Mensalidades pagas vs. pendentes por mês no ano atual'),
        bullet('Gráfico de pizza: Distribuição de desbravadores por unidade'),
        bullet('Tabela: Últimas 8 transações de caixa'),

        // 4. Cadastros
        h1('4. Módulos de Cadastro'),
        p('O menu "Cadastros" agrupa as entidades principais do clube.'),

        h2('4.1 Desbravadores'),
        p('Cadastra e gerencia todos os membros do clube.'),
        h3('Campos do cadastro:'),
        dataTable(
          ['Campo', 'Tipo', 'Obrigatório'],
          [
            ['Nome completo', 'Texto', 'Sim'],
            ['CPF', 'Texto (máscara)', 'Não'],
            ['RG', 'Texto', 'Não'],
            ['Data de Nascimento', 'Data', 'Não'],
            ['Sexo', 'Masculino / Feminino', 'Não'],
            ['Data de Ingresso', 'Data', 'Sim'],
            ['Unidade', 'Seleção', 'Não'],
            ['Classe', 'Seleção', 'Não'],
            ['Cargo', 'Desbravador / Conselheiro / Instrutor / Aspirante / Diretor', 'Sim'],
            ['Status', 'Ativo / Inativo / Transferido / Desligado', 'Sim'],
            ['Responsável', 'Texto', 'Não'],
            ['Contato do Responsável', 'Texto', 'Não'],
          ],
        ),
        new Paragraph({ spacing: { after: 200 } }),
        p('Na página de detalhes do desbravador, é possível vincular especialidades e acompanhar o progresso de cada uma.'),

        h2('4.2 Unidades'),
        p('Grupos do clube. Cada unidade tem um líder responsável. O cadastro contém: Nome, Líder, Contato e status Ativa/Inativa.'),

        h2('4.3 Classes'),
        p('Níveis de progressão dos desbravadores (1 = Amigo a 6 = Guia). O sistema vem pré-cadastrado com as 6 classes padrão.'),

        h2('4.4 Especialidades'),
        p('Habilidades que os desbravadores podem conquistar. Campos: Nome, Área, Nível (1-3) e Descrição.'),

        new Paragraph({ children: [new PageBreak()] }),

        // 5. Controles
        h1('5. Módulos de Controle'),

        h2('5.1 Mensalidades'),
        p('Exibe uma grade visual onde as linhas são os desbravadores ativos e as colunas são os meses do ano selecionado.'),
        p('Para registrar um pagamento, clique na célula correspondente ao desbravador e mês desejado. O status alternará entre Pendente e Pago automaticamente.'),
        p('Legenda dos status:'),
        bullet('✓ Verde — Pago'),
        bullet('— Cinza — Pendente'),
        bullet('! Vermelho — Atrasado'),
        bullet('I Azul — Isento'),

        h2('5.2 Caixa'),
        p('Controla todas as entradas e saídas financeiras do clube. Campos: Tipo (Entrada/Saída), Descrição, Valor, Data, Categoria e Referência.'),
        p('O saldo é calculado automaticamente em tempo real.'),

        h2('5.3 Custos'),
        p('Registra despesas do clube com fornecedor e nota fiscal. Inclui status de pagamento (Pendente/Pago).'),

        h2('5.4 Patrimônio'),
        p('Inventário de bens do clube. Cada bem tem número de tombamento, valor de aquisição, localização e estado (Ótimo/Bom/Regular/Ruim/Baixado).'),

        h2('5.5 Atas'),
        p('Registro de reuniões do clube. A numeração é automática e sequencial. Tipos de reunião: Diretoria, Clube, Pais e Extraordinária.'),
        p('Ao criar uma ata, preencha a data, tipo, local, pauta e o conteúdo completo. A ata pode ser marcada como "Aprovada" com registro da data de aprovação.'),
        p('Use o botão "Imprimir" para gerar a ata em formato oficial para impressão.'),

        h2('5.6 Atos'),
        p('Registro de atos oficiais: Resolução, Portaria, Circular e Ofício. A numeração é automática. Cada ato tem assunto, conteúdo e assinante.'),

        new Paragraph({ children: [new PageBreak()] }),

        // 6. Relatórios
        h1('6. Relatórios'),
        p('Todos os relatórios possuem botão "Imprimir" que abre a janela de impressão do navegador, permitindo salvar como PDF.'),

        h2('6.1 Autorização de Saída'),
        p('Gera um formulário oficial de autorização para atividades externas. Selecione o desbravador, informe o destino, data e horários. O formulário inclui local para assinatura do responsável e do diretor.'),

        h2('6.2 Fluxo de Caixa'),
        p('Relatório financeiro completo com filtro por período. Exibe um gráfico de barras com a evolução mensal e a tabela completa de lançamentos com total de entradas, saídas e saldo final.'),

        h2('6.3 Patrimônio'),
        p('Lista todos os bens cadastrados com seus números de tombamento, valores de aquisição e estados. Calcula o valor total do patrimônio ativo (excluindo baixados).'),

        h2('6.4 Livro Ata e Atos'),
        p('Exibe atas e atos em formato de livro, com filtro por período. Permite imprimir somente atas, somente atos ou ambos. O documento impresso segue o formato oficial de livro de atas.'),

        h2('6.5 Mensalidades'),
        p('Selecione um mês para ver o status de pagamento de cada desbravador ativo. Exibe totais de pagos, pendentes e valor arrecadado.'),

        h2('6.6 Cadastros'),
        p('Exibe listas completas de Desbravadores, Unidades, Classes e Especialidades em abas separadas. Use as abas para navegar entre as listas e o botão Imprimir para gerar o relatório da aba ativa.'),

        new Paragraph({ children: [new PageBreak()] }),

        // 7. FAQ
        h1('7. Perguntas Frequentes'),

        h2('Como redefinir o banco de dados?'),
        p('Execute o arquivo supabase/migrations/0001_clube_thiago_white.sql no SQL Editor do Supabase. Atenção: isso apagará todos os dados existentes.'),

        h2('Como fazer backup dos dados?'),
        p('No painel do Supabase, acesse Settings > Database > Backups para baixar um backup completo do banco.'),

        h2('O sistema funciona offline?'),
        p('Não. O sistema requer conexão com a internet para acessar o banco de dados no Supabase.'),

        h2('Como adicionar mais usuários?'),
        p('Acesse o painel do Supabase em Authentication > Users e convide novos usuários por e-mail. Todos os usuários autenticados têm acesso completo ao sistema.'),

        h2('Como gerar esta documentação novamente?'),
        p('Execute o comando: pnpm run docs'),
        p('O arquivo documentacao-sistema.docx será gerado na raiz do projeto.'),

        // Rodapé
        new Paragraph({ children: [new PageBreak()] }),
        new Paragraph({
          children: [new TextRun({ text: 'Clube de Desbravadores Thiago White', bold: true, size: 28 })],
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
        }),
        new Paragraph({
          children: [new TextRun({ text: `Documentação versão ${VERSAO} — Gerada em ${DATA}`, size: 22, color: '64748b' })],
          alignment: AlignmentType.CENTER,
        }),
      ],
    },
  ],
})

Packer.toBuffer(doc).then(buffer => {
  writeFileSync('documentacao-sistema.docx', buffer)
  console.log('✅ Documentação gerada: documentacao-sistema.docx')
})

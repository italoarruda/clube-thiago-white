# Guia de Uso — Sistema Clube de Desbravadores Thiago White

## Sumário

1. [Visão Geral](#visão-geral)
2. [Instalação e Configuração](#instalação-e-configuração)
3. [Dashboard](#dashboard)
4. [Cadastros](#cadastros)
   - [Desbravadores](#desbravadores)
   - [Unidades](#unidades)
   - [Classes](#classes)
   - [Especialidades](#especialidades)
5. [Mensalidades](#mensalidades)
6. [Caixa](#caixa)
7. [Custos](#custos)
8. [Patrimônio](#patrimônio)
9. [Atas](#atas)
10. [Atos](#atos)
11. [Relatórios](#relatórios)
12. [Banco de Dados](#banco-de-dados)

---

## Visão Geral

O **Sistema Clube de Desbravadores Thiago White** é uma aplicação web para gerenciamento completo de clubes de desbravadores. Centraliza controle de membros, finanças, documentação e geração de relatórios em uma única plataforma.

**Funcionalidades principais:**

| Módulo | Descrição |
|--------|-----------|
| Dashboard | Visão geral com indicadores e gráficos |
| Cadastros | Desbravadores, Unidades, Classes e Especialidades |
| Mensalidades | Controle de pagamentos mensais por desbravador |
| Caixa | Registro de entradas e saídas financeiras |
| Custos | Despesas operacionais do clube |
| Patrimônio | Inventário de bens do clube |
| Atas | Registro de reuniões e assembleias |
| Atos | Documentos administrativos (resoluções, portarias, etc.) |
| Relatórios | Geração de documentos em PDF |

---

## Instalação e Configuração

### Pré-requisitos

- Node.js 18+
- pnpm
- Docker Desktop (para Supabase local)
- Supabase CLI

### Configuração Local (Desenvolvimento)

```bash
# 1. Clone o repositório
git clone https://github.com/italoarruda/clube-thiago-white.git
cd clube-thiago-white

# 2. Instale as dependências
pnpm install

# 3. Inicie o Supabase local
supabase start

# 4. Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha com as credenciais exibidas pelo comando supabase start:
# NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
# NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>

# 5. Aplique as migrations
supabase migration up

# 6. Popule o banco com dados de exemplo
supabase db query "$(cat supabase/seed.sql)"

# 7. Inicie o servidor de desenvolvimento
pnpm dev
```

Acesse: `http://localhost:3000`  
Supabase Studio: `http://localhost:54323`

### Configuração em Produção (Supabase Cloud)

1. Crie um projeto em [supabase.com](https://supabase.com)
2. Acesse **Project Settings → API** e copie a URL e a `anon key`
3. Configure as variáveis no serviço de hospedagem (Vercel, Netlify, etc.)
4. Execute o conteúdo de `supabase/migrations/0001_clube_thiago_white.sql` no **SQL Editor** do Supabase

### Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima pública do Supabase |

---

## Dashboard

**Rota:** `/dashboard`

Tela inicial com resumo executivo do clube.

### Cards de Indicadores

| Card | Descrição |
|------|-----------|
| Desbravadores Ativos | Total de membros com status `ativo` |
| Mensalidades do Mês | Percentual de adimplência no mês corrente |
| Saldo de Caixa | Saldo atual (entradas − saídas totais) |
| Patrimônio Total | Soma dos valores de aquisição de todos os bens |

### Gráficos

- **Distribuição por Unidade** — pizza com quantidade de desbravadores por unidade
- **Fluxo de Caixa** — barras com entradas e saídas dos últimos 6 meses
- **Últimas Transações** — tabela com as 5 movimentações mais recentes

---

## Cadastros

### Desbravadores

**Rota:** `/cadastros/desbravadores`

Gerenciamento completo dos membros do clube.

#### Campos do Cadastro

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Nome completo | Texto | Sim |
| CPF | Texto (formato: 000.000.000-00) | Não |
| RG | Texto | Não |
| Data de nascimento | Data | Não |
| Sexo | Enum: masculino / feminino | Não |
| Cargo | Enum: desbravador, conselheiro, instrutor, aspirante, diretor | Sim |
| Status | Enum: ativo, inativo, transferido, desligado | Sim |
| Unidade | Vínculo com tabela `unidades` | Não |
| Classe atual | Vínculo com tabela `classes` | Não |
| Telefone | Texto | Não |
| Email | Texto | Não |
| Endereço | Texto | Não |
| Nome do responsável | Texto | Não |
| Telefone do responsável | Texto | Não |
| Observações | Texto longo | Não |
| Data de ingresso | Data | Não |

#### Ações Disponíveis

- **Novo Desbravador** — abre formulário de cadastro
- **Editar** — altera dados do desbravador selecionado
- **Excluir** — remove o desbravador (irreversível)
- **Filtrar** — filtra por status, unidade ou cargo
- **Buscar** — pesquisa por nome

#### Especialidades do Desbravador

Na tela de edição é possível vincular especialidades conquistadas pelo desbravador, informando:
- Especialidade (lista das especialidades cadastradas)
- Status: `em_andamento` ou `concluida`
- Data de conclusão

---

### Unidades

**Rota:** `/cadastros/unidades`

As unidades são os grupos internos do clube (ex.: Águias, Falcões, Leões).

#### Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Nome da unidade | Texto | Sim |
| Nome do líder | Texto | Não |
| Contato do líder | Texto | Não |
| Ativo | Booleano | Sim (padrão: true) |

---

### Classes

**Rota:** `/cadastros/classes`

As classes representam o nível de progressão do desbravador (Amigo a Guia).

> As 6 classes já vêm pré-cadastradas na migration inicial.

| Classe | Nível | Faixa etária |
|--------|-------|-------------|
| Amigo | 1 | 10 anos |
| Companheiro | 2 | 11 anos |
| Pesquisador | 3 | 12 anos |
| Pioneiro | 4 | 13 anos |
| Excursionista | 5 | 14 anos |
| Guia | 6 | 15 anos |

---

### Especialidades

**Rota:** `/cadastros/especialidades`

Cadastro das especialidades disponíveis para conquista pelos desbravadores.

#### Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Nome | Texto | Sim |
| Área | Texto (ex.: Artes, Ciências, Saúde) | Sim |
| Nível | Inteiro 1–3 | Sim |
| Descrição | Texto | Não |
| Ativo | Booleano | Sim |

---

## Mensalidades

**Rota:** `/mensalidades`

Controle de pagamentos mensais dos desbravadores.

### Visualização em Grade

A tela exibe uma grade com:
- **Linhas:** desbravadores ativos
- **Colunas:** meses do ano corrente (Jan–Dez)
- **Células:** status da mensalidade de cada desbravador em cada mês

### Status de Mensalidade

| Status | Cor | Descrição |
|--------|-----|-----------|
| `pago` | Verde | Mensalidade quitada |
| `pendente` | Amarelo | Aguardando pagamento |
| `atrasado` | Vermelho | Prazo vencido |
| `isento` | Cinza | Desbravador isento |

### Registrar Pagamento

Clique em uma célula para alterar o status da mensalidade. Informe:
- Valor pago
- Data de pagamento
- Observação (opcional)

### Resumo do Mês

No topo da página são exibidos:
- Total de desbravadores
- Quantidade de pagos / pendentes / atrasados / isentos
- Valor total arrecadado no mês selecionado

---

## Caixa

**Rota:** `/caixa`

Registro de todas as movimentações financeiras do clube.

### Cards de Resumo

| Card | Descrição |
|------|-----------|
| Entradas | Soma de todas as transações do tipo `entrada` |
| Saídas | Soma de todas as transações do tipo `saida` |
| Saldo | Entradas − Saídas |

### Campos de Transação

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Tipo | Enum: entrada / saída | Sim |
| Descrição | Texto | Sim |
| Valor | Decimal | Sim |
| Data | Data | Sim |
| Categoria | Enum: mensalidade, evento, doação, material, outro | Sim |
| Observação | Texto | Não |

### Filtros

- Por tipo (entrada / saída)
- Por categoria
- Por período (data inicial e final)

---

## Custos

**Rota:** `/custos`

Controle das despesas operacionais do clube (separado do caixa, para organização interna).

### Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Descrição | Texto | Sim |
| Valor | Decimal | Sim |
| Data | Data | Sim |
| Categoria | Enum: material, evento, manutenção, alimentação, transporte, outro | Sim |
| Fornecedor | Texto | Não |
| Nota Fiscal | Texto | Não |
| Status de Pagamento | Enum: pendente / pago | Sim |

### Resumo

No topo são exibidos os totais:
- **Pendente:** soma dos custos ainda não pagos
- **Pago:** soma dos custos já quitados
- **Total:** soma geral

---

## Patrimônio

**Rota:** `/patrimônio`

Inventário de bens pertencentes ao clube.

### Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Nome do bem | Texto | Sim |
| Número de tombamento | Texto (único) | Não |
| Descrição | Texto | Não |
| Valor de aquisição | Decimal | Não |
| Data de aquisição | Data | Não |
| Estado de conservação | Enum: ótimo, bom, regular, ruim, baixado | Sim |
| Localização | Texto | Não |
| Observações | Texto | Não |

### Estados de Conservação

| Estado | Descrição |
|--------|-----------|
| `otimo` | Excelente condição de uso |
| `bom` | Bom estado, sem danos |
| `regular` | Uso normal com pequenos desgastes |
| `ruim` | Necessita reparo |
| `baixado` | Fora de uso / descartado |

---

## Atas

**Rota:** `/atas`

Registro formal das reuniões e assembleias do clube.

### Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Número | Inteiro sequencial | Sim |
| Data | Data | Sim |
| Tipo | Enum: diretoria, clube, pais, extraordinária | Sim |
| Local | Texto | Sim |
| Pauta | Texto | Sim |
| Conteúdo | Texto longo | Sim |
| Aprovada | Booleano | Sim |
| Data de aprovação | Data | Não |

### Tipos de Reunião

| Tipo | Descrição |
|------|-----------|
| `diretoria` | Reunião da diretoria do clube |
| `clube` | Reunião geral com todos os membros |
| `pais` | Reunião com pais e responsáveis |
| `extraordinaria` | Reunião convocada em caráter especial |

---

## Atos

**Rota:** `/atos`

Documentos administrativos formais emitidos pela direção do clube.

### Campos

| Campo | Tipo | Obrigatório |
|-------|------|-------------|
| Número | Inteiro sequencial | Sim |
| Data | Data | Sim |
| Tipo | Enum: resolução, portaria, circular, ofício | Sim |
| Assunto | Texto | Sim |
| Conteúdo | Texto longo | Sim |
| Assinante | Texto (nome do responsável) | Sim |

### Tipos de Ato

| Tipo | Uso |
|------|-----|
| `resolucao` | Decisões de caráter normativo |
| `portaria` | Designações e nomeações |
| `circular` | Comunicações internas |
| `oficio` | Comunicações externas formais |

---

## Relatórios

**Rota:** `/relatorios`

Geração de documentos em PDF para uso administrativo e pastoral.

### Relatórios Disponíveis

| Relatório | Rota | Descrição |
|-----------|------|-----------|
| Autorização de Saída | `/relatorios/autorizacao-saida` | Formulário de autorização dos responsáveis para eventos externos |
| Fluxo de Caixa | `/relatorios/fluxo-caixa` | Extrato financeiro por período |
| Patrimônio | `/relatorios/patrimônio` | Lista completa do inventário de bens |
| Livro de Ata e Atos | `/relatorios/livro-ata-atos` | Compilado de atas e atos para impressão |
| Mensalidade | `/relatorios/mensalidade` | Boletim de pagamentos por mês/desbravador |
| Cadastros | `/relatorios/cadastros` | Listagem de desbravadores com dados cadastrais |

---

## Banco de Dados

### Diagrama de Entidades

```
unidades ──────────────── desbravadores ──────── classes
                          │
                          ├──── mensalidades
                          │
                          └──── desbravador_especialidades ──── especialidades

caixa_transacoes
custos
patrimonio
atas
atos
```

### Tabelas

| Tabela | Registros (seed) | Descrição |
|--------|-----------------|-----------|
| `unidades` | 3 | Grupos internos do clube |
| `classes` | 6 | Níveis de progressão (Amigo → Guia) |
| `especialidades` | 5+ | Especialidades disponíveis |
| `desbravadores` | 8+ | Membros do clube |
| `desbravador_especialidades` | — | Vínculo membro × especialidade |
| `mensalidades` | — | Uma linha por membro/mês |
| `caixa_transacoes` | — | Movimentações financeiras |
| `custos` | — | Despesas operacionais |
| `patrimonio` | — | Inventário de bens |
| `atas` | — | Registros de reuniões |
| `atos` | — | Documentos administrativos |

### Migrations

| Arquivo | Descrição |
|---------|-----------|
| `0001_clube_thiago_white.sql` | Schema completo + classes pré-cadastradas |
| `0002_anon_access.sql` | Políticas RLS para acesso anônimo (desenvolvimento local) |

> **Produção:** remova ou não aplique `0002_anon_access.sql` em ambientes com autenticação ativa.

---

## Testes

```bash
# Executar todos os testes
pnpm test

# Executar em modo watch
pnpm test --watch
```

Os testes cobrem as 8 páginas principais usando **Vitest + React Testing Library**, com mock do cliente Supabase.

---

## Suporte

Dúvidas ou problemas? Abra uma [issue no GitHub](https://github.com/italoarruda/clube-thiago-white/issues).

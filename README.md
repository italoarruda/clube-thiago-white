# Clube de Desbravadores Thiago White

Sistema de gerenciamento completo para o Clube de Desbravadores Thiago White.

## Funcionalidades

- **Dashboard** com cards de resumo e gráficos de fluxo de caixa e distribuição por unidade
- **Cadastros:** Desbravadores, Unidades, Classes e Especialidades
- **Controles:** Mensalidades, Caixa, Custos, Patrimônio, Atas e Atos
- **Relatórios:** Autorização de saída, Fluxo de caixa, Patrimônio, Livro de Ata e Atos, Mensalidade e Cadastros

## Stack

- Next.js 15 + TypeScript + App Router
- Tailwind CSS 4
- Supabase (PostgreSQL + RLS)
- Radix UI + Lucide React
- Recharts
- Vitest + React Testing Library

## Instalação (desenvolvimento local)

```bash
# Clone o repositório
git clone https://github.com/italoarruda/clube-thiago-white.git
cd clube-thiago-white

# Instale as dependências
pnpm install

# Inicie o Supabase local (requer Docker)
supabase start

# Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha com as credenciais exibidas pelo supabase start

# Aplique as migrations
supabase migration up

# Popule o banco com dados de exemplo
supabase db query "$(cat supabase/seed.sql)"

# Inicie o servidor
pnpm dev
```

Acesse `http://localhost:3000` · Supabase Studio em `http://localhost:54323`

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima pública do Supabase |

## Testes

```bash
pnpm test
```

Cobertura: 8 páginas com mocks do Supabase via Vitest + React Testing Library.

## Documentação

| Documento | Público-alvo |
|---|---|
| [Manual do Usuário](docs/MANUAL_USUARIO.md) | Operadores do sistema (secretaria, tesouraria, direção) |
| [Guia Técnico](docs/USAGE.md) | Desenvolvedores e administradores do sistema |

## Licença

MIT

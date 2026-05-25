# Clube de Desbravadores Thiago White

Sistema de gerenciamento completo para o Clube de Desbravadores Thiago White.

## Funcionalidades

- **Cadastros:** Desbravadores, Unidades, Classes, Especialidades
- **Controles:** Mensalidades, Caixa, Custos, Patrimônio, Atas, Atos
- **Relatórios:** Autorização de saída, Fluxo de caixa, Patrimônio, Livro Ata e Atos, Mensalidade, Cadastros
- **Dashboard** com cards de resumo e gráficos

## Stack

- Next.js 15 + TypeScript + App Router
- Tailwind CSS 4
- Supabase (PostgreSQL + Auth)
- Radix UI + Lucide React
- Recharts

## Instalação

```bash
# Clone o repositório
git clone https://github.com/italoarruda/clube-thiago-white.git
cd clube-thiago-white

# Instale as dependências
pnpm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

# Execute o schema no Supabase SQL Editor
# Arquivo: supabase/migrations/0001_clube_thiago_white.sql

# Inicie o servidor
pnpm dev
```

Acesse `http://localhost:3000`

## Documentação

Para gerar a documentação de uso do sistema em `.docx`:

```bash
pnpm run docs
```

O arquivo `documentacao-sistema.docx` será gerado na raiz do projeto.

## Testes

```bash
pnpm test
```

## Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |

## Licença

MIT

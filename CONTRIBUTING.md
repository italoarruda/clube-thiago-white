# Contribuindo

Obrigado pelo interesse em contribuir!

## Fluxo de trabalho

1. Fork o repositório
2. Crie uma branch: `git checkout -b feat/nome-da-feature`
3. Faça as alterações e escreva testes quando aplicável
4. Confirme que os testes passam: `pnpm test`
5. Commit com mensagem semântica (veja abaixo)
6. Abra um Pull Request

## Padrão de commits (Conventional Commits)

```
feat     → nova funcionalidade
fix      → correção de bug
docs     → apenas documentação
style    → formatação, sem mudança de lógica
refactor → refatoração sem nova feature ou fix
test     → adição ou correção de testes
chore    → tarefas de build, CI, dependências
```

Exemplos:
```
feat: adiciona relatório de inadimplência
fix: corrige cálculo de mensalidade com desconto
docs: atualiza README com instruções Docker
```

## Rodando localmente

```bash
cp .env.example .env.local
pnpm install
pnpm dev
```

## Rodando os testes

```bash
pnpm test
```

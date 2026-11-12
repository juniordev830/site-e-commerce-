# Verificação do monorepositório

Este projeto contém `backend/` (Node.js, TypeScript, Express e Prisma) e `frontend/` (React/TypeScript com Vite), além do `package.json` da raiz. As implementações de catálogo, pedidos e checkout devem ser verificadas no código e nos testes, não apenas pelas telas de demonstração.

## Preparação

```bash
npm ci
```

Copiar os exemplos de configuração de `backend/.env.example` e `frontend/.env.example` para arquivos locais, com valores fictícios. Consultar scripts em `package.json`, `backend/package.json` e `frontend/package.json` antes de iniciar serviços; verificar configuração Prisma e banco de desenvolvimento.

## Matriz de revisão

- Frontend: estados vazio, carregando e erro para catálogo e carrinho; atualização responsiva.
- API: entradas inválidas, autenticação, acesso indevido a pedidos e erros de banco.
- Checkout demonstrativo: preços calculados no servidor e consistência de estoque/itens; não aceitar totais enviados pelo navegador como fonte de verdade.
- Testes: executar suite de `backend/tests/checkout.test.ts` e builds definidos em ambos os `package.json`.
- Segurança: nenhum token, credencial de pagamento ou `.env` verdadeiro no repositório.

## Pendências para uso real

Confirmar política de pagamento, idempotência, tratamento de estoque concorrente, migrações, logs sem dados sensíveis e homologação de um provedor de pagamento. Este repositório é material de portfólio, não uma loja pronta para receber pagamentos.

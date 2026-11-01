# Auditoria inicial — Minha Loja (E-commerce Full Stack)

Revisão estática de arquivos selecionados. Instalação, build e testes ainda precisam ser executados em ambiente Node compatível.

## Pontos positivos confirmados

- Monorepo com workspaces separados para frontend e backend.
- Validação de dados com Zod, ORM Prisma e SQLite no desenvolvimento.
- Senhas com bcrypt, sessão em cookie `httpOnly`, Helmet, CORS configurável e limitação de tentativas em cadastro/login.
- Pedido calculado no servidor em centavos, transação de banco e decremento condicional de estoque para reduzir risco de estoque negativo em concorrência.
- O frontend deixa explícito que registrar pedido não significa que pagamento foi processado.

## Riscos e próximos passos

### P1 — O fluxo de pedido não é pagamento real
O código cria pedidos pendentes e não integra gateway. A documentação e a interface devem continuar deixando isso claro. Não apresentar como checkout com pagamento concluído.

### P1 — Testes automatizados não foram localizados nesta revisão
O workflow executa `npm ci`, `npm run typecheck` e `npm run build`, mas não há etapa de testes nesse workflow. Criar testes para autenticação, permissões de administrador, catálogo, estoque, pedidos concorrentes e validação de entrada; incluir execução no CI.

### P1 — Verificar recuperação e configuração de implantação
A configuração de exemplo usa SQLite local. Antes de implantação pública, documentar persistência do arquivo de banco, backup/restauração, migrações e comportamento em hospedagem com sistema de arquivos efêmero.

### P2 — Testar fluxo completo pelo navegador
Confirmar cadastro, login, sessão, vitrine, carrinho, pedido, logout e estados de erro. Conferir que preço e estoque exibidos não são tratados como fonte confiável no cliente: o servidor já recalcula o total no pedido.

### P2 — Validar instalação limpa e compatibilidade
O projeto exige Node.js >=20.19 e usa workspaces. Executar instalação a partir da raiz, typecheck e build em ambiente limpo e registrar as versões testadas.

## Critério de portfólio

Considerar a versão pronta para demonstração após instalação limpa, CI verde, testes de API e fluxo navegador concluídos, README coerente com as funcionalidades realmente implementadas e instruções de deploy/limitações documentadas. Esta auditoria não afirma que o projeto está pronto para produção.

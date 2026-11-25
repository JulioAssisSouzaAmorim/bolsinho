# Bolsinho

[![CI/CD](https://github.com/JulioAssisSouzaAmorim/bolsinho/actions/workflows/ci.yml/badge.svg)](https://github.com/JulioAssisSouzaAmorim/bolsinho/actions/workflows/ci.yml)

Controle de gastos pessoais simples, direto no navegador.

**Em produção:** https://julioassissouzaamorim.github.io/bolsinho/

## Integrantes

- Júlio Assis Souza Amorim

## Sobre o sistema

O Bolsinho permite registrar receitas e despesas do dia a dia e acompanhar o saldo. Funcionalidades:

- Cadastro de transações (descrição, valor, tipo, categoria e data), com validação e mensagens de erro.
- Resumo com total de receitas, total de despesas e saldo (destacado em vermelho quando negativo).
- Lista de transações ordenada da mais recente para a mais antiga, com remoção.
- Filtros por tipo e por categoria e busca por descrição (sem diferenciar maiúsculas ou acentos).
- Total de despesas por categoria.
- Persistência no `localStorage`: os dados continuam lá ao recarregar a página.

O código separa o **domínio** (`src/lib/`: valores, datas, transações, cálculos e armazenamento), feito de funções puras e fáceis de testar, da **interface** (`src/app.js`), que só liga o HTML ao domínio.

## Tecnologias

- **HTML, CSS e JavaScript (ES Modules)**, sem framework nem etapa de build: o navegador carrega os arquivos de `src/` diretamente.
- **Node.js 24**: executa as ferramentas de teste e um servidor estático mínimo (`scripts/serve.mjs`).
- **Vitest**: testes de unidade; **jsdom** simula o navegador nos testes da interface.
- **@vitest/coverage-v8**: mede a cobertura de testes, com mínimo de 80% configurado em `vitest.config.js`.
- **Playwright**: testes end-to-end no Chromium.
- **GitHub Actions**: a cada commit roda testes e cobertura em Linux, macOS e Windows; na branch `main`, publica o site.
- **GitHub Pages**: hospedagem gratuita do sistema em produção.

## Uso de IA

- **Claude Code (Anthropic)**: usado como assistente de programação no VS Code. Ajudou a estruturar o projeto, escrever o código do domínio e da interface, propor e escrever os testes de unidade e e2e, configurar cobertura e o workflow do GitHub Actions e redigir este README.
- Todo o código sugerido pela IA foi executado e validado com a suíte de testes e a cobertura antes de ser versionado. Ajustes como a troca dos rótulos do formulário por `<label for>` (para que os testes e2e encontrassem os campos pelo nome acessível) surgiram justamente dessa validação.

## Execução dos testes

Pré-requisito: [Node.js](https://nodejs.org/) 22.12 ou superior.

```bash
npm install                          # instala as dependências
npm test                             # testes de unidade
npm run test:coverage                # testes de unidade + relatório de cobertura (coverage/index.html)
npx playwright install chromium      # baixa o navegador (só na primeira vez)
npm run test:e2e                     # testes end-to-end
```

Para usar o sistema localmente: `npm start` e abrir http://localhost:4173.

### Resumo dos testes

| Tipo | Quantidade | Onde |
| --- | --- | --- |
| Unidade | 58 | `tests/unit/` |
| End-to-end | 5 | `tests/e2e/` |
| Cobertura | ~96% das linhas | `src/**/*.js` |

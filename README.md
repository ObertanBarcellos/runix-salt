# RUNIX SALT+ — site

Landing page do suplemento **RUNIX SALT+**: hidratação e reposição eletrolítica em sachê, sem açúcar, voltado a corredores e quem treina com frequência. O site apresenta produto, fórmula de referência, benefícios por ingrediente, orientações de uso e contexto científico, com linguagem de suporte à rotina (sem promessas exageradas).

## O que há neste repositório

- **Frontend:** React 19 + TypeScript + Vite
- **Conteúdo multilíngue:** português, inglês e espanhol (`src/locales/`), com `i18next` e seletor de idioma
- **Animações e scroll:** GSAP (incl. ScrollTrigger), scroll suave entre seções da página
- **Assets estáticos:** PDF da marca em `public/files/`, ícones e imagens em `public/` e `src/assets/`

Estrutura principal da página: hero, produto, fórmula, benefícios, experiência de uso, ciência e rodapé — navegação por âncoras (`#produto`, `#formula`, etc.).

## Requisitos

- [Node.js](https://nodejs.org/) (versão compatível com o projeto)
- [pnpm](https://pnpm.io/) (o lockfile do projeto é `pnpm-lock.yaml`)

## Como rodar localmente

```bash
pnpm install
pnpm dev
```

Abra o endereço que o Vite indicar no terminal (em geral `http://localhost:5173`).

## Scripts

| Comando        | Descrição                          |
| -------------- | ---------------------------------- |
| `pnpm dev`     | Servidor de desenvolvimento        |
| `pnpm build`   | Typecheck + build de produção      |
| `pnpm preview` | Pré-visualização do build          |
| `pnpm lint`    | ESLint no projeto                  |

## Build de produção

```bash
pnpm build
```

Saída em `dist/`, pronta para servir em qualquer host estático (CDN, S3+CloudFront, Netlify, etc.).

## Estrutura útil

| Caminho              | Função                                      |
| -------------------- | ------------------------------------------- |
| `src/App.tsx`        | Página única, seções e animações            |
| `src/i18n.ts`        | Configuração do i18next                     |
| `src/locales/*.json` | Textos por idioma                           |
| `src/lib/smoothScroll.ts` | Scroll suave até seções por id        |
| `public/`            | Favicon, PDF e ficheiros servidos na raiz   |

---

Projeto privado; conteúdo e marca pertencem aos respetivos titulares.

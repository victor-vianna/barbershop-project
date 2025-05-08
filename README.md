# 💈 Barbershop Project

Sistema de agendamento online para barbearias, desenvolvido com tecnologias modernas para garantir uma experiência fluida e intuitiva tanto para o cliente quanto para o barbeiro.

## 📋 Funcionalidades

- Cadastro de serviços, barbeiros e horários disponíveis
- Agendamento de horário em poucos cliques
- Seleção de barbeiro e visualização de perfil
- Controle de status dos agendamentos (pendente, confirmado, concluído, cancelado)
- Interface amigável e responsiva
- Sistema de autenticação com Clerk

## 🚀 Tecnologias Utilizadas

### Core

- **Frontend**: [Next.js 15](https://nextjs.org/), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/), [tailwind-merge](https://github.com/dcastil/tailwind-merge), [tailwindcss-animate](https://github.com/jamiebuilds/tailwindcss-animate)
- **Backend**: [tRPC 11](https://trpc.io/), [Supabase](https://supabase.io/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/) via Supabase
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)

### UI e Componentes

- [Radix UI](https://www.radix-ui.com/) (@radix-ui/react-label, @radix-ui/react-select, @radix-ui/react-slot, @radix-ui/react-toast)
- [Framer Motion](https://www.framer.com/motion/) - Animações
- [Lucide React](https://lucide.dev/) - Ícones
- [Sonner](https://sonner.emilkowal.ski/) - Toast notifications
- [React Calendar](https://github.com/wojtekmaj/react-calendar) & [React Day Picker](https://react-day-picker.js.org/) - Componentes de calendário

### Utilidades

- [Clerk](https://clerk.dev/) - Autenticação e gerenciamento de usuários
- [Tanstack React Query](https://tanstack.com/query/latest) - Gerenciamento de estado e cache
- [date-fns](https://date-fns.org/) & [date-fns-tz](https://github.com/marnusw/date-fns-tz) - Manipulação de datas
- [Zod](https://zod.dev/) - Validação de esquemas
- [class-variance-authority](https://cva.style/docs) & [clsx](https://github.com/lukeed/clsx) - Utilitários para classes CSS
- [SuperJSON](https://github.com/blitz-js/superjson) - Serialização para tRPC

### DevTools

- ESLint & Prettier - Linting e formatação de código
- Drizzle Kit - Ferramentas para Drizzle ORM

## 🧑‍💻 Como rodar o projeto localmente

```bash
# 1. Clone o repositório
git clone https://github.com/victor-vianna/barbershop-project.git
cd barbershop-project

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env na raiz do projeto com as variáveis necessárias:
# DATABASE_URL=...
# SUPABASE_URL=...
# SUPABASE_ANON_KEY=...
# CLERK_PUBLISHABLE_KEY=...
# CLERK_SECRET_KEY=...

# 4. Gere e aplique as migrações do banco de dados (opcional)
npm run db:generate
npm run db:push

# 5. Execute o projeto em modo de desenvolvimento
npm run dev
```

## 📜 Scripts disponíveis

- **`npm run dev`**: Inicia o servidor de desenvolvimento com Turbo
- **`npm run build`**: Cria a versão de produção do projeto
- **`npm run start`**: Inicia o servidor de produção
- **`npm run preview`**: Constrói e inicia o servidor para testar a build
- **`npm run lint`**: Executa a verificação de linting
- **`npm run lint:fix`**: Corrige problemas de linting automaticamente
- **`npm run format:check`**: Verifica a formatação do código
- **`npm run format:write`**: Formata o código automaticamente
- **`npm run typecheck`**: Verifica os tipos TypeScript
- **`npm run check`**: Executa linting e verificação de tipos
- **`npm run db:generate`**: Gera migrações do Drizzle
- **`npm run db:migrate`**: Executa migrações do Drizzle
- **`npm run db:push`**: Sincroniza o esquema com o banco de dados
- **`npm run db:studio`**: Abre o Drizzle Studio para gerenciar o banco de dados

## 📄 Licença

Este projeto está licenciado sob os termos da licença MIT.

Desenvolvido por Victor Vianna

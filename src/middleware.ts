import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  // Rotas públicas
  publicRoutes: [
    "/",
    "/servicos",
    "/sign-in(.*)",
    "/sign-up(.*)",
    // Sua rota pública do TRPC
    "/api/trpc/appointments.listServices",
    "/api/trpc/(.*)", // importante permitir para consultas públicas
  ],
});

export const config = {
  matcher: [
    // permitir arquivos estáticos e /api, mas rodar no resto
    "/((?!_next|.*\\..*).*)",
  ],
};

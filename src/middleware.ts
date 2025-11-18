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
    "/((?!_next|.*\\..*).*)",
    "/api/(.*)", // 🔥 agora o middleware roda também na API
  ],
};

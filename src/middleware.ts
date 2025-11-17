import { authMiddleware } from "@clerk/nextjs";

// Rotas públicas
export default authMiddleware({
  publicRoutes: ["/", "/servicos", "/sign-in(.*)", "/sign-up(.*)"],
});

// IMPORTANTE: não deixe o middleware rodar para /api e /trpc
export const config = {
  matcher: [
    // Rode apenas para rotas "páginas"
    "/((?!_next|api|trpc|.*\\..*).*)",
  ],
};

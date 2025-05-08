import { authMiddleware } from "@clerk/nextjs";

// Define as rotas protegidas usando o authMiddleware do Clerk
export default authMiddleware({
  // Rotas públicas (não precisam de autenticação)
  publicRoutes: [
    "/",
    "/sign-in(.*)",
    "/sign-up(.*)",
    // Adicione outras rotas públicas conforme necessário
  ],

  // Ou alternativamente, você pode usar ignoredRoutes para especificar quais rotas ignorar
  // e proteger todas as outras
  // ignoredRoutes: ["/api/public", "/public-page"],
});

// Mantenha a configuração matcher conforme você já definiu
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

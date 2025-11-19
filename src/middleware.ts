// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define rotas públicas (acessíveis sem autenticação)
const isPublicRoute = createRouteMatcher([
  "/",
  "/servicos",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// Define rotas administrativas
const isAdminRoute = createRouteMatcher(["/admin/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  // Redireciona para login se não estiver autenticado em rotas protegidas
  if (!isPublicRoute(req) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  // Verifica permissões de admin em rotas administrativas
  if (isAdminRoute(req) && userId) {
    const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

    if (role !== "admin") {
      return NextResponse.redirect(new URL("/servicos", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Ignora arquivos estáticos e internos do Next.js
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Sempre executa para rotas de API
    "/(api|trpc)(.*)",
  ],
};

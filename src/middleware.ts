// middleware.ts
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const adminRoutes = ["/admin/dashboard"];

function isAdminRoute(req: Request) {
  const pathname = new URL(req.url).pathname;
  return adminRoutes.some((route) => pathname.startsWith(route));
}

export default authMiddleware({
  // Rotas completamente públicas
  publicRoutes: ["/", "/servicos", "/sign-in(.*)", "/sign-up(.*)"],

  // Rotas IGNORADAS pelo Clerk (importante para tRPC)
  ignoredRoutes: ["/api/webhooks(.*)", "/api/trpc(.*)"],

  async afterAuth(auth, req) {
    const { userId, sessionClaims } = auth;
    const pathname = new URL(req.url).pathname;

    // Se não estiver autenticado e não for rota pública
    if (
      !userId &&
      !pathname.startsWith("/sign-in") &&
      !pathname.startsWith("/sign-up") &&
      pathname !== "/" &&
      !pathname.startsWith("/servicos")
    ) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isAdminRoute(req)) {
      const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

      if (role !== "admin") {
        return NextResponse.redirect(new URL("/servicos", req.url));
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};

// middleware.ts
import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

const publicRoutes = [
  "/",
  "/servicos",
  "/sign-in",
  "/sign-up",
  "/api/webhooks",
  "/api/trpc",
];

function isPublic(req: Request) {
  const pathname = new URL(req.url).pathname;
  return publicRoutes.some((route) => pathname.startsWith(route));
}

const adminRoutes = ["/admin/dashboard", "/dashboard", "/admin"];

function isAdminRoute(req: Request) {
  const pathname = new URL(req.url).pathname;
  return adminRoutes.some((route) => pathname.startsWith(route));
}

export default authMiddleware({
  publicRoutes,

  async afterAuth(auth, req) {
    const { userId, sessionClaims } = auth;
    const pathname = new URL(req.url).pathname;

    if (isPublic(req)) return NextResponse.next();

    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    if (isAdminRoute(req)) {
      // Lê role do publicMetadata com type assertion
      const role = (sessionClaims?.publicMetadata as { role?: string })?.role;

      if (role !== "admin") {
        return NextResponse.redirect(new URL("/servicos", req.url));
      }
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/(api|trpc)(.*)"],
};

// src/app/api/trpc/[trpc]/route.ts
import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

// ⚠️ MUDANÇA AQUI: passa o req para createContext
const handler = (req: Request) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ headers: req.headers, req }), // Adiciona req aqui
  });
};

export { handler as GET, handler as POST };

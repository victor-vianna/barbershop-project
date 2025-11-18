// src/server/api/trpc.ts
import { getAuth } from "@clerk/nextjs/server";
import { db } from "~/server/db";

export const createTRPCContext = async (opts: {
  headers: Headers;
  req?: Request;
}) => {
  let userId: string | null = null;
  let sessionId: string | null = null;

  if (opts.req) {
    try {
      const auth = getAuth(opts.req as any);
      userId = auth.userId;
      sessionId = auth.sessionId;

      // Log apenas em desenvolvimento
      if (process.env.NODE_ENV === "development") {
        console.log("[tRPC Context]", { userId, sessionId });
      }
    } catch (error) {
      console.error("[tRPC Context Error]", error);
    }
  }

  return {
    db,
    userId: userId ?? null,
    sessionId: sessionId ?? null,
    headers: opts.headers,
  };
};

// ... resto do código permanece igual

/**
 * 2. INITIALIZATION
 */
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * 3. ROUTER & PROCEDURE
 */

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

/**
 * Public procedure - Qualquer um pode chamar
 */
export const publicProcedure = t.procedure;

/**
 * Protected procedure - Requer autenticação
 */
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // Garante que userId não é null
      userId: ctx.userId,
    },
  });
});

/**
 * Admin procedure - Requer autenticação + role admin
 */
export const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Aqui você pode adicionar verificação de admin
  // const user = await ctx.db.query.users.findFirst({
  //   where: eq(users.clerkUserId, ctx.userId),
  // });
  // if (user?.role !== 'admin') {
  //   throw new TRPCError({ code: "FORBIDDEN" });
  // }

  return next({ ctx });
});

import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { appointmentsRouter } from "~/server/api/routers/appointments";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  appointments: appointmentsRouter,
  // Adicione outros routers aqui conforme necessário
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

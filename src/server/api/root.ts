import { createTRPCRouter } from "~/server/api/trpc";
import { appointmentsRouter } from "./routers/appointments";

export const appRouter = createTRPCRouter({
  appointments: appointmentsRouter,
});

export type AppRouter = typeof appRouter;

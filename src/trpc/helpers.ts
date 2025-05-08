import { type AppRouter, appRouter } from "~/server/api/root";

// No tRPC v11, o roteador tem um método createCaller diretamente
export const createCaller = (ctx: any) => appRouter.createCaller(ctx);

export function createServerSideHelpers<Router extends AppRouter>({
  ctx,
}: {
  ctx: any;
}) {
  return createCaller(ctx);
}

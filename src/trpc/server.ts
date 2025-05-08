// Importe unstable_cache em vez de cache do React
import { unstable_cache } from "next/cache";
import { headers } from "next/headers";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import { type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createServerSideHelpers } from "./helpers";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = unstable_cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClientCached = unstable_cache(async () => createQueryClient());

// Obtenha o contexto e o query client de forma assíncrona
const context = await createContext();
const queryClient = await getQueryClientCached();

// Use o método createServerSideHelpers para criar o caller
const caller = createServerSideHelpers<AppRouter>({ ctx: context });

// função síncrona para `createHydrationHelpers`
export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  () => queryClient,
);

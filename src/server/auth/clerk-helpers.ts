import { auth } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

/**
 * Verifica se o usuário atual é admin
 * AGORA lê do Clerk publicMetadata (não do banco)
 */
export function isAdmin(): boolean {
  const { sessionClaims } = auth();
  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
  return role === "admin";
}

/**
 * Busca ou cria um usuário no banco com base no Clerk
 * Use apenas para sincronizar dados, não para autenticação
 */
export async function getOrCreateUser(
  clerkUserId: string,
  role: string = "customer",
) {
  // Verifica se usuário já existe
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.clerkUserId, clerkUserId))
    .limit(1);

  if (existingUser[0]) {
    return existingUser[0];
  }

  // Cria novo usuário
  const newUser = await db
    .insert(users)
    .values({
      clerkUserId,
      role,
    })
    .returning();

  return newUser[0]!;
}

/**
 * Retorna o role do usuário atual
 * Agora lê do Clerk publicMetadata
 */
export function getCurrentUserRole(): "admin" | "customer" | null {
  const { userId, sessionClaims } = auth();

  if (!userId) return null;

  const role = (sessionClaims?.publicMetadata as { role?: string })?.role;
  return (role as "admin" | "customer") ?? "customer";
}

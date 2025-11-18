/**
 * Script para tornar um usuário admin via Clerk API
 *
 * Como usar:
 * 1. Pegue o User ID no Clerk Dashboard
 * 2. Execute: npx tsx src/scripts/create-admin.ts <CLERK_USER_ID>
 */

import { clerkClient } from "@clerk/nextjs/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

async function makeUserAdmin(clerkUserId: string) {
  try {
    console.log(`\n🔄 Processando usuário: ${clerkUserId}...`);

    // 1. Atualiza no Clerk (publicMetadata)
    console.log("📝 Atualizando metadata no Clerk...");
    await clerkClient.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        role: "admin",
      },
    });

    // 2. Atualiza/cria no banco de dados
    console.log("💾 Atualizando banco de dados...");
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkUserId, clerkUserId))
      .limit(1);

    if (existingUser[0]) {
      await db
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.clerkUserId, clerkUserId));
      console.log("✅ Usuário atualizado para ADMIN no banco!");
    } else {
      await db.insert(users).values({
        clerkUserId,
        role: "admin",
      });
      console.log("✅ Novo usuário ADMIN criado no banco!");
    }

    console.log("\n🎉 SUCESSO! O usuário agora é ADMIN");
    console.log(
      "⚠️  IMPORTANTE: Peça ao usuário para fazer logout e login novamente\n",
    );
  } catch (error) {
    console.error("\n❌ Erro ao criar admin:", error);
  } finally {
    process.exit(0);
  }
}

const clerkUserId = process.argv[2];

if (!clerkUserId) {
  console.error("❌ Erro: Forneça o Clerk User ID como argumento");
  console.log("Uso: npx tsx src/scripts/create-admin.ts <CLERK_USER_ID>");
  process.exit(1);
}

makeUserAdmin(clerkUserId);

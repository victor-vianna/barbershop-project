import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",

  out: "./drizzle/migrations", // ← ONDE AS MIGRATIONS SERÃO GERADAS

  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  introspect: {
    casing: "camel", // apenas isso é permitido hoje
  },
});

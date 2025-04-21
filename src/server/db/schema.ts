// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  timestamp,
  varchar,
  date,
  time,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `barbershop-project_${name}`);

 // tabela de agendamentos
 export const appointments = createTable("appointment", {
  user_id: varchar("user_id", { length: 255 }).notNull(),
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  client_name: varchar("client_name", { length: 255 }).notNull(),
  service: varchar("service", { length: 255 }).notNull(),
  date: date("date").notNull(),
  time: time("time").notNull(),
  status: varchar("status", { length: 50 }).default("pendente").notNull(),
  barber_id: varchar("barber_id").notNull(),
  created_at: timestamp("created_at", { withTimezone: true })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull()
 })


export const posts = createTable(
  "post",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
);

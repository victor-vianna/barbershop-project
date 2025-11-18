import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  date,
  time,
  boolean,
  numeric,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Tabela de usuários com roles
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(), // ID do Clerk
  role: text("role").notNull().default("customer"), // 'admin' ou 'customer'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  durationMinutes: integer("duration_minutes").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const barbers = pgTable("barbers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  photoUrl: text("photo_url"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const barberServices = pgTable(
  "barber_services",
  {
    barberId: uuid("barber_id")
      .notNull()
      .references(() => barbers.id, { onDelete: "cascade" }),
    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.barberId, table.serviceId] }),
  }),
);

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").unique(), // Opcional: liga ao Clerk se usuário estiver logado
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    customerId: uuid("customer_id")
      .notNull()
      .references(() => customers.id, { onDelete: "cascade" }),

    barberId: uuid("barber_id")
      .notNull()
      .references(() => barbers.id, { onDelete: "cascade" }),

    serviceId: uuid("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),

    date: date("date").notNull(),
    time: time("time").notNull(),

    status: text("status").default("pending").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },

  (table) => ({
    // <-- AQUI ESTÁ O UNIQUE CORRETO
    uniqueAppointment: uniqueIndex("unique_appointment").on(
      table.barberId,
      table.date,
      table.time,
    ),
  }),
);

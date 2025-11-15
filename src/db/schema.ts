import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

// Usuários (clientes e barbeiros)
export const usuarios = pgTable("usuarios", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  telefone: varchar("telefone", { length: 20 }),
  tipo: varchar("tipo", { length: 20 }).default("cliente"), // cliente | barbeiro | admin
  criado_em: timestamp("criado_em").defaultNow().notNull(),
});

// Serviços
export const servicos = pgTable("servicos", {
  id: serial("id").primaryKey(),
  nome: varchar("nome", { length: 255 }).notNull(),
  duracao_min: integer("duracao_min").notNull(),
  preco: integer("preco").notNull(),
});

// Agendamentos
export const agendamentos = pgTable("agendamentos", {
  id: serial("id").primaryKey(),
  usuario_id: integer("usuario_id")
    .notNull()
    .references(() => usuarios.id),
  barbeiro_id: integer("barbeiro_id")
    .notNull()
    .references(() => usuarios.id),
  servico_id: integer("servico_id")
    .notNull()
    .references(() => servicos.id),
  data_hora: timestamp("data_hora").notNull(),
  confirmado: boolean("confirmado").default(false),
  criado_em: timestamp("criado_em").defaultNow().notNull(),
});

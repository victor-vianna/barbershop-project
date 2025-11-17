import { pgTable, uuid, text, integer, numeric, timestamp, uniqueIndex, foreignKey, date, time, boolean, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"




export const services = pgTable("services", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	durationMinutes: integer("duration_minutes").notNull(),
	price: numeric("price", { precision: 10, scale:  2 }).notNull(),
	description: text("description"),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	customerId: uuid("customer_id").notNull(),
	barberId: uuid("barber_id").notNull(),
	serviceId: uuid("service_id").notNull(),
	date: date("date").notNull(),
	time: time("time").notNull(),
	status: text("status").default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		uniqueAppointment: uniqueIndex("unique_appointment").using("btree", table.barberId.asc().nullsLast(), table.date.asc().nullsLast(), table.time.asc().nullsLast()),
		appointmentsBarberIdBarbersIdFk: foreignKey({
			columns: [table.barberId],
			foreignColumns: [barbers.id],
			name: "appointments_barber_id_barbers_id_fk"
		}).onDelete("cascade"),
		appointmentsCustomerIdCustomersIdFk: foreignKey({
			columns: [table.customerId],
			foreignColumns: [customers.id],
			name: "appointments_customer_id_customers_id_fk"
		}).onDelete("cascade"),
		appointmentsServiceIdServicesIdFk: foreignKey({
			columns: [table.serviceId],
			foreignColumns: [services.id],
			name: "appointments_service_id_services_id_fk"
		}).onDelete("cascade"),
	}
});

export const customers = pgTable("customers", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	phone: text("phone").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const barbers = pgTable("barbers", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: text("name").notNull(),
	photoUrl: text("photo_url"),
	active: boolean("active").default(true).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const barberServices = pgTable("barber_services", {
	barberId: uuid("barber_id").notNull(),
	serviceId: uuid("service_id").notNull(),
},
(table) => {
	return {
		barberServicesBarberIdBarbersIdFk: foreignKey({
			columns: [table.barberId],
			foreignColumns: [barbers.id],
			name: "barber_services_barber_id_barbers_id_fk"
		}).onDelete("cascade"),
		barberServicesServiceIdServicesIdFk: foreignKey({
			columns: [table.serviceId],
			foreignColumns: [services.id],
			name: "barber_services_service_id_services_id_fk"
		}).onDelete("cascade"),
		barberServicesBarberIdServiceIdPk: primaryKey({ columns: [table.barberId, table.serviceId], name: "barber_services_barber_id_service_id_pk"}),
	}
});
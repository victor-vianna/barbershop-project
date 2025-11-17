import { relations } from "drizzle-orm/relations";
import { barbers, appointments, customers, services, barberServices } from "./schema";

export const appointmentsRelations = relations(appointments, ({one}) => ({
	barber: one(barbers, {
		fields: [appointments.barberId],
		references: [barbers.id]
	}),
	customer: one(customers, {
		fields: [appointments.customerId],
		references: [customers.id]
	}),
	service: one(services, {
		fields: [appointments.serviceId],
		references: [services.id]
	}),
}));

export const barbersRelations = relations(barbers, ({many}) => ({
	appointments: many(appointments),
	barberServices: many(barberServices),
}));

export const customersRelations = relations(customers, ({many}) => ({
	appointments: many(appointments),
}));

export const servicesRelations = relations(services, ({many}) => ({
	appointments: many(appointments),
	barberServices: many(barberServices),
}));

export const barberServicesRelations = relations(barberServices, ({one}) => ({
	barber: one(barbers, {
		fields: [barberServices.barberId],
		references: [barbers.id]
	}),
	service: one(services, {
		fields: [barberServices.serviceId],
		references: [services.id]
	}),
}));
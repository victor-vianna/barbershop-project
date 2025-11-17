import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  appointments,
  services,
  barbers,
  customers,
  barberServices,
} from "~/server/db/schema";
import { eq, and } from "drizzle-orm";

export const appointmentsRouter = createTRPCRouter({
  // Listar todos os serviços
  listServices: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(services);
  }),

  // Listar todos os barbeiros ativos
  listBarbers: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.select().from(barbers).where(eq(barbers.active, true));
  }),

  // Obter horários ocupados para um barbeiro em uma data específica
  getBookedTimes: publicProcedure
    .input(
      z.object({
        date: z.string(), // formato: "YYYY-MM-DD"
        barberId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const bookedAppointments = await ctx.db
        .select({ time: appointments.time })
        .from(appointments)
        .where(
          and(
            eq(appointments.barberId, input.barberId),
            eq(appointments.date, input.date),
            // Não incluir agendamentos cancelados
            eq(appointments.status, "pending"),
          ),
        );

      return bookedAppointments.map((a) => a.time);
    }),

  // Criar novo agendamento
  create: publicProcedure
    .input(
      z.object({
        client_name: z.string().min(1),
        phone: z.string().min(10),
        service: z.string().uuid(), // UUID do serviço
        date: z.string(), // ISO string
        time: z.string(), // formato "HH:MM"
        barber_id: z.string().uuid(),
        user_id: z.string(), // Clerk user ID
        price: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // 1. Extrair apenas a data (YYYY-MM-DD)
      const dateOnly = input.date.split("T")[0];

      // 2. Verificar se o horário já está ocupado
      const existing = await ctx.db
        .select()
        .from(appointments)
        .where(
          and(
            eq(appointments.barberId, input.barber_id),
            eq(appointments.date, dateOnly!),
            eq(appointments.time, input.time),
            eq(appointments.status, "pending"),
          ),
        );

      if (existing.length > 0) {
        throw new Error("Este horário já está ocupado");
      }

      // 3. Criar ou buscar cliente
      let customer = await ctx.db
        .select()
        .from(customers)
        .where(eq(customers.phone, input.phone))
        .limit(1);

      let customerId: string;

      if (customer.length === 0) {
        // Criar novo cliente
        const newCustomer = await ctx.db
          .insert(customers)
          .values({
            name: input.client_name,
            phone: input.phone,
          })
          .returning();

        customerId = newCustomer[0]!.id;
      } else {
        customerId = customer[0]!.id;
      }

      // 4. Criar agendamento
      const appointment = await ctx.db
        .insert(appointments)
        .values({
          customerId: customerId,
          barberId: input.barber_id,
          serviceId: input.service,
          date: dateOnly!,
          time: input.time,
          status: "pending",
        })
        .returning();

      return appointment[0];
    }),

  // Listar agendamentos do usuário
  list: publicProcedure
    .input(
      z.object({
        user_id: z.string(),
        status: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Buscar cliente pelo phone vinculado ao user_id (você precisará ajustar isso)
      // Por enquanto, vamos buscar todos os agendamentos
      const allAppointments = await ctx.db
        .select({
          id: appointments.id,
          date: appointments.date,
          time: appointments.time,
          status: appointments.status,
          barber: {
            id: barbers.id,
            name: barbers.name,
          },
          service: {
            id: services.id,
            name: services.name,
          },
          customer: {
            name: customers.name,
            phone: customers.phone,
          },
        })
        .from(appointments)
        .innerJoin(barbers, eq(appointments.barberId, barbers.id))
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .innerJoin(customers, eq(appointments.customerId, customers.id))
        .orderBy(appointments.date);

      // Mapear para o formato esperado pelo frontend
      return allAppointments.map((a) => ({
        id: a.id,
        date: a.date,
        time: a.time,
        service: a.service.name,
        barber_id: a.barber.name, // <-- Agora retorna o NOME do barbeiro
        status: a.status,
      }));
    }),

  // Atualizar status do agendamento
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        status: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db
        .update(appointments)
        .set({ status: input.status })
        .where(eq(appointments.id, input.id))
        .returning();

      return updated[0];
    }),

  // Obter detalhes de um agendamento específico
  getById: publicProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const appointment = await ctx.db
        .select({
          id: appointments.id,
          date: appointments.date,
          time: appointments.time,
          status: appointments.status,
          barber: {
            id: barbers.id,
            name: barbers.name,
            photoUrl: barbers.photoUrl,
          },
          service: {
            id: services.id,
            name: services.name,
            price: services.price,
            durationMinutes: services.durationMinutes,
          },
          customer: {
            name: customers.name,
            phone: customers.phone,
          },
        })
        .from(appointments)
        .innerJoin(barbers, eq(appointments.barberId, barbers.id))
        .innerJoin(services, eq(appointments.serviceId, services.id))
        .innerJoin(customers, eq(appointments.customerId, customers.id))
        .where(eq(appointments.id, input.id))
        .limit(1);

      return appointment[0] || null;
    }),
});

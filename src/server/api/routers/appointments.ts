import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "~/server/api/trpc";
import { db } from "~/server/db";
import { appointments } from "~/server/db/schema";
import { sql, eq, and, not } from "drizzle-orm";

export const appointmentsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        client_name: z.string().min(1),
        service: z.string().min(1),
        date: z.string().min(1),
        time: z.string().min(1),
        phone: z.string().min(1),
        barber_id: z.string().min(1),
        user_id: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      // Verificar disponibilidade antes de salvar
      const formattedDate = new Date(input.date).toISOString().split('T')[0];
      
      const existingAppointments = await db.select()
        .from(appointments)
        .where(
          and(
            sql`DATE(${appointments.date}) = ${formattedDate}`,
            eq(appointments.time, input.time),
            eq(appointments.barber_id, input.barber_id),
            not(eq(appointments.status, "cancelado"))
          )
        );
      
      if (existingAppointments.length > 0) {
        throw new Error("Este horário já está ocupado. Por favor, escolha outro horário.");
      }
      
      const res = await db.insert(appointments).values({
        ...input,
        status: "pendente",
      });
      return { success: true, res };
    }),

  checkAvailability: publicProcedure
    .input(
      z.object({
        date: z.string().min(1),
        time: z.string().min(1),
        barberId: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const { date, time, barberId } = input;
      
      // Formatamos a data para comparar apenas o dia (YYYY-MM-DD)
      const formattedDate = new Date(date).toISOString().split('T')[0];
      
      const existingAppointments = await db.select()
        .from(appointments)
        .where(
          and(
            sql`DATE(${appointments.date}) = ${formattedDate}`,
            eq(appointments.time, time),
            eq(appointments.barber_id, barberId),
            not(eq(appointments.status, "cancelado"))
          )
        );
      
      return { available: existingAppointments.length === 0 };
    }),

    list: publicProcedure
    .input(
      z.object({
        user_id: z.string().optional(),
        status: z.enum(["todos", "pendente", "concluido", "cancelado"]).optional().default("todos"),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        barberId: z.string().optional(),
      }).optional()
    )
    .query(async ({ input = {} }) => {
      const { status = "todos", startDate, endDate, barberId, user_id } = input;
      
      const conditions = [];
  
      if (status !== "todos") {
        conditions.push(eq(appointments.status, status));
      }
  
      if (startDate) {
        conditions.push(sql`DATE(${appointments.date}) >= ${startDate}`);
      }
  
      if (endDate) {
        conditions.push(sql`DATE(${appointments.date}) <= ${endDate}`);
      }
  
      if (barberId) {
        conditions.push(eq(appointments.barber_id, barberId));
      }
      if (user_id) {
        conditions.push(eq(appointments.user_id, user_id));
      }
  
      const query = db
        .select()
        .from(appointments)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(appointments.date, appointments.time);
  
      const results = await query;
      return results; // ou com tipagem: return results as Appointment[];
    }),
  
    
  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["pendente", "concluido", "cancelado"]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, status } = input;
        
        await db.update(appointments)
          .set({ status })
          .where(eq(appointments.id, id));
          
        return { success: true };
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        throw new Error("Erro interno ao atualizar status");
      }
    }),
});
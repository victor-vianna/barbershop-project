"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { api } from "~/trpc/react";
import { toast } from "~/hooks/use-toast";
import Head from "next/head";
import Link from "next/link";
import { toZonedTime, format } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string | number;
  date: string;
  time: string;
  service: string;
  barber_id: string;
  status: string;
}

const barberNames: Record<string, string> = {
  "1": "Igor",
  "2": "Jhélita",
  "3": "Eliel",
};

const formatDate = (dateStr: string) => {
  const timeZone = "America/Sao_Paulo"; // Fuso fixo Brasil

  const dateWithoutTime = new Date(dateStr + "T12:00:00");
  // Forçamos para meio-dia para evitar qualquer shift de UTC

  const zonedDate = toZonedTime(dateWithoutTime, timeZone);

  return format(zonedDate, "dd/MM/yyyy", { locale: ptBR });
};

const MeusAgendamentos = () => {
  const { user } = useUser();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const { data, isLoading, error, refetch } = api.appointments.list.useQuery(
    {
      user_id: user?.id || "",
      status: "todos", // ou "pendente", etc
    },
    { enabled: !!user?.id },
  );

  const { mutate: cancelar } = api.appointments.updateStatus.useMutation({
    onSuccess: () => {
      toast({
        title: "Agendamento cancelado",
        description: "Seu agendamento foi cancelado com sucesso.",
        variant: "default",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Erro ao cancelar",
        description:
          error.message || "Ocorreu um erro ao cancelar seu agendamento.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (data) {
      const sortedAppointments = data
        .map((item) => ({ ...item, id: String(item.id) }))
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );

      setAppointments(sortedAppointments);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-16">
          <p className="text-center">Carregando agendamentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    toast({
      title: "Erro ao carregar agendamentos",
      description:
        error.message || "Ocorreu um erro ao buscar seus agendamentos.",
      variant: "destructive",
    });
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-900 text-white">
      <Head>
        <title>Meus Agendamentos</title>
      </Head>

      <header className="bg-gradient-to-r from-purple-600 to-pink-500 py-4">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link href="/">
            <h1 className="cursor-pointer text-2xl font-bold">IGOR BARBER</h1>
          </Link>
        </div>
      </header>

      <main className="container mx-auto flex-grow px-4 py-10">
        <h2 className="mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-3xl font-bold text-transparent">
          Meus Agendamentos
        </h2>

        {appointments.length > 0 ? (
          <div className="overflow-x-auto rounded-lg bg-gray-800 p-6 shadow-lg">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-left">Hora</th>
                  <th className="px-4 py-2 text-left">Serviço</th>
                  <th className="px-4 py-2 text-left">Barbeiro</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Ação</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td className="px-4 py-2">
                      {formatDate(appointment.date)}
                    </td>
                    <td className="px-4 py-2">{appointment.time}</td>
                    <td className="px-4 py-2">{appointment.service}</td>
                    <td className="px-4 py-2">
                      {barberNames[appointment.barber_id] || "Desconhecido"}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`rounded px-2 py-1 text-xs ${
                          appointment.status === "cancelado"
                            ? "bg-red-600"
                            : appointment.status === "pendente"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {appointment.status !== "cancelado" && (
                        <button
                          onClick={() =>
                            cancelar({
                              id: Number(appointment.id),
                              status: "cancelado",
                            })
                          }
                          className="rounded bg-red-600 px-3 py-1 transition-colors hover:bg-red-700"
                        >
                          Cancelar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
            <p className="text-center">Nenhum agendamento encontrado.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-10 bg-black py-6">
        <div className="container mx-auto px-4 text-center">
          <p>
            &copy; {new Date().getFullYear()} Igor Barber - Página de
            Agendamentos do Cliente{" "}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MeusAgendamentos;

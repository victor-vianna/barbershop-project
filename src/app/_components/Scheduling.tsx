'use client';

import { api } from '~/trpc/react';
import { useUser } from '@clerk/nextjs';
import Head from 'next/head';
import Link from 'next/link';

export default function MeusAgendamentos() {
  const { user } = useUser();
  const userId = user?.id;

  const { data: agendamentos, isLoading, refetch } = api.appointments.list.useQuery(
    {
      user_id: userId,
      status: "todos", // ou "pendente", etc
    },
    {
      enabled: !!userId,
    }
  );

  const { mutate: cancelar } = api.appointments.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Meus Agendamentos</title>
      </Head>

      <header className="bg-gradient-to-r from-purple-600 to-pink-500 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">IGOR BARBER</h1>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Meus Agendamentos
        </h2>

        {isLoading ? (
          <p className="text-center">Carregando...</p>
        ) : agendamentos?.length ? (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left px-4 py-2">Data</th>
                  <th className="text-left px-4 py-2">Hora</th>
                  <th className="text-left px-4 py-2">Serviço</th>
                  <th className="text-left px-4 py-2">Barbeiro</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Ação</th>
                </tr>
              </thead>
              <tbody>
                {agendamentos.map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-2">{a.date}</td>
                    <td className="px-4 py-2">{a.time}</td>
                    <td className="px-4 py-2">{a.service}</td>
                    <td className="px-4 py-2">{a.barber_id}</td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          a.status === 'cancelado'
                            ? 'bg-red-600'
                            : a.status === 'pendente'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      {a.status !== 'cancelado' && (
                        <button
                          onClick={() => cancelar({ id: a.id, status: 'cancelado' })}
                          className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
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
          <p className="text-center">Nenhum agendamento encontrado.</p>
        )}
      </main>
    </div>
  );
}

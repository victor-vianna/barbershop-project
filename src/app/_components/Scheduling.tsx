// pages/cliente/meus-agendamentos.jsx
"use client"

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function MeusAgendamentos() {
  // Simulação de dados de agendamentos
  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      data: '20/04/2025',
      hora: '14:30',
      servico: 'Corte de Cabelo',
      barbeiro: 'Carlos',
      status: 'confirmado'
    },
    {
      id: 2,
      data: '28/04/2025',
      hora: '10:00',
      servico: 'Barba',
      barbeiro: 'Marcos',
      status: 'confirmado'
    },
    {
      id: 3,
      data: '05/05/2025',
      hora: '16:15',
      servico: 'Corte e Barba',
      barbeiro: 'Felipe',
      status: 'confirmado'
    }
  ]);

  const cancelarAgendamento = (id: any) => {
    setAgendamentos(
      agendamentos.map(agendamento => 
        agendamento.id === id 
          ? { ...agendamento, status: 'cancelado' } 
          : agendamento
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Meus Agendamentos | Igor Barber</title>
      </Head>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold cursor-pointer">IGOR BARBER</h1>
            </Link>
            <nav>
              <Link href="/" className="px-4 py-2 hover:underline">
                Voltar ao Início
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Meus Agendamentos
        </h2>

        <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg shadow-lg p-6">
          {agendamentos.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="py-3 px-4 text-left">Data</th>
                      <th className="py-3 px-4 text-left">Hora</th>
                      <th className="py-3 px-4 text-left">Serviço</th>
                      <th className="py-3 px-4 text-left">Barbeiro</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agendamentos.map((agendamento) => (
                      <tr key={agendamento.id} className="border-b border-gray-700">
                        <td className="py-3 px-4">{agendamento.data}</td>
                        <td className="py-3 px-4">{agendamento.hora}</td>
                        <td className="py-3 px-4">{agendamento.servico}</td>
                        <td className="py-3 px-4">{agendamento.barbeiro}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded text-xs ${
                            agendamento.status === 'confirmado' 
                              ? 'bg-green-500' 
                              : 'bg-red-500'
                          }`}>
                            {agendamento.status === 'confirmado' ? 'Confirmado' : 'Cancelado'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {agendamento.status === 'confirmado' && (
                            <button
                              onClick={() => cancelarAgendamento(agendamento.id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition duration-300"
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

              <div className="mt-6 bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-medium mb-2">Lembrete:</h3>
                <p>O cancelamento pode ser feito até 2 horas antes do horário agendado.</p>
                <p>Para reagendar, faça um novo agendamento na página inicial.</p>
              </div>
            </>
          ) : (
            <div className="text-center py-10">
              <p className="text-xl mb-4">Você não possui agendamentos ativos no momento.</p>
              <Link href="/agendar" className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white font-bold py-2 px-6 rounded-full transition duration-300">
                Agendar Serviço
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-6 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Igor Barber - A melhor barbearia para renovar seu estilo</p>
        </div>
      </footer>
    </div>
  );
}
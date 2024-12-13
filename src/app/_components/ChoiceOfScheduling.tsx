"use client";

import { Clock, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Calendar from "./Calendar";

const ChoiceOfScheduling = () => {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Título */}
        <h1 className="mb-16 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-black text-transparent md:text-5xl">
          Como Deseja Agendar?
        </h1>

        {/* Container de escolha de agendamento */}
        <div className="flex flex-row justify-center gap-8">
          {/* Modo 1 horário disponível */}
          <div className="overflow-riden w-1/3 rounded-xl bg-zinc-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="p-10 text-center">
              <Clock className="mx-auto mb-6 text-purple-500" size={64} />
              <h2 className="mb-4 text-2xl font-bold text-purple-400">
                Horário Disponível
              </h2>
              <p className="mb-6 text-zinc-300">
                Encontre o próximo horário disponível na barbearia
              </p>
              <button
                onClick={() => {
                  <Calendar />;
                }}
                className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-pink-700"
              >
                Buscar Horários
              </button>
            </div>
          </div>

          {/* Modo 2: Escolher Barbeiro */}
          <div className="w-1/3 overflow-hidden rounded-xl bg-zinc-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
            <div className="p-10 text-center">
              <UserCheck className="mx-auto mb-6 text-cyan-500" size={64} />
              <h2 className="mb-4 text-2xl font-bold text-cyan-400">
                Escolher Barbeiro
              </h2>
              <p className="mb-6 text-zinc-300">
                Selecione seu barbeiro preferido para o atendimento
              </p>
              <button
                onClick={() => router.push("/selecao-barbeiro")}
                className="w-full rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 py-3 font-bold text-white transition-all hover:from-cyan-700 hover:to-blue-700"
              >
                Selecionar Barbeiro
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ChoiceOfScheduling;

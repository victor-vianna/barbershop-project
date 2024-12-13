"use client";

import { Calendar, Clock, Scissors } from "lucide-react";
import { useRouter } from "next/navigation";

const BarberHomePage = () => {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Cabeçalho com logo e título */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-black tracking-tight md:text-6xl">
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              IGOR BARBER
            </span>
          </h1>
          <p className="text-xl font-light text-zinc-300 md:text-2xl">
            A MELHOR BARBEARIA PARA RENOVAR SEU ESTILO
          </p>
        </div>

        {/* Sessão de destaque com serviços */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-xl bg-zinc-800 p-6 shadow-lg transition-transform hover:scale-105">
            <Calendar className="mx-auto mb-4 text-purple-500" size={48} />
            <h2 className="mb-2 text-center text-xl font-bold">Agende Agora</h2>
            <p className="text-center text-zinc-300">
              Escolha seu horário com facilidade e rapidez
            </p>
          </div>
          <div className="rounded-xl bg-zinc-800 p-6 shadow-lg transition-transform hover:scale-105">
            <Scissors className="mx-auto mb-4 text-pink-500" size={48} />
            <h2 className="mb-2 text-center text-xl font-bold">
              Cortes Modernos
            </h2>
            <p className="text-center text-zinc-300">
              Profissionais especializados nos últimos estilos e cortes
            </p>
          </div>

          <div className="rounded-xl bg-zinc-800 p-6 shadow-lg transition-transform hover:scale-105">
            <Clock className="mx-auto mb-4 text-cyan-500" size={48} />
            <h2 className="mb-2 text-center text-xl font-bold">
              Tempo Garantido
            </h2>
            <p className="text-center text-zinc-300">
              Atendimento rápido e pontual
            </p>
          </div>
        </div>

        {/* Botão de agendamento */}
        <div className="mt-12 text-center">
          <button
            onClick={() => router.push("/sign-in")}
            className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-3 font-bold text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700 hover:shadow-xl"
          >
            Agendar Horário
          </button>
        </div>
      </div>
    </main>
  );
};

export default BarberHomePage;

"use client";

import { Clock, UserCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import Calendar from "./Calendar";
import { useState } from "react";
import { isWorkingDay } from "../utils/calendar";
import { toast } from "~/hooks/use-toast";
import TimeModal from "./TimeModal";

const ChoiceOfScheduling = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // const [showCalendar, setShowCalendar] = useState(false);
  // const [showTimeModal, setShowTimeModal] = useState(false);

  const handleDateSelect = (selectedDate: string | Date) => {
    let date: Date;

    // Se selectedDate for uma string, converta para Date
    if (typeof selectedDate === "string") {
      date = new Date(selectedDate); // Caso seja string
    } else {
      date = selectedDate; // Caso já seja um Date
    }

    if (!isNaN(date.getTime()) && isWorkingDay(date)) {
      setSelectedDate(date);
      // setShowCalendar(false);
      // setShowTimeModal(true);
    } else {
      toast({
        title: "Desculpe, houve um erro",
        description:
          "Este não é um dia de trabalho do barbeiro. Escolha outro dia. ",
      });
    }
  };

  // const handleConfirmTime = (time: string) => {
  //   console.log(
  //     `Agendamento confirmado para ${selectedDate.toLocaleString("pt-BR")} às ${time}`,
  //   );
  //   setShowTimeModal(false);
  // };
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Título */}
        <h1 className="mb-16 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-black text-transparent md:text-5xl">
          {/* Como Deseja Agendar? */}
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
                onClick={() => router.push("/buscar-horario")}
                className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-pink-700"
              >
                Buscar Horários
              </button>
            </div>
          </div>

          {/* Modo 2: Escolher Barbeiro */}
          {/* <div className="w-1/3 overflow-hidden rounded-xl bg-zinc-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl">
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
          </div> */}
        </div>

        {/* Renderização condicional do Calendário
        {showCalendar && (
          <div className="mt-8 flex justify-center">
            <div className="rounded-full font-bold text-pink-600">
              <Calendar
                onDateSelect={(date) => {
                  handleDateSelect(date);
                }}
              />
            </div>
          </div>
        )}

        {/* Renderização condicional do Modal de horários */}
        {/* {showTimeModal && (
          <TimeModal
            date={selectedDate}
            onConfirm={handleConfirmTime}
            onClose={() => setShowTimeModal(false)}
          />
        )}  */}
      </div>
    </main>
  );
};

export default ChoiceOfScheduling;

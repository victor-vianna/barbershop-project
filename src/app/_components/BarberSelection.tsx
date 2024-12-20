"use client";

import { CircleArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "~/hooks/use-toast";
import { isWorkingDay } from "../utils/calendar";
import Calendar from "./Calendar";
import TimeSlotSelection from "./TimeSlotSelection";

interface Barbeiro {
  name: string;
  especiality: string;
  description: string;
  image: string;
  horariosDisponiveis: string[];
}

interface BarberSelectionProps {
  date: Date;
  onCancel: () => void;
}

const BarberSelection: React.FC<BarberSelectionProps> = ({
  date,
  onCancel,
}) => {
  const router = useRouter();
  const barbeiros: Barbeiro[] = [
    {
      name: "Igor",
      especiality: "Cortes Clássicos",
      description: "Profissional experiente e qualificado",
      image: "/images/barber-igor.jpg",
      horariosDisponiveis: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
      ],
    },
    {
      name: "Jhélita",
      especiality: "Cortes Modernos",
      description: "Profissional detalhista e eficiente",
      image: "/images/barber-jhelita.jpeg",
      horariosDisponiveis: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
      ],
    },
    {
      name: "Eliel",
      especiality: "Cortes afro e Barba",
      description: "Especialização em modelagem de barba",
      image: "/images/barber-eliel.jpeg",
      horariosDisponiveis: [
        "08:00",
        "09:00",
        "10:00",
        "11:00",
        "13:00",
        "14:00",
        "15:00",
        "16:00",
        "17:00",
        "18:00",
        "19:00",
        "20:00",
      ],
    },
  ];

  const [selectedBarbeiro, setSelectedBarbeiro] = useState<Barbeiro | null>(
    null,
  );
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const handleBarbeiroSelect = (barbeiros: Barbeiro) => {
    setSelectedBarbeiro(barbeiros);
    setSelectedHorario(null);
  };

  const handleHorarioSelect = (horario: string) => {
    setSelectedHorario(horario);
  };

  const handleDateSelect = (date: string | Date) => {
    const selectedDate = typeof date === "string" ? new Date(date) : date;

    if (!isNaN(selectedDate.getTime()) && isWorkingDay(selectedDate)) {
      setSelectedDate(selectedDate);
      setShowTimeSlots(true);
    }
  };

  const handleCancelTimeSlots = () => {
    setShowTimeSlots(false);
    setSelectedDate(null);
  };

  const handleConfirmAppointment = () => {
    if (!selectedBarbeiro || !selectedHorario) {
      toast({
        title: "Seleção Incompleta",
        description: "Selecione um barbeiro e um horário",
        variant: "destructive",
      });
    }

    // chamada ao BACK END aqui

    toast({
      title: "Agendamento confirmado!",
      description: `Agendado com ${BarberSelection.name} em ${date.toLocaleDateString("pt-BR")} às ${selectedHorario}`,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Título */}
        <h1 className="mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-black text-transparent md:text-5xl">
          Escolha seu barbeiro
        </h1>

        {/* Container de Barbeiros */}
        <div className="flex flex-row justify-center gap-8">
          {barbeiros.map((barber, index) => (
            <div
              key={index}
              onClick={() => handleBarbeiroSelect(barber)}
              className={`durartion-300 w-1/3 overflow-hidden rounded-xl bg-zinc-800 shadow-lg transition-all hover:scale-105 hover:shadow-2xl ${selectedBarbeiro?.name === barber.name ? "scale-105 border-4 border-purple-500 shadow-2xl" : ""}cursor-pointer`}
            >
              {/* Imagem Vertical */}
              <div className="h-[650px] w-full">
                <Image
                  src={barber.image}
                  alt={barber.name}
                  width={500}
                  height={500}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Informações do Barbeiro */}
              <div className="p-6 text-center">
                <h2 className="mb-2 text-2xl font-bold text-purple-400">
                  {barber.name}
                </h2>
                <h3 className="mb-4 text-lg text-zinc-300">
                  {barber.especiality}
                </h3>
                <p className="mb-6 text-zinc-400">{barber.description}</p>

                <button className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-pink-700">
                  Selecionar Barbeiro
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Container da Data e Horário */}
        {selectedBarbeiro && (
          <div className="container mx-auto px-4 py-16">
            <h1 className="mb-16 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-3xl font-black text-transparent md:text-3xl">
              Escolha uma data disponível de {selectedBarbeiro.name}
            </h1>

            <div className="flex justify-center">
              <Calendar onDateSelect={handleDateSelect} />
            </div>
          </div>
        )}

        <button
          onClick={() => router.push("/escolha-agendamento")}
          className="text=white p-4 transition-colors hover:text-purple-400"
        >
          <CircleArrowLeft size={48} />
        </button>
      </div>
    </main>
  );
};

export default BarberSelection;

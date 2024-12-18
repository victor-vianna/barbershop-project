"use Client";

import { CircleArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "~/hooks/use-toast";

interface Barbeiro {
  id: string;
  name: string;
  especiality: string;
  description: string;
  image: string;
  horariosDisponiveis: string[];
}

interface TimeSlotSelectionProps {
  date: Date;
  onCancel: () => void;
}

const TimeSlotSelection: React.FC<TimeSlotSelectionProps> = ({
  date,
  onCancel,
}) => {
  const router = useRouter();

  // Mock de dados de barbeiros (SUBSTITUIUR BACKEND)
  const barbeiros: Barbeiro[] = [
    {
      id: "1",
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
      id: "2",
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
      id: "3",
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

  const handleBarbeiroSelect = (barbeiro: Barbeiro) => {
    setSelectedBarbeiro(barbeiro);
    setSelectedHorario(null);
  };

  const handleHorarioSelect = (horario: string) => {
    setSelectedHorario(horario);
  };

  const handleConfirmAppointment = () => {
    if (!selectedBarbeiro || !selectedHorario) {
      toast({
        title: "Seleção Incomplerta",
        description: "Selecione um barbeiro e um horário.",
        variant: "destructive",
      });
      return;
    }

    // Aqui fazer chamada para o backend para confirmar o agendamento

    toast({
      title: "Agendamento confirmado!",
      description: `Agendado com ${selectedBarbeiro?.name} em ${date.toLocaleDateString()} às ${selectedHorario}`,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-black text-transparent md:text-5xl">
          Escolha seu barbeiro para {date.toLocaleDateString()}
        </h1>

        {/* Container de barbeiros */}
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
                  alt="{barber.name}"
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
              </div>
            </div>
          ))}
        </div>

        {/* Seleção de Horários */}
        {selectedBarbeiro && (
          <div className="mt-8 rounded-xl bg-zinc-800 p-6 shadow-lg">
            <h3 className="mb-6 text-center text-2xl font-semibold text-purple-400">
              Horários disponíveis para {selectedBarbeiro.name}
            </h3>
            <div className="grid grid-cols-5 justify-center gap-4">
              {selectedBarbeiro.horariosDisponiveis.map((horario) => (
                <button
                  key={horario}
                  onClick={() => handleHorarioSelect(horario)}
                  className={`rounded-lg py-2 transition-all ${selectedHorario === horario ? "bg-purple-700 text-white" : "bg-zinc-600 text-zinc-300"}`}
                >
                  {horario}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Botão de Confirmação */}
        {selectedBarbeiro && selectedHorario && (
          <div className="mt-8 text-center">
            <button
              onClick={handleConfirmAppointment}
              className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-pink-700"
            >
              Confirmar Agendamento
            </button>
          </div>
        )}

        {/* Botão de Voltar */}
        <div className="mt-4 flex justify-start">
          <button
            onClick={() => router.push("/escolha-agendamento")}
            className="p-4 text-white transition-colors hover:text-purple-400"
          >
            <CircleArrowLeft size={48} />
          </button>
        </div>
      </div>
    </main>
  );
};

export default TimeSlotSelection;

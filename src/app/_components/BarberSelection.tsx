"use client"

import React, { useState } from "react";
import { Calendar } from "~/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { addDays, format, isAfter, isBefore, isToday, startOfDay } from "date-fns";
import { toast } from "~/hooks/use-toast";
import DaySelector from "./DaySelector";

interface BarberSelectionProps {
  onClose: () => void;
  onConfirm: (barberId: string, date: Date, time: string) => void;
  setClientName: (name: string) => void;
  setPhoneNumber: (phone: string) => void;
}

const BarberSelection: React.FC<BarberSelectionProps> = ({
  onClose,
  onConfirm,
  setClientName,
  setPhoneNumber,
}) => {
  const [step, setStep] = useState<"barber" | "date" | "time" | "info">("barber");
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const barbers = [
    { id: "1", name: "Igor", image: "/images/barber-igor.jpg" },
    { id: "2", name: "Jhélita", image: "/images/barber-jhelita.jpeg" },
    { id: "3", name: "Eliel", image: "/images/barber-eliel.jpeg" },
  ];

  // Horários disponíveis (poderiam vir da API futuramente)
  const availableTimes = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  // Função para formatar o telefone automaticamente
  const formatPhone = (value: string) => {
    if (!value) return value;
    
    // Remove todos os caracteres não numéricos
    const phoneNumber = value.replace(/\D/g, '');
    
    // Aplica a formatação (00) 00000-0000
    if (phoneNumber.length <= 11) {
      let formatted = phoneNumber;
      if (phoneNumber.length > 2) {
        formatted = `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
      }
      if (phoneNumber.length > 7) {
        formatted = `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
      }
      return formatted;
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhone = formatPhone(e.target.value);
    setPhone(formattedPhone);
  };

  const handleNext = () => {
    if (step === "barber") {
      if (!selectedBarberId) {
        toast({
          title: "Selecione um barbeiro",
          description: "Por favor, escolha um barbeiro para continuar.",
          variant: "destructive",
        });
        return;
      }
      setStep("date");
    } else if (step === "date") {
      if (!selectedDate) {
        toast({
          title: "Selecione uma data",
          description: "Por favor, escolha uma data para continuar.",
          variant: "destructive",
        });
        return;
      }
      setStep("time");
    } else if (step === "time") {
      if (!selectedTime) {
        toast({
          title: "Selecione um horário",
          description: "Por favor, escolha um horário para continuar.",
          variant: "destructive",
        });
        return;
      }
      setStep("info");
    } else if (step === "info") {
      if (!name.trim()) {
        toast({
          title: "Nome obrigatório",
          description: "Por favor, informe seu nome para continuar.",
          variant: "destructive",
        });
        return;
      }
      
      // Validar formato do telefone
      const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
      if (!phoneRegex.test(phone)) {
        toast({
          title: "Telefone inválido",
          description: "Por favor, informe um número de telefone válido no formato (00) 00000-0000.",
          variant: "destructive",
        });
        return;
      }
      
      // Atualizar os estados no componente pai
      setClientName(name);
      setPhoneNumber(phone);
      
      // Confirmar a seleção
      if (selectedBarberId && selectedDate && selectedTime) {
        onConfirm(selectedBarberId, selectedDate, selectedTime);
      }
    }
  };

  const handleBack = () => {
    if (step === "date") setStep("barber");
    else if (step === "time") setStep("date");
    else if (step === "info") setStep("time");
  };

  // Função para desativar datas passadas e fins de semana
  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 30); // Permite agendamentos até 30 dias no futuro
    
    return (
      isBefore(date, today) || // Desativa datas no passado
      isAfter(date, maxDate) || // Desativa datas muito distantes
      date.getDay() === 0 // Desativa domingos (0 = domingo)
    );
  };

  return (
    <div className="space-y-6">
      {step === "barber" && (
        <>
          <h3 className="text-xl font-medium text-purple-400">Escolha seu barbeiro</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className={`cursor-pointer rounded-lg p-4 text-center transition-all ${
                  selectedBarberId === barber.id
                    ? "bg-purple-500 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
                onClick={() => setSelectedBarberId(barber.id)}
              >
                <div className="mx-auto mb-2 h-20 w-20 overflow-hidden rounded-full">
                  <img
                    src={barber.image}
                    alt={barber.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <p className="font-medium">{barber.name}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {step === "date" && (
        <>
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-sm text-zinc-400 hover:text-white"
          >
            ← Voltar para seleção de barbeiro
          </button>
          <h3 className="text-xl font-medium text-purple-400">Escolha uma data</h3>
          <div className="mx-auto max-w-sm">
            <DaySelector
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>
        </>
      )}

      {step === "time" && (
        <>
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-sm text-zinc-400 hover:text-white"
          >
            ← Voltar para seleção de data
          </button>
          <h3 className="text-xl font-medium text-purple-400">
            Escolha um horário para{" "}
            {selectedDate && format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </h3>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {availableTimes.map((time) => (
              <button
                key={time}
                className={`rounded-md py-2 text-center transition-colors ${
                  selectedTime === time
                    ? "bg-purple-500 text-white"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                }`}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </button>
            ))}
          </div>
        </>
      )}

      {step === "info" && (
        <>
          <button
            onClick={handleBack}
            className="mb-4 flex items-center text-sm text-zinc-400 hover:text-white"
          >
            ← Voltar para seleção de horário
          </button>
          <h3 className="text-xl font-medium text-purple-400">Seus dados</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-zinc-300">
                Nome completo
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="Digite seu nome completo"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-zinc-300">
                Telefone
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={handlePhoneChange}
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-white focus:border-purple-500 focus:outline-none"
                placeholder="(00) 00000-0000"
                maxLength={15}
              />
            </div>
          </div>
        </>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNext}
          className="rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700"
        >
          {step === "info" ? "Confirmar" : "Próximo"}
        </button>
      </div>
    </div>
  );
};

export default BarberSelection;
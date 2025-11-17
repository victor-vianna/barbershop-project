"use client";

import React, { useState, useEffect } from "react";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";
import { toast } from "~/hooks/use-toast";
import DaySelector from "./DaySelector";
import { motion } from "framer-motion";
import {
  Clock,
  Calendar as CalendarIcon,
  User,
  Phone,
  ArrowLeft,
  Check,
} from "lucide-react";
import { allPossibleTimes } from "../utils/calendar";
import { api } from "~/trpc/react";

interface BarberSelectionProps {
  onClose: () => void;
  onConfirm: (
    barberId: string,
    barberName: string,
    barberPhoto: string | null,
    date: Date,
    time: string,
  ) => void;
  setClientName: (name: string) => void;
  setPhoneNumber: (phone: string) => void;
  selectedService?: string;
}

const BarberSelection: React.FC<BarberSelectionProps> = ({
  onClose,
  onConfirm,
  setClientName,
  setPhoneNumber,
  selectedService,
}) => {
  const [step, setStep] = useState<"barber" | "date" | "time" | "info">(
    "barber",
  );
  const [selectedBarberId, setSelectedBarberId] = useState<string | null>(null);
  const [selectedBarberName, setSelectedBarberName] = useState<string | null>(
    null,
  );
  const [selectedBarberPhoto, setSelectedBarberPhoto] = useState<string | null>(
    null,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Buscar barbeiros do banco
  const { data: barbers = [], isLoading: loadingBarbers } =
    api.appointments.listBarbers.useQuery();

  // Buscar horários reservados
  const {
    data: bookedTimes = [],
    refetch,
    isLoading: loadingTimes,
  } = api.appointments.getBookedTimes.useQuery(
    {
      date: selectedDate?.toISOString().split("T")[0] || "",
      barberId: selectedBarberId || "",
    },
    { enabled: !!selectedDate && !!selectedBarberId },
  );

  useEffect(() => {
    if (selectedDate && selectedBarberId) {
      refetch();
    }
  }, [selectedDate, selectedBarberId, refetch]);

  const availableTimes = allPossibleTimes.filter((time) => {
    return !bookedTimes.some((bookedTime) => {
      if (typeof bookedTime === "string") {
        return bookedTime.substring(0, 5) === time;
      }
      return false;
    });
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Função para formatar o telefone
  const formatPhone = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/\D/g, "");
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

      const phoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
      if (!phoneRegex.test(phone)) {
        toast({
          title: "Telefone inválido",
          description:
            "Por favor, informe um número de telefone válido no formato (00) 00000-0000.",
          variant: "destructive",
        });
        return;
      }

      setClientName(name);
      setPhoneNumber(phone);

      if (
        selectedBarberId &&
        selectedBarberName &&
        selectedDate &&
        selectedTime
      ) {
        onConfirm(
          selectedBarberId,
          selectedBarberName,
          selectedBarberPhoto,
          selectedDate,
          selectedTime,
        );
      }
    }
  };

  const handleBack = () => {
    if (step === "date") setStep("barber");
    else if (step === "time") setStep("date");
    else if (step === "info") setStep("time");
  };

  const handleSelectBarber = (
    barberId: string,
    barberName: string,
    barberPhoto: string | null,
  ) => {
    setSelectedBarberId(barberId);
    setSelectedBarberName(barberName);
    setSelectedBarberPhoto(barberPhoto);
  };

  const getProgress = () => {
    if (step === "barber") return 25;
    if (step === "date") return 50;
    if (step === "time") return 75;
    return 100;
  };

  if (loadingBarbers) {
    return (
      <div className="text-center text-zinc-400">Carregando barbeiros...</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-zinc-400">
          <span>Barbeiro</span>
          <span>Data</span>
          <span>Horário</span>
          <span>Seus dados</span>
        </div>
        <div className="h-2 w-full rounded-full bg-zinc-800">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600"
            initial={{ width: "25%" }}
            animate={{ width: `${getProgress()}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Summary */}
      {(selectedBarberId || selectedDate || selectedTime) && (
        <div className="mb-4 rounded-lg bg-zinc-800/50 p-3">
          <h4 className="mb-2 text-sm font-medium text-zinc-300">
            Seu agendamento
          </h4>
          <div className="flex flex-wrap gap-3 text-xs">
            {selectedBarberName && (
              <div className="flex items-center gap-1 rounded-full bg-purple-900/30 px-3 py-1 text-purple-300">
                <User size={12} />
                <span>{selectedBarberName}</span>
              </div>
            )}
            {selectedDate && (
              <div className="flex items-center gap-1 rounded-full bg-pink-900/30 px-3 py-1 text-pink-300">
                <CalendarIcon size={12} />
                <span>{format(selectedDate, "dd/MM/yyyy")}</span>
              </div>
            )}
            {selectedTime && (
              <div className="flex items-center gap-1 rounded-full bg-blue-900/30 px-3 py-1 text-blue-300">
                <Clock size={12} />
                <span>{selectedTime}</span>
              </div>
            )}
            {selectedService && (
              <div className="flex items-center gap-1 rounded-full bg-green-900/30 px-3 py-1 text-green-300">
                <Check size={12} />
                <span>{selectedService}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {step === "barber" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.h3
            variants={childVariants}
            className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-medium text-transparent"
          >
            Escolha seu barbeiro
          </motion.h3>
          <motion.div
            variants={childVariants}
            className="grid grid-cols-1 gap-6 sm:grid-cols-3"
          >
            {barbers.map((barber) => (
              <motion.div
                key={barber.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer overflow-hidden rounded-xl shadow-lg transition-all ${
                  selectedBarberId === barber.id
                    ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-zinc-900"
                    : "hover:shadow-purple-500/20"
                }`}
                onClick={() =>
                  handleSelectBarber(barber.id, barber.name, barber.photoUrl)
                }
              >
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={barber.photoUrl || "/images/default-barber.jpg"}
                    alt={barber.name}
                    className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-70" />
                </div>
                <div
                  className={`p-4 ${selectedBarberId === barber.id ? "bg-gradient-to-r from-purple-900/80 to-pink-900/80" : "bg-zinc-800"}`}
                >
                  <h4 className="text-xl font-medium text-white">
                    {barber.name}
                  </h4>
                  {selectedBarberId === barber.id && (
                    <div className="mt-2 rounded-full bg-purple-500/20 px-2 py-1 text-xs text-purple-300">
                      Selecionado
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}

      {step === "date" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-purple-400"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <motion.h3
            variants={childVariants}
            className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-medium text-transparent"
          >
            Escolha uma data
          </motion.h3>
          <motion.div
            variants={childVariants}
            className="mx-auto max-w-lg rounded-xl bg-zinc-800/50 p-6 shadow-lg"
          >
            <DaySelector
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
          </motion.div>
        </motion.div>
      )}

      {step === "time" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-purple-400"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <motion.h3
            variants={childVariants}
            className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-medium text-transparent"
          >
            Escolha um horário para{" "}
            {selectedDate &&
              format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </motion.h3>
          {loadingTimes ? (
            <div className="text-center text-zinc-400">
              Carregando horários...
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {availableTimes.map((time) => {
                const isBooked = bookedTimes.includes(time);
                return (
                  <motion.button
                    key={time}
                    disabled={isBooked}
                    onClick={() => !isBooked && setSelectedTime(time)}
                    className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 transition-all ${
                      selectedTime === time
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : isBooked
                          ? "cursor-not-allowed bg-zinc-700 text-zinc-500"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    }`}
                    whileHover={!isBooked ? { scale: 1.03 } : {}}
                    whileTap={!isBooked ? { scale: 0.97 } : {}}
                  >
                    <Clock size={18} />
                    <span className="text-sm font-medium">{time}</span>
                  </motion.button>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {step === "info" && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <button
            onClick={handleBack}
            className="mb-4 flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-purple-400"
          >
            <ArrowLeft size={16} /> Voltar
          </button>
          <motion.h3
            variants={childVariants}
            className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-2xl font-medium text-transparent"
          >
            Seus dados
          </motion.h3>
          <motion.div
            variants={childVariants}
            className="space-y-4 rounded-xl bg-zinc-800/50 p-6 shadow-lg"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-zinc-300"
              >
                Nome completo
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-10 pr-3 text-white transition-all focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="Digite seu nome completo"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-zinc-300"
              >
                Telefone
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
                  <Phone size={18} />
                </span>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 py-3 pl-10 pr-3 text-white transition-all focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="mt-8 flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 font-medium text-white shadow-lg transition-all hover:from-purple-700 hover:to-pink-700"
        >
          {step === "info" ? "Confirmar Agendamento" : "Próximo"}
        </motion.button>
      </div>
    </div>
  );
};

export default BarberSelection;

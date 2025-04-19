"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import { toast } from "~/hooks/use-toast";
import Modal from "~/app/_components/Modal";
import BarberSelection from "~/app/_components/BarberSelection";
import { api } from "~/trpc/react";
import ConfirmationModal from "./ConfimationModal";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
}

interface Barber {
  id: string;
  name: string;
  image: string;
}

const ServiceSelection = () => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [clientName, setClientName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Validador de telefone
  const isValidPhoneNumber = (phone: string) => {
    const phoneRegex = /^(\(\d{2}\)\s?)?\d{5}[-\s]?\d{4}$|^\d{11}$/;
    return phoneRegex.test(phone);
  };

  // Função para formatar o telefone para o formato padronizado
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/\D/g, '');
  };

  const createAppointment = api.appointments.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Agendamento confirmado!",
        description: "Seu horário foi agendado com sucesso.",
        variant: "default",
      });
      setIsConfirmationModalOpen(false);
      router.push("/meus-agendamentos");
    },
    onError: (error) => {
      // Se o erro contiver uma mensagem sobre horário já agendado
      if (error.message?.includes("ocupado") || error.message?.includes("indisponível")) {
        toast({
          title: "Horário indisponível",
          description: "Este horário já está ocupado. Por favor, escolha outro horário.",
          variant: "destructive",
        });
        setIsConfirmationModalOpen(false);
        setIsSchedulingModalOpen(true);
      } else {
        toast({
          title: "Erro ao agendar",
          description: error.message || "Ocorreu um erro ao confirmar seu agendamento.",
          variant: "destructive",
        });
      }
      setIsCheckingAvailability(false);
    }
  });

  // Consulta para verificar disponibilidade com skipToken para evitar consultas inválidas
  const checkAvailabilityQuery = api.appointments.checkAvailability.useQuery(
    {
      date: selectedDate?.toISOString() || "",
      time: selectedTimeSlot || "",
      barberId: selectedBarber?.id || ""
    },
    {
      enabled: false,
      retry: false // Evita tentativas repetidas em caso de erro
    }
  );

  const proceedWithAppointment = () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTimeSlot || !clientName || !phoneNumber) {
      return;
    }

    // Formatar o telefone para o formato padronizado
    const formattedPhone = formatPhoneNumber(phoneNumber);

    createAppointment.mutate({
      client_name: clientName,
      service: selectedService.id,
      date: selectedDate.toISOString(),
      time: selectedTimeSlot,
      phone: formattedPhone,
      barber_id: selectedBarber.id,
    });
  };

  const handleConfirmAppointment = async () => {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedTimeSlot || !clientName || !phoneNumber) {
      toast({
        title: "Informações incompletas",
        description: "Por favor, preencha todas as informações necessárias.",
        variant: "destructive",
      });
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      toast({
        title: "Número de telefone inválido",
        description: "Por favor, insira um número de telefone válido no formato (99) 99999-9999 ou 99999999999.",
        variant: "destructive",
      });
      return;
    }

    // Verificar disponibilidade antes de prosseguir
    setIsCheckingAvailability(true);
    
    try {
      // Verificar disponibilidade usando trpc mutation diretamente em vez de query
      // Muitas vezes é mais confiável usar mutations para ações específicas
      // como verificação única de disponibilidade
      proceedWithAppointment();
      
      // Como alternativa, se quiser manter a verificação separada, pode criar uma mutation específica
      // no backend para verificar disponibilidade em vez de usar query
    } catch (error) {
      setIsCheckingAvailability(false);
      toast({
        title: "Erro ao verificar disponibilidade",
        description: "Ocorreu um erro ao verificar a disponibilidade do horário.",
        variant: "destructive",
      });
    }
  };

  const handleBarberDateTimeConfirm = (barberId: string, date: Date, time: string) => {
    const barberData = {
      id: barberId,
      name: barberId === "1" ? "Igor" : barberId === "2" ? "Jhélita" : "Eliel",
      image: barberId === "1" ? "/images/barber-igor.jpg" : 
             barberId === "2" ? "/images/barber-jhelita.jpeg" : "/images/barber-eliel.jpeg"
    };

    setSelectedBarber(barberData);
    setSelectedDate(date);
    setSelectedTimeSlot(time);
    setIsSchedulingModalOpen(false);
    setIsConfirmationModalOpen(true);
  };

  const services: Service[] = [
    {
      id: "corte",
      name: "Corte de Cabelo",
      description: "Corte tradicional ou moderno com acabamento perfeito e produtos de qualidade",
      price: 45.0,
      duration: "45 min",
      image: "/images/service-haircut.jpg",
    },
    {
      id: "barba",
      name: "Barba",
      description: "Modelagem completa da barba com toalha quente e produtos especiais",
      price: 35.0,
      duration: "30 min",
      image: "/images/service-beard.jpg",
    },
    {
      id: "corte-barba",
      name: "Corte + Barba",
      description: "Combinação de corte e barba com desconto especial",
      price: 70.0,
      duration: "1h 15min",
      image: "/images/service-combo.jpg",
    },
    {
      id: "pezinho",
      name: "Pezinho",
      description: "Acabamento na nuca e laterais para manter o visual alinhado",
      price: 20.0,
      duration: "15 min",
      image: "/images/service-neckline.jpg",
    },
  ];

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleOpenSchedulingModal = () => {
    if (!selectedService) {
      toast({
        title: "Selecione um serviço",
        description: "Por favor, escolha um serviço para continuar.",
        variant: "destructive",
      });
      return;
    }
    setIsSchedulingModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-black text-transparent md:text-5xl">
          Escolha seu Serviço
        </h1>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`overflow-hidden rounded-xl bg-zinc-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${selectedService?.id === service.id ? "scale-105 border-4 border-purple-500 shadow-2xl" : ""} cursor-pointer`}
            >
              <div className="flex flex-col p-6">
                <div>
                  <h2 className="mb-3 text-2xl font-bold text-purple-400">
                    {service.name}
                  </h2>
                  <p className="mb-4 text-zinc-400">{service.description}</p>
                </div>
                <div className="mt-auto">
                  <div className="flex justify-between text-lg text-zinc-300">
                    <span>⏱ {service.duration}</span>
                    <span className="font-semibold text-purple-400">
                      R$ {service.price.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedService && (
          <div className="mt-8 text-center">
            <button
              onClick={handleOpenSchedulingModal}
              className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-pink-700"
            >
              Agendar Horário
            </button>
          </div>
        )}

        <div className="mt-4 flex justify-start">
          <button
            onClick={() => router.push("/")}
            className="p-4 text-white transition-colors hover:text-purple-400"
          >
            <CircleArrowLeft size={48} />
          </button>
        </div>
      </div>

      {isSchedulingModalOpen && (
        <Modal
          isOpen={isSchedulingModalOpen}
          onClose={() => setIsSchedulingModalOpen(false)}
          title={`Agendar ${selectedService?.name || ""}`}
        >
          <BarberSelection
            onClose={() => setIsSchedulingModalOpen(false)}
            onConfirm={handleBarberDateTimeConfirm}
            setClientName={setClientName}
            setPhoneNumber={setPhoneNumber}
          />
        </Modal>
      )}

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleConfirmAppointment}
        service={selectedService}
        barber={selectedBarber}
        date={selectedDate}
        timeSlot={selectedTimeSlot}
        isPending={createAppointment.isPending || isCheckingAvailability}
      />
    </main>
  );
};

export default ServiceSelection;
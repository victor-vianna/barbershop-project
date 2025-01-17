"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import Image from "next/image";
import { toast } from "~/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
}

const ServiceSelection = () => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Mock de dados dos serviços (SUBSTITUIR PELO BACKEND)
  const services: Service[] = [
    {
      id: "corte",
      name: "Corte de Cabelo",
      description:
        "Corte tradicional ou moderno com acabamento perfeito e produtos de qualidade",
      price: 45.0,
      duration: "45 min",
      image: "/images/service-haircut.jpg",
    },
    {
      id: "barba",
      name: "Barba",
      description:
        "Modelagem completa da barba com toalha quente e produtos especiais",
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
      description:
        "Acabamento na nuca e laterais para manter o visual alinhado",
      price: 20.0,
      duration: "15 min",
      image: "/images/service-neckline.jpg",
    },
  ];

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
  };

  const handleContinue = () => {
    if (!selectedService) {
      toast({
        title: "Selecione um serviço",
        description: "Por favor, escolha um serviço para continuar.",
        variant: "destructive",
      });
      return;
    }

    // Salvar o serviço selecionado (pode ser em um contexto global ou localStorage)
    localStorage.setItem("selectedService", JSON.stringify(selectedService));
    router.push("/escolha-agendamento"); // Redireciona para a seleção de data
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-12 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-black text-transparent md:text-5xl">
          Escolha seu Serviço
        </h1>

        {/* Grid de Serviços */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              className={`overflow-hidden rounded-xl bg-zinc-800 shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${selectedService?.id === service.id ? "scale-105 border-4 border-purple-500 shadow-2xl" : ""} cursor-pointer`}
            >
              {/* Container Flexível para Imagem e Conteúdo */}
              <div className="flex flex-col md:flex-row">
                {/* Imagem do Serviço */}
                <div className="h-48 w-full md:h-64 md:w-1/2">
                  <Image
                    src={service.image}
                    alt={service.name}
                    width={400}
                    height={400}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* Informações do Serviço */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <h2 className="mb-2 text-2xl font-bold text-purple-400">
                      {service.name}
                    </h2>
                    <p className="mb-4 text-zinc-400">{service.description}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-lg text-zinc-300">
                      <span>⏱ {service.duration}</span>
                      <span className="font-semibold text-purple-400">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão de Continuar */}
        {selectedService && (
          <div className="mt-8 text-center">
            <button
              onClick={handleContinue}
              className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 font-bold text-white transition-all hover:from-purple-700 hover:to-pink-700"
            >
              Continuar para Agendamento
            </button>
          </div>
        )}

        {/* Botão de Voltar */}
        <div className="mt-4 flex justify-start">
          <button
            onClick={() => router.push("/")}
            className="p-4 text-white transition-colors hover:text-purple-400"
          >
            <CircleArrowLeft size={48} />
          </button>
        </div>
      </div>
    </main>
  );
};

export default ServiceSelection;

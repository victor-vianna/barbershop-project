import React from 'react';
import Image from 'next/image';
import { formatDate } from '../utils/date';
import Modal from './Modal';
import { CalendarDays, Clock, Loader2, Scissors, User, Check, Calendar } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  service: {
    name: string;
    price: number;
    duration: string;
  } | null;
  barber: {
    name: string;
    image: string;
  } | null;
  date: Date | null;
  timeSlot: string | null;
  isPending: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  service,
  barber,
  date,
  timeSlot,
  isPending,
}) => {
  if (!isOpen || !service || !barber || !date || !timeSlot) return null;

  // Calcular horário de término (baseado na duração do serviço)
  const calculateEndTime = (start: string, duration: string): string => {
    const [hours = 0, minutes = 0] = start.split(':').map(Number);
    let durationMinutes = 0;
  
    // Expressões regulares para capturar "Xh" e "Ymin"
    const hourMatch = duration.match(/(\d+)\s*h/);
    const minMatch = duration.match(/(\d+)\s*min/);
  
    const hoursParsed = parseInt(hourMatch?.[1] ?? '0');
    const minutesParsed = parseInt(minMatch?.[1] ?? '0');
  
    durationMinutes += hoursParsed * 60 + minutesParsed;
  
    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
  
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };
  
  const endTime = calculateEndTime(timeSlot, service.duration);
  const formattedDate = formatDate(date);
  
  // Extrair dia e mês para exibição
  const day = date.getDate();
  const month = date.toLocaleDateString('pt-BR', { month: 'short' });
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Agendamento">
      <div className="space-y-6 p-6">
        {/* Cabeçalho com bordas gradientes */}
        <div className="relative rounded-xl bg-zinc-800 p-1 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 opacity-40" />
          <div className="relative rounded-lg bg-zinc-900 p-4">
            <h3 className="mb-4 text-center text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Detalhes do Agendamento
            </h3>
            
            {/* Cartão do serviço */}
            <div className="mb-6 rounded-lg bg-zinc-800 p-4 shadow-md">
              <div className="mb-3 flex items-center justify-between border-b border-zinc-700 pb-3">
                <div className="flex items-center space-x-2">
                  <Scissors className="h-5 w-5 text-purple-400" />
                  <span className="font-semibold text-white">{service.name}</span>
                </div>
                <span className="rounded-full bg-purple-900/50 px-3 py-1 text-sm font-bold text-purple-300">
                  R$ {service.price.toFixed(2)}
                </span>
              </div>
              
              {/* Barbeiro */}
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-700 flex items-center justify-center">
                  {barber.image ? (
                    <Image
                      src={barber.image}
                      alt={barber.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="h-6 w-6 text-zinc-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-zinc-400">Profissional</p>
                  <p className="font-medium text-white">{barber.name}</p>
                </div>
              </div>
              
              {/* Data e hora */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-12 w-12 flex-col items-center justify-center rounded-lg bg-zinc-900 text-center">
                    <span className="text-xs text-zinc-400">{month}</span>
                    <span className="text-lg font-bold text-white">{day}</span>
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Data</p>
                    <p className="font-medium text-white">{formattedDate}</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-zinc-900">
                    <Clock className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Horário</p>
                    <p className="font-medium text-white">
                      {timeSlot} - {endTime}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resumo e duração */}
            <div className="mb-4 flex items-center justify-between rounded-lg bg-zinc-800/50 p-3">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-zinc-400" />
                <span className="text-sm text-zinc-400">Duração estimada:</span>
              </div>
              <span className="font-medium text-zinc-300">{service.duration}</span>
            </div>
            
            {/* Informação de cancelamento */}
            <div className="mb-4 rounded-lg bg-zinc-800/30 p-3 text-center text-xs text-zinc-400">
              O agendamento pode ser cancelado até 2 horas antes do horário marcado.
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex justify-between space-x-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl bg-zinc-800 px-4 py-3 text-zinc-300 transition-all hover:bg-zinc-700 active:bg-zinc-600 disabled:opacity-50"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-3 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-70 flex"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <Check className="mr-2 h-5 w-5" />
                <span>Confirmar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
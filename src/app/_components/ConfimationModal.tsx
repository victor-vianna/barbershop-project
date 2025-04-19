import React from 'react';
import Image from 'next/image';
import { formatDate } from '../utils/date'; // Você precisará criar esta função
import Modal from './Modal';
import { Loader2 } from 'lucide-react';

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
  
    return `${endHours}:${endMinutes.toString().padStart(2, '0')}`;
  };
  
  const endTime = calculateEndTime(timeSlot, service.duration);
  const formattedDate = formatDate(date);
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Agendamento">
      <div className="space-y-6 p-4">
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-purple-400">Detalhes do Agendamento</h3>
          <div className="space-y-1 text-zinc-300">
            <p>
              <span className="font-semibold">Serviço:</span> {service.name} - R${" "}
              {service.price.toFixed(2)}
            </p>
            <p>
              <span className="font-semibold">Barbeiro:</span> {barber.name}
            </p>
            <p>
              <span className="font-semibold">Data:</span> {formattedDate}
            </p>
            <p>
              <span className="font-semibold">Horário:</span> {timeSlot}
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md bg-zinc-700 px-4 py-2 text-white transition-colors hover:bg-zinc-600"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 font-medium text-white transition-all hover:from-purple-700 hover:to-pink-700 disabled:opacity-70"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirmando...
              </>
            ) : (
              "Confirmar Agendamento"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
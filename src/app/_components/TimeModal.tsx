import React from "react";

interface TimeModalProps {
  date: Date;
  onConfirm: (time: string) => void;
  onClose: () => void;
}

const TimeModal: React.FC<TimeModalProps> = ({ date, onConfirm, onClose }) => {
  const avaliableTimes = [
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
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-slate-300 p-6 shadow-lg sm:p-8">
        <h2 className="mb-4 items-center justify-center text-2xl font-bold text-gray-800">
          Horários Disponíveis
        </h2>
        <p className="mb-4 text-gray-600">{date.toLocaleDateString("pt-BR")}</p>
        <div className="grid grid-cols-3 gap-4">
          {avaliableTimes.map((time) => (
            <button
              key={time}
              className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={() => onConfirm(time)}
            >
              {time}
            </button>
          ))}
        </div>
        <button
          className="mt-4 w-full rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          onClick={onClose}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default TimeModal;

import React from "react";
import { getDaysOfWeek, isWorkingDay } from "../utils/calendar"; // Ajuste o caminho conforme seu projeto

interface DaySelectorProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDate, onSelect }) => {
  const days = getDaysOfWeek();

  return (
    <div className="mx-auto max-w-md py-4">
      <h3 className="mb-4 text-center text-lg font-semibold text-zinc-300">Escolha o dia</h3>
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-7">
        {days.map((day) => {
          const dateObj = new Date(day.fullDate);
          const isSelected =
            selectedDate?.toDateString() === dateObj.toDateString();
          const isDisabled = !isWorkingDay(dateObj);

          return (
            <button
              key={day.fullDate}
              onClick={() => !isDisabled && onSelect(dateObj)}
              disabled={isDisabled}
              className={`
                flex flex-col items-center justify-center rounded-xl px-2 py-3 text-sm transition-all
                ${isSelected ? "bg-purple-600 text-white shadow-md" : "bg-zinc-700 text-zinc-200 hover:bg-purple-500 hover:text-white"}
                ${isDisabled ? "cursor-not-allowed opacity-30 hover:bg-zinc-700 hover:text-zinc-200" : "cursor-pointer"}
              `}
            >
              <span className="font-medium capitalize">{day.dayOfWeek}</span>
              <span className="text-xs">{day.date}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelector;

import React, { useEffect, useRef, useState } from "react";
import { getNextDays, type Day } from "../utils/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate?: Date | null;
}

const Calendar: React.FC<CalendarProps> = ({
  onDateSelect,
  selectedDate: externalSelectedDate,
}) => {
  const [daysOfWeek, setDaysOfWeek] = useState<Day[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    externalSelectedDate || null,
  );
  const [startIndex, setStartIndex] = useState(0);

  const calendarRef = useRef<HTMLDivElement>(null);
  const DAYS_TO_SHOW = 7; // Quantos dias mostrar por vez

  useEffect(() => {
    // Gera os próximos 30 dias úteis
    const days = getNextDays(30);
    setDaysOfWeek(days);
  }, []);

  // Sincroniza com prop externa
  useEffect(() => {
    if (externalSelectedDate) {
      setSelectedDate(externalSelectedDate);
    }
  }, [externalSelectedDate]);

  const handleDateClick = (day: Day) => {
    console.log("Data selecionada:", day.fullDate, day.dateObj);
    setSelectedDate(day.dateObj);
    onDateSelect(day.dateObj);
  };

  const scrollCalendar = (direction: "left" | "right") => {
    if (direction === "left" && startIndex > 0) {
      setStartIndex(Math.max(0, startIndex - DAYS_TO_SHOW));
    } else if (
      direction === "right" &&
      startIndex + DAYS_TO_SHOW < daysOfWeek.length
    ) {
      setStartIndex(
        Math.min(daysOfWeek.length - DAYS_TO_SHOW, startIndex + DAYS_TO_SHOW),
      );
    }
  };

  const isSameDate = (date1: Date | null, date2: Date): boolean => {
    if (!date1) return false;
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  // Dias visíveis no momento
  const visibleDays = daysOfWeek.slice(startIndex, startIndex + DAYS_TO_SHOW);

  return (
    <div className="rounded-lg bg-zinc-900 p-4 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium text-white">Selecione uma data</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scrollCalendar("left")}
            disabled={startIndex === 0}
            className="rounded-full bg-zinc-800 p-2 text-white transition-all hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scrollCalendar("right")}
            disabled={startIndex + DAYS_TO_SHOW >= daysOfWeek.length}
            className="rounded-full bg-zinc-800 p-2 text-white transition-all hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div ref={calendarRef} className="grid grid-cols-7 gap-2">
        {visibleDays.map((day, index) => {
          const isSelected = isSameDate(selectedDate, day.dateObj);
          const isToday = isSameDate(new Date(), day.dateObj);

          return (
            <button
              key={`${day.fullDate}-${index}`}
              className={`group relative rounded-lg px-3 py-4 text-center transition-all duration-300 ${
                isSelected
                  ? "scale-105 bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-lg ring-2 ring-purple-400 ring-offset-2 ring-offset-zinc-900"
                  : isToday
                    ? "bg-zinc-800 text-white ring-2 ring-zinc-600"
                    : "bg-zinc-800 text-zinc-300 hover:scale-105 hover:bg-zinc-700 hover:text-white"
              }`}
              onClick={() => handleDateClick(day)}
            >
              <span className="mb-1 block text-xs font-medium uppercase tracking-wide">
                {day.dayOfWeek}
              </span>
              <span className="block text-lg font-bold">
                {day.dateObj.getDate()}
              </span>
              {isToday && !isSelected && (
                <span className="mt-1 block text-[10px] text-zinc-400">
                  Hoje
                </span>
              )}
              {isSelected && (
                <div className="absolute -bottom-1 left-1/2 h-1 w-8 -translate-x-1/2 rounded-full bg-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Indicador de mais dias */}
      {daysOfWeek.length > DAYS_TO_SHOW && (
        <div className="mt-4 text-center text-xs text-zinc-500">
          Mostrando {startIndex + 1} -{" "}
          {Math.min(startIndex + DAYS_TO_SHOW, daysOfWeek.length)} de{" "}
          {daysOfWeek.length} dias disponíveis
        </div>
      )}
    </div>
  );
};

export default Calendar;

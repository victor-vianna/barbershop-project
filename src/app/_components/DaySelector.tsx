import React, { useState, useEffect } from "react";
import { getDaysOfWeek, getNextDays, isWorkingDay } from "../utils/calendar";

interface DaySelectorProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({ selectedDate, onSelect }) => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [days, setDays] = useState<ReturnType<typeof getDaysOfWeek>>([]);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const maxWeeks = 3; // Navegação até 3 semanas (21 dias)

  useEffect(() => {
    updateCalendarDays();
  }, [currentWeekOffset]);

  const updateCalendarDays = () => {
    // Se estamos na primeira semana (offset 0), usamos getDaysOfWeek
    // caso contrário, usamos getNextDays com o offset adequado
    const newDays = currentWeekOffset === 0 
      ? getDaysOfWeek() 
      : getNextDays(14).slice(currentWeekOffset * 7, (currentWeekOffset * 7) + 14);
    
    setDays(newDays);

    // Atualiza o mês exibido
    if (newDays.length > 0) {
      const firstDay = new Date(newDays[0]!.fullDate);
      setCurrentMonth(
        firstDay.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      );
    }
  };

  const handlePreviousWeek = () => {
    if (currentWeekOffset > 0) {
      setCurrentWeekOffset(currentWeekOffset - 1);
    }
  };

  const handleNextWeek = () => {
    if (currentWeekOffset < maxWeeks - 1) {
      setCurrentWeekOffset(currentWeekOffset + 1);
    }
  };

  const handleDateClick = (dateObj: Date) => {
    if (!isWorkingDay(dateObj)) return;
    onSelect(dateObj);
  };

  return (
    <div className="mx-auto max-w-lg rounded-xl bg-zinc-900 shadow-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-xl font-bold text-white">
          Selecione a data
        </h3>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePreviousWeek}
            disabled={currentWeekOffset === 0}
            className={`p-2 rounded-full transition-all duration-200 ${
              currentWeekOffset === 0 
                ? "text-zinc-600 cursor-not-allowed" 
                : "text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700"
            }`}
            aria-label="Semana anterior"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          
          <div className="text-sm font-medium text-purple-400 capitalize">
            {currentMonth}
          </div>
          
          <button 
            onClick={handleNextWeek}
            disabled={currentWeekOffset >= maxWeeks - 1}
            className={`p-2 rounded-full transition-all duration-200 ${
              currentWeekOffset >= maxWeeks - 1 
                ? "text-zinc-600 cursor-not-allowed" 
                : "text-zinc-300 hover:bg-zinc-800 active:bg-zinc-700"
            }`}
            aria-label="Próxima semana"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
      
      {/* Indicador de semana atual */}
      <div className="flex justify-center mb-4">
        <div className="flex gap-1">
          {[...Array(maxWeeks)].map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-2 rounded-full ${
                i === currentWeekOffset 
                  ? "bg-purple-500" 
                  : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Dias da semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["D", "S", "T", "Q", "Q", "S", "S"].map((day, index) => (
          <div 
            key={index} 
            className="text-center text-xs font-medium text-zinc-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>
      
      {/* Calendário */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dateObj = new Date(day.fullDate);
          const isSelected = selectedDate?.toDateString() === dateObj.toDateString();
          const isDisabled = !isWorkingDay(dateObj);
          const isToday = new Date().toDateString() === dateObj.toDateString();
          
          return (
            <button
              key={day.fullDate}
              onClick={() => handleDateClick(dateObj)}
              disabled={isDisabled}
              className={`
                relative flex flex-col items-center justify-center rounded-lg p-2
                transition-all duration-300 ease-out
                ${isSelected
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg transform scale-105 z-10"
                  : isDisabled
                    ? "bg-zinc-800/40 text-zinc-500"
                    : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:shadow-md"}
                ${isToday && !isSelected ? "ring-1 ring-purple-400" : ""}
              `}
            >
              <span className="text-xs mb-1">{day.dayOfWeek}</span>
              <span className="text-lg font-semibold">{dateObj.getDate()}</span>
              
              {isSelected && (
                <div className="absolute -bottom-1 w-1/2 h-1 bg-white rounded-full opacity-70"></div>
              )}
            </button>
          );
        })}
      </div>
      
      {/* Legenda */}
      <div className="mt-6 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
          <span>Disponível</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-zinc-800/40 mr-2"></div>
          <span>Indisponível</span>
        </div>
        {selectedDate && (
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-white mr-2"></div>
            <span>Selecionado</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaySelector;
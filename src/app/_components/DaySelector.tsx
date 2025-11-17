import React from "react";
import { ptBR } from "date-fns/locale";
import { addDays, isBefore, isAfter, startOfDay } from "date-fns";
import { Calendar } from "~/components/ui/calendar";

interface DaySelectorProps {
  selectedDate: Date | null;
  onSelect: (date: Date | null) => void;
}

const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDate,
  onSelect,
}) => {
  // Função para desativar datas
  const disabledDays = (date: Date) => {
    const today = startOfDay(new Date());
    const maxDate = addDays(today, 30); // Permite agendamentos até 30 dias

    return (
      isBefore(date, today) || // Desativa datas passadas
      isAfter(date, maxDate) || // Desativa datas muito distantes
      date.getDay() === 0 // Desativa domingos
    );
  };

  return (
    <Calendar
      mode="single"
      required={false}
      selected={selectedDate || undefined}
      onSelect={(date) => onSelect(date ?? null)}
      disabled={disabledDays}
      locale={ptBR}
      className="rounded-md border border-zinc-700"
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center text-white",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button:
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-white",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "text-zinc-400 rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-purple-900/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 font-normal text-white hover:bg-purple-900/50 rounded-md transition-colors aria-selected:opacity-100",
        day_selected:
          "bg-purple-600 text-white hover:bg-purple-700 hover:text-white focus:bg-purple-600 focus:text-white",
        day_today: "bg-zinc-800 text-purple-400 font-bold",
        day_outside: "text-zinc-600 opacity-50",
        day_disabled: "text-zinc-600 opacity-30 line-through",
        day_range_middle:
          "aria-selected:bg-purple-900/20 aria-selected:text-white",
        day_hidden: "invisible",
      }}
    />
  );
};

export default DaySelector;

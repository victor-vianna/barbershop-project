"use client";

import { useState } from "react";
import Calendar from "~/app/_components/Calendar";
import TimeSlotSelection from "~/app/_components/TimeSlotSelection";
import { isWorkingDay } from "~/app/utils/calendar";
import { toast } from "~/hooks/use-toast";

const SearchSchedules = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showTimeSlots, setShowTimeSlots] = useState(false);

  const handleDateSelect = (date: string | Date) => {
    const selectedDate = typeof date === "string" ? new Date(date) : date;

    if (!isNaN(selectedDate.getTime()) && isWorkingDay(selectedDate)) {
      setSelectedDate(selectedDate);
      setShowTimeSlots(true);
    } else {
      toast({
        title: "Dia inválido",
        description: "Escolha um dia útil para o agendamento",
        variant: "destructive",
      });
    }
  };

  const handleCancelTimeSlots = () => {
    setShowTimeSlots(false);
    setSelectedDate(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-900 to-zinc-800 text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-16 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-center text-4xl font-black text-transparent md:text-5xl">
          Escolha a melhor data
        </h1>

        <div className="flex justify-center">
          <Calendar onDateSelect={handleDateSelect} />
        </div>

        {selectedDate && showTimeSlots && (
          <TimeSlotSelection
            date={selectedDate}
            onCancel={handleCancelTimeSlots}
          />
        )}
      </div>
    </main>
  );
};

export default SearchSchedules;

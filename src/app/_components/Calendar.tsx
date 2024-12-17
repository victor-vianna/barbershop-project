import React, { useEffect, useRef, useState } from "react";
import { getDaysOfWeek } from "../utils/calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
}

const isSameDate = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

const Calendar: React.FC<CalendarProps> = ({ onDateSelect }) => {
  const [daysOfWeek, setDaysOfWeek] = useState<
    { dayOfWeek: string; date: string; fullDate: string }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDaysOfWeek(getDaysOfWeek);
  }, []);

  const handleDateClick = (date: Date) => {
    console.log("data selecionada:", date);
    setSelectedDate(date);
    onDateSelect(date);
  };

  // const scrollCalendar = (direction: "left" | "right") => {
  //   if (calendarRef.current) {
  //     calendarRef.current.scrollBy({
  //       left: direction === "left" ? -100 : 100,
  //       behavior: "smooth",
  //     });
  //   }
  // };

  return (
    <div className="rounded-lg bg-slate-900 p-4 shadow-md">
      <div className="grid grid-cols-7 gap-2">
        {/* <button
          onClick={() => scrollCalendar("left")}
          className="rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300"
        >
          <ChevronLeft size={20} />
        </button> */}
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            className={`rounded-md px-4 py-2 text-center transition-all duration-300 ${
              isSameDate(day.date, selectedDate.toLocaleDateString("pt-BR"))
                ? "scale-105 bg-blue-500 text-white shadow-lg"
                : "bg-gray200 hover:scale-105 hover:bg-gray-300"
            }`}
            onClick={() => handleDateClick(new Date(day.fullDate))}
          >
            <span className="block font-semibold">{day.dayOfWeek} </span>
            <span className="block">{day.date}</span>
          </button>
        ))}
      </div>
      {/* <button
        onClick={() => scrollCalendar("right")}
        className="rounded-full bg-gray-200 p-2 transition-colors hover:bg-gray-300"
      >
        <ChevronRight size={20} />
      </button> */}
    </div>
  );
};

export default Calendar;

"use client";

import { useEffect, useState } from "react";
import { getDaysOfWeek } from "../utils/calendar";

const Scheduling = () => {
  const [daysOfWeek, setDaysOfWeek] = useState<Day[]>([]);

  useEffect(() => {
    setDaysOfWeek(getDaysOfWeek());
  }, []);

  return (
    <div>
      <h2>Selecione o dia</h2>
      <div className="flex space-x-4">
        {daysOfWeek.map((day, index) => (
          <button
            key={index}
            className={`rounded-md px-4 py-2 ${
              getBarberWorkingDays().includes(day.dayOfWeek)
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {day.dayOfWeek} {day.date}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Scheduling;

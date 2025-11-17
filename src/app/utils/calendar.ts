// ===============================
// Tipagens
// ===============================
export interface Day {
  dayOfWeek: string;
  date: string;
  fullDate: string; // formato "YYYY-MM-DD"
  dateObj: Date; // Objeto Date completo
}

// ===============================
// Configurações de dias
// ===============================
export const getBarberWorkingDays = (): string[] => {
  return ["seg", "ter", "qua", "qui", "sex", "sáb"];
};

export const isWorkingDay = (date: Date): boolean => {
  if (!date || isNaN(date.getTime())) return false;

  const dayOfWeek = date
    .toLocaleDateString("pt-BR", { weekday: "short" })
    .replace(".", "")
    .toLowerCase();

  const workingDays = getBarberWorkingDays();

  // Desabilitar datas passadas
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) return false;

  return workingDays.includes(dayOfWeek);
};

// Nome formatado do mês
export const getCurrentMonthName = (date: Date = new Date()): string => {
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
};

// ===============================
// Gerar dias do calendário (próximos 30 dias úteis)
// ===============================
export function getNextDays(n: number = 30): Day[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const days: Day[] = [];
  let daysAdded = 0;
  let currentDay = 0;

  // Continua adicionando dias até ter n dias úteis
  while (daysAdded < n) {
    const day = new Date(today);
    day.setDate(today.getDate() + currentDay);

    // Verifica se é dia útil (não domingo)
    if (isWorkingDay(day)) {
      days.push({
        dayOfWeek: day
          .toLocaleDateString("pt-BR", { weekday: "short" })
          .replace(".", ""),
        date: `${day.getDate()} de ${day.toLocaleDateString("pt-BR", {
          month: "short",
        })}`,
        fullDate: day.toISOString().split("T")[0]!, // YYYY-MM-DD
        dateObj: new Date(day),
      });
      daysAdded++;
    }

    currentDay++;
  }

  return days;
}

// Função legada mantida para compatibilidade
export const getDaysOfWeek = getNextDays(30);

// ===============================
// Sistema de horários
// ===============================
export const allPossibleTimes = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
];

// Verifica horário comercial
export const isWorkingHours = (time: string): boolean => {
  const [hours] = time.split(":").map(Number);
  return (hours ?? 0) >= 8 && (hours ?? 0) <= 20;
};

// Formata horário para HH:MM
export const formatTime = (time: string): string => time.slice(0, 5);

// Gera slots de horário com intervalo
export const generateTimeSlots = (
  startTime: string,
  endTime: string,
  intervalMinutes: number = 30,
): string[] => {
  const slots: string[] = [];
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin] = endTime.split(":").map(Number);

  let currentMinutes = (startHour ?? 0) * 60 + (startMin ?? 0);
  const endMinutes = (endHour ?? 0) * 60 + (endMin ?? 0);

  while (currentMinutes <= endMinutes) {
    const hours = Math.floor(currentMinutes / 60);
    const minutes = currentMinutes % 60;
    slots.push(
      `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`,
    );
    currentMinutes += intervalMinutes;
  }

  return slots;
};

// Calcula horário final baseado em duração
export const calculateEndTime = (
  startTime: string,
  durationMinutes: number,
): string => {
  const [hours, minutes] = startTime.split(":").map(Number);
  const totalMinutes = (hours ?? 0) * 60 + (minutes ?? 0) + durationMinutes;

  const endHours = Math.floor(totalMinutes / 60);
  const endMinutes = totalMinutes % 60;

  return `${endHours.toString().padStart(2, "0")}:${endMinutes
    .toString()
    .padStart(2, "0")}`;
};

interface Day {
  dayOfWeek: string;
  date: string;
  fullDate: string;
}

// Função para mostrar os dias da semana, tendo como base o calendário do dia atual
export function getDaysOfWeek(): Day[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normaliza o horário para evitar problemas de comparação
  
  // Gera uma grade de calendário de dias iniciando no domingo mais próximo
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Ajusta para domingo
  
  const daysOfWeek = [];
  for (let i = 0; i < 14; i++) { // Mostra 2 semanas para melhor visualização
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    
    daysOfWeek.push({
      dayOfWeek: day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      date: `${day.getDate()} de ${day.toLocaleDateString("pt-BR", { month: "short" })}`,
      fullDate: day.toISOString(),
    });
  }
  return daysOfWeek;
}

// Função para obter os próximos N dias a partir de hoje
export function getNextDays(n: number): Day[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Ajusta para começar no domingo da semana atual para manter a consistência no calendário
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay()); // Ajusta para domingo
  
  const days = [];

  // Gera n dias a partir do domingo atual
  for (let i = 0; i < n; i++) {
    const day = new Date(startOfWeek);
    day.setDate(startOfWeek.getDate() + i);
    
    days.push({
      dayOfWeek: day.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", ""),
      date: `${day.getDate()} de ${day.toLocaleDateString("pt-BR", { month: "short" })}`,
      fullDate: day.toISOString(),
    });
  }

  return days;
}

// Função que mostra os dias de trabalho do barbeiro
export function getBarberWorkingDays(): string[] {
  return ["ter", "qua", "qui", "sex", "sáb"]; // Removi os pontos para consistência
}

// Função para validar uma data selecionada para um cliente sobre ser um dia válido
export function isWorkingDay(date: Date): boolean {
  if (!date || isNaN(date.getTime())) {
    return false;
  }

  const dayOfWeek = date.toLocaleDateString("pt-BR", { weekday: "short" }).replace(".", "");
  const workingDays = getBarberWorkingDays();
  
  // Desabilita datas passadas
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (date < today) return false;
  
  return workingDays.includes(dayOfWeek);
}

// Nova função que ajuda a obter o nome do mês atual
export function getCurrentMonthName(date: Date = new Date()): string {
  return date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

// utils/schedule.ts

export const allPossibleTimes = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export async function getAvailableTimes(date: string, barberId: string) {
  // Fetch horários agendados do banco (ajuste conforme sua API)
  const response = await fetch(`/api/appointments?date=${date}&barberId=${barberId}`);
  const bookedTimes = await response.json(); // ex: ["10:00", "14:00"]

  return allPossibleTimes.filter(time => !bookedTimes.includes(time));
}

interface Day {
  dayOfWeek: string;
  date: string;
  fullDate: string;
}

// Função para mostrar os dias da semana, tendo em base o calendário do dia atual
export function getDaysOfWeek(): {
  dayOfWeek: string;
  date: string;
  fullDate: string;
}[] {
  const today = new Date();
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    daysOfWeek.push({
      dayOfWeek: day.toLocaleDateString("pt-BR", { weekday: "short" }),
      date: `${day.getDate()} de ${day.toLocaleDateString("pt-BR", { month: "short" })}`,
      fullDate: day.toISOString(),
    });
  }
  return daysOfWeek;
}

// Função que mostra os dias de trabalho do barbeiro
export function getBarberWorkingDays(): string[] {
  return ["qua.", "qui.", "sex.", "sáb."];
}

// Função para validar uma data selecionada para um cliente sobre ser um dia válido
export function isWorkingDay(date: Date): boolean {
  if (isNaN(date.getTime())) {
    return false;
  }

  const dayOfWeek = date.toLocaleDateString("pt-BR", { weekday: "short" });
  const workingDays = ["qua.", "qui.", "sex.", "sáb."];
  return workingDays.includes(dayOfWeek);
}

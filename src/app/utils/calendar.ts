interface Day {
  dayOfWeek: string;
  date: string;
}

// Função para mostrar os dias da semana, tendo em base o calendário do dia atual
export function getDaysOfWeek(): Day[] {
  const today = new Date();
  const daysOfWeek = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(today.getTime() + i * 24 * 60 * 60 * 1000);
    daysOfWeek.push({
      dayOfWeek: day.toLocaleDateString("pt-BR", { weekday: "short" }),
      date: `${day.getDate()} de ${day.toLocaleDateString("pt-BR", { month: "short" })}`,
    });
  }
  return daysOfWeek;
}

// Função que mostra os dias de trabalho do barbeiro
export function getBarberWorkingDays(): string[] {
  return ["Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
}

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// Formatar data para exibição (dd/MM/yyyy)
export const formatDate = (date: Date): string => {
  return format(date, "dd/MM/yyyy", { locale: ptBR });
};

// Formatar data para o banco (YYYY-MM-DD)
export const formatDateForDB = (date: Date): string => {
  return format(date, "yyyy-MM-dd");
};

// Formatar data completa (ex: Segunda-feira, 20 de novembro de 2025)
export const formatFullDate = (date: Date): string => {
  return format(date, "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Formatar data curta (ex: 20 de nov)
export const formatShortDate = (date: Date): string => {
  return format(date, "dd 'de' MMM", { locale: ptBR });
};

// Verificar se é hoje
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Verificar se é amanhã
export const isTomorrow = (date: Date): boolean => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return (
    date.getDate() === tomorrow.getDate() &&
    date.getMonth() === tomorrow.getMonth() &&
    date.getFullYear() === tomorrow.getFullYear()
  );
};

// Obter nome do dia da semana
export const getDayName = (date: Date): string => {
  return format(date, "EEEE", { locale: ptBR });
};

// Obter dia do mês
export const getDayOfMonth = (date: Date): number => {
  return date.getDate();
};

// Obter nome do mês
export const getMonthName = (date: Date): string => {
  return format(date, "MMMM", { locale: ptBR });
};

// Obter nome do mês abreviado
export const getShortMonthName = (date: Date): string => {
  return format(date, "MMM", { locale: ptBR });
};

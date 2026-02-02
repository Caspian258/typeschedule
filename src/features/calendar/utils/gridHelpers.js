import { differenceInMinutes, getHours, getMinutes } from 'date-fns';

/**
 * Altura de cada hora en el grid (en píxeles)
 */
const HOUR_HEIGHT = 64;

/**
 * Hora de inicio del grid (5:00 AM)
 */
const GRID_START_HOUR = 5;

/**
 * Calcula el estilo de posición y tamaño para un evento en el grid
 * 
 * @param {Date} startTime - Hora de inicio del evento
 * @param {Date} endTime - Hora de fin del evento
 * @returns {{ top: number, height: number }} Objeto con posición y altura en píxeles
 */
export function calculateEventStyle(startTime, endTime) {
  const startHour = getHours(startTime);
  const startMinute = getMinutes(startTime);
  
  // Calcular offset desde el inicio del grid (5:00 AM)
  const hoursFromGridStart = startHour - GRID_START_HOUR;
  const minutesFromHourStart = startMinute;
  
  // Posición vertical en píxeles
  const top = (hoursFromGridStart * HOUR_HEIGHT) + (minutesFromHourStart / 60 * HOUR_HEIGHT);
  
  // Duración en minutos
  const durationMinutes = differenceInMinutes(endTime, startTime);
  
  // Altura en píxeles
  const height = (durationMinutes / 60) * HOUR_HEIGHT;
  
  return {
    top: Math.max(0, top), // Evitar valores negativos
    height: Math.max(20, height), // Altura mínima de 20px para eventos muy cortos
  };
}

/**
 * Determina si un evento debe renderizarse en un día específico
 * 
 * @param {Date} eventDate - Fecha del evento
 * @param {Date} dayDate - Fecha del día en el grid
 * @returns {boolean} True si el evento pertenece a ese día
 */
export function isEventOnDay(eventDate, dayDate) {
  return (
    eventDate.getDate() === dayDate.getDate() &&
    eventDate.getMonth() === dayDate.getMonth() &&
    eventDate.getFullYear() === dayDate.getFullYear()
  );
}

/**
 * Calcula el índice de columna (0-6) para un evento dado un array de días
 * 
 * @param {Date} eventDate - Fecha del evento
 * @param {Date[]} weekDays - Array de 7 días de la semana
 * @returns {number} Índice de columna o -1 si no está en la semana
 */
export function getEventDayIndex(eventDate, weekDays) {
  return weekDays.findIndex(day => isEventOnDay(eventDate, day));
}

/**
 * Formatea la hora para mostrar en el evento
 * 
 * @param {Date} date - Fecha a formatear
 * @returns {string} Hora formateada (ej: "09:30")
 */
export function formatEventTime(date) {
  const hours = String(getHours(date)).padStart(2, '0');
  const minutes = String(getMinutes(date)).padStart(2, '0');
  return `${hours}:${minutes}`;
}

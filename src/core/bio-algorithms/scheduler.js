import { 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  setHours, 
  setMinutes,
  isWithinInterval,
  addMinutes,
  differenceInMinutes,
  getHours,
  isBefore,
  isAfter
} from 'date-fns';
import { calculateBedtime } from '@/features/profile/services/profileService';

/**
 * Configuración de picos de energía según cronotipo
 */
const PEAK_ENERGY_RANGES = {
  lion: { start: 8, end: 12 },      // 08:00 - 12:00
  bear: { start: 10, end: 14 },     // 10:00 - 14:00
  wolf: { start: 16, end: 21 },     // 16:00 - 21:00
  dolphin: { start: 10, end: 12 },  // 10:00 - 12:00
};

/**
 * Genera un cronograma de estudio automático basado en eventos existentes y perfil del usuario
 * 
 * @param {Array} existingEvents - Eventos ya agendados
 * @param {Object} profile - Perfil del usuario con chronotype, wakeupTime, sleepDuration
 * @param {Date} startDate - Fecha de inicio (por defecto, inicio de semana actual)
 * @returns {Array} Array de eventos de estudio sugeridos
 */
export function generateStudySchedule(existingEvents, profile, startDate = new Date()) {
  if (!profile?.wakeupTime || !profile?.sleepDuration || !profile?.chronotype) {
    console.warn('⚠️ Perfil incompleto para generar sugerencias');
    return [];
  }

  const weekStart = startOfWeek(startDate, { weekStartsOn: 1 }); // Lunes
  const weekEnd = endOfWeek(startDate, { weekStartsOn: 1 }); // Domingo

  // 1. Calcular límites de tiempo activo (wake time y bedtime)
  const { wakeHour, wakeMinute } = parseTime(profile.wakeupTime);
  const bedtimeStr = calculateBedtime(profile.wakeupTime, profile.sleepDuration);
  const { bedHour, bedMinute } = parseTime(bedtimeStr);

  // 2. Obtener rangos de picos de energía
  const peakRange = PEAK_ENERGY_RANGES[profile.chronotype] || PEAK_ENERGY_RANGES.bear;

  // 3. Generar sugerencias para cada día de la semana
  const suggestions = [];
  
  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
    const currentDay = addDays(weekStart, dayOffset);
    
    // Definir límites del día activo
    const dayStart = setMinutes(setHours(currentDay, wakeHour), wakeMinute);
    const dayEnd = setMinutes(setHours(currentDay, bedHour), bedMinute);
    
    // Si bedtime cruza medianoche, ajustar al día siguiente
    const actualDayEnd = bedHour < wakeHour 
      ? setMinutes(setHours(addDays(currentDay, 1), bedHour), bedMinute)
      : dayEnd;

    // 4. Mapear eventos ocupados del día
    const dayEvents = existingEvents.filter(event => {
      const eventDate = new Date(event.startTime);
      return eventDate.getDate() === currentDay.getDate() &&
             eventDate.getMonth() === currentDay.getMonth() &&
             eventDate.getFullYear() === currentDay.getFullYear();
    });

    // 5. Detectar huecos libres
    const freeSlots = findFreeSlots(dayStart, actualDayEnd, dayEvents);

    // 6. Crear sugerencias de estudio para huecos válidos
    freeSlots.forEach(slot => {
      const slotDuration = differenceInMinutes(slot.end, slot.start);
      
      // Solo sugerir si hay al menos 45 minutos libres
      if (slotDuration >= 45) {
        const slotStartHour = getHours(slot.start);
        const isInPeakHour = slotStartHour >= peakRange.start && slotStartHour < peakRange.end;

        // Determinar tipo y duración según si está en pico de energía
        let sessionDuration, sessionTitle, sessionType;
        
        if (isInPeakHour) {
          // Pico de energía: Estudio Profundo (máximo 90 min)
          sessionDuration = Math.min(90, slotDuration);
          sessionTitle = '🧠 Estudio Profundo';
          sessionType = 'study';
        } else {
          // Fuera de pico: Repaso/Tareas (máximo 60 min)
          sessionDuration = Math.min(60, slotDuration);
          sessionTitle = '📖 Repaso / Tareas';
          sessionType = 'study';
        }

        // Crear evento sugerido
        const suggestion = {
          title: sessionTitle,
          type: sessionType,
          startTime: slot.start,
          endTime: addMinutes(slot.start, sessionDuration),
          isFixed: false,
          isTentative: true, // Marca como sugerencia
          description: isInPeakHour 
            ? 'Sesión de estudio intensivo durante tu pico de energía' 
            : 'Repaso ligero de conceptos o tareas pendientes',
        };

        suggestions.push(suggestion);
      }
    });
  }

  if (import.meta.env.DEV) {
    console.log('💡 Sugerencias generadas:', suggestions.length);
  }

  return suggestions;
}

/**
 * Encuentra huecos libres en un día dado los eventos existentes
 * 
 * @param {Date} dayStart - Inicio del día activo
 * @param {Date} dayEnd - Fin del día activo
 * @param {Array} events - Eventos ocupados del día
 * @returns {Array} Array de objetos {start, end} con huecos libres
 */
function findFreeSlots(dayStart, dayEnd, events) {
  // Ordenar eventos por hora de inicio
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.startTime) - new Date(b.startTime)
  );

  const freeSlots = [];
  let currentTime = new Date(dayStart);

  sortedEvents.forEach(event => {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);

    // Si hay espacio antes del siguiente evento
    if (isBefore(currentTime, eventStart)) {
      freeSlots.push({
        start: new Date(currentTime),
        end: new Date(eventStart),
      });
    }

    // Avanzar currentTime al final del evento
    if (isAfter(eventEnd, currentTime)) {
      currentTime = new Date(eventEnd);
    }
  });

  // Agregar hueco final si queda tiempo hasta dayEnd
  if (isBefore(currentTime, dayEnd)) {
    freeSlots.push({
      start: new Date(currentTime),
      end: new Date(dayEnd),
    });
  }

  return freeSlots;
}

/**
 * Parsea un string de hora "HH:MM" a objeto {hour, minute}
 * 
 * @param {string} timeStr - Hora en formato "HH:MM"
 * @returns {Object} {wakeHour, wakeMinute, bedHour, bedMinute}
 */
function parseTime(timeStr) {
  if (!timeStr) return { wakeHour: 7, wakeMinute: 0, bedHour: 7, bedMinute: 0 };
  
  const [hourStr, minuteStr] = timeStr.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  
  return {
    wakeHour: hour,
    wakeMinute: minute,
    bedHour: hour,
    bedMinute: minute,
  };
}

/**
 * Valida que una sesión de estudio no se superponga con eventos existentes
 * 
 * @param {Object} suggestion - Evento sugerido
 * @param {Array} existingEvents - Eventos existentes
 * @returns {boolean} True si no hay conflictos
 */
export function validateSuggestion(suggestion, existingEvents) {
  const suggestionStart = new Date(suggestion.startTime);
  const suggestionEnd = new Date(suggestion.endTime);

  for (const event of existingEvents) {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);

    // Verificar superposición
    const hasOverlap = 
      (suggestionStart >= eventStart && suggestionStart < eventEnd) ||
      (suggestionEnd > eventStart && suggestionEnd <= eventEnd) ||
      (suggestionStart <= eventStart && suggestionEnd >= eventEnd);

    if (hasOverlap) {
      return false;
    }
  }

  return true;
}

/**
 * Estructura de un evento en TimeWeave
 * 
 * @typedef {Object} Event
 * @property {string} id - Identificador único
 * @property {string} title - Título del evento
 * @property {'class' | 'work' | 'study' | 'biological' | 'personal'} type - Tipo de evento
 * @property {Date} startTime - Fecha y hora de inicio
 * @property {Date} endTime - Fecha y hora de fin
 * @property {boolean} isFixed - Si es un bloque fijo (no modificable por el sistema)
 * @property {string} [description] - Descripción opcional
 * @property {boolean} [isRecurring] - Si es un evento recurrente
 */

/**
 * Tipos de eventos disponibles
 */
export const EVENT_TYPES = {
  CLASS: 'class',
  WORK: 'work',
  STUDY: 'study',
  BIOLOGICAL: 'biological',
  PERSONAL: 'personal',
  SUGGESTION: 'suggestion',
};

/**
 * Configuración de estilos por tipo de evento
 */
export const EVENT_STYLES = {
  class: {
    bg: 'bg-blue-100',
    border: 'border-blue-500',
    text: 'text-blue-700',
    icon: '📚',
  },
  work: {
    bg: 'bg-indigo-100',
    border: 'border-indigo-500',
    text: 'text-indigo-700',
    icon: '💼',
  },
  study: {
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    text: 'text-purple-700',
    icon: '🧠',
  },
  biological: {
    bg: 'bg-green-100',
    border: 'border-green-500',
    text: 'text-green-700',
    icon: '🍽️',
  },
  personal: {
    bg: 'bg-amber-100',
    border: 'border-amber-500',
    text: 'text-amber-700',
    icon: '⭐',
  },
  suggestion: {
    bg: 'bg-purple-50',
    border: 'border-purple-400',
    text: 'text-purple-600',
    icon: '💡',
  },
};

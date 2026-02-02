import { startOfWeek, addDays, setHours, setMinutes } from 'date-fns';

/**
 * Genera eventos mock para la semana actual
 * Estos eventos se actualizan automáticamente cada semana
 */
function generateMockEvents() {
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Lunes

  // Helper para crear fechas específicas en la semana
  const createEventDate = (dayOffset, hour, minute = 0) => {
    const date = addDays(weekStart, dayOffset);
    return setMinutes(setHours(date, hour), minute);
  };

  return [
    // Lunes: Clase de Matemáticas
    {
      id: 'evt-001',
      title: 'Matemáticas Avanzadas',
      type: 'class',
      startTime: createEventDate(0, 9, 0), // Lunes 9:00
      endTime: createEventDate(0, 11, 0),   // Lunes 11:00
      isFixed: true,
      description: 'Clase presencial - Edificio A, Aula 301',
    },

    // Lunes: Trabajo en cafetería
    {
      id: 'evt-002',
      title: 'Turno en Cafetería',
      type: 'work',
      startTime: createEventDate(0, 14, 0), // Lunes 14:00
      endTime: createEventDate(0, 18, 0),   // Lunes 18:00
      isFixed: true,
      description: 'Atención al cliente',
    },

    // Martes: Trabajo (más largo)
    {
      id: 'evt-003',
      title: 'Trabajo - Oficina',
      type: 'work',
      startTime: createEventDate(1, 9, 0),  // Martes 9:00
      endTime: createEventDate(1, 17, 0),   // Martes 17:00
      isFixed: true,
      description: 'Jornada completa',
    },

    // Miércoles: Estudio (horario irregular)
    {
      id: 'evt-004',
      title: 'Estudiar para Examen de Física',
      type: 'study',
      startTime: createEventDate(2, 16, 30), // Miércoles 16:30
      endTime: createEventDate(2, 18, 30),   // Miércoles 18:30
      isFixed: false,
      description: 'Repasar capítulos 5-7',
    },

    // Miércoles: Clase tarde
    {
      id: 'evt-005',
      title: 'Laboratorio de Química',
      type: 'class',
      startTime: createEventDate(2, 10, 0), // Miércoles 10:00
      endTime: createEventDate(2, 13, 0),   // Miércoles 13:00
      isFixed: true,
    },

    // Jueves: Comida (evento biológico)
    {
      id: 'evt-006',
      title: 'Almuerzo',
      type: 'biological',
      startTime: createEventDate(3, 14, 0), // Jueves 14:00
      endTime: createEventDate(3, 15, 0),   // Jueves 15:00
      isFixed: true,
      description: 'Tiempo protegido para comer',
    },

    // Viernes: Clase matutina
    {
      id: 'evt-007',
      title: 'Programación Web',
      type: 'class',
      startTime: createEventDate(4, 8, 0),  // Viernes 8:00
      endTime: createEventDate(4, 10, 0),   // Viernes 10:00
      isFixed: true,
    },

    // Viernes: Estudio flexible
    {
      id: 'evt-008',
      title: 'Proyecto Final - Desarrollo',
      type: 'study',
      startTime: createEventDate(4, 15, 0), // Viernes 15:00
      endTime: createEventDate(4, 17, 0),   // Viernes 17:00
      isFixed: false,
    },

    // Sábado: Sesión de estudio larga
    {
      id: 'evt-009',
      title: 'Estudio Intensivo - Parciales',
      type: 'study',
      startTime: createEventDate(5, 10, 0), // Sábado 10:00
      endTime: createEventDate(5, 13, 0),   // Sábado 13:00
      isFixed: false,
      description: 'Preparación para exámenes de la próxima semana',
    },

    // Sábado: Actividad personal
    {
      id: 'evt-010',
      title: 'Gimnasio',
      type: 'personal',
      startTime: createEventDate(5, 17, 0), // Sábado 17:00
      endTime: createEventDate(5, 18, 30),  // Sábado 18:30
      isFixed: false,
      description: 'Rutina de ejercicio',
    },

    // Domingo: Descanso/personal
    {
      id: 'evt-011',
      title: 'Comida Familiar',
      type: 'biological',
      startTime: createEventDate(6, 14, 0), // Domingo 14:00
      endTime: createEventDate(6, 16, 0),   // Domingo 16:00
      isFixed: true,
    },

    // Evento muy corto (para probar renderizado pequeño)
    {
      id: 'evt-012',
      title: 'Check-in con Tutor',
      type: 'personal',
      startTime: createEventDate(1, 12, 0), // Martes 12:00
      endTime: createEventDate(1, 12, 30),  // Martes 12:30
      isFixed: false,
    },
  ];
}

/**
 * Mock events para testing
 * Se regeneran automáticamente con la semana actual
 */
export const mockEvents = generateMockEvents();

export default mockEvents;

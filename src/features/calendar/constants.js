/**
 * Constantes para el calendario
 */

// Altura de cada hora en el grid (en píxeles)
// 64px equivale a h-16 en Tailwind
export const HOUR_HEIGHT = 64;

// Altura de los encabezados de día (en píxeles)
export const HEADER_HEIGHT = 80;

// Offset de calibración vertical para eventos (en píxeles)
// Ajusta este valor para alinear perfectamente los eventos con las líneas del grid
// Positivo = bajar eventos, Negativo = subir eventos
// TIP: Incrementa este número para bajar las tarjetas. Disminuye para subirlas.
export const EVENT_OFFSET_Y = 16;

// Offset de calibración vertical para la línea de tiempo (en píxeles)
// Independiente de EVENT_OFFSET_Y para permitir ajuste fino de la línea roja
// Si la línea está muy abajo, usa un número NEGATIVO (ej. -5, -10)
// Si necesita bajar un poco, usa positivo
export const TIMELINE_OFFSET_Y = -5;

// Número de horas visibles (formato 24h)
export const TOTAL_HOURS = 24;

// Hora de inicio del grid (00:00 en formato 24h)
export const GRID_START_HOUR = 0;

// Ancho de la columna de horas (en píxeles)
export const HOUR_COLUMN_WIDTH = 60;

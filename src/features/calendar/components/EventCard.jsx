import { cn } from '@/lib/utils';
import { EVENT_STYLES } from '@/features/events/types';
import { formatEventTime } from '../utils/gridHelpers';
import { Check, X } from 'lucide-react';

export default function EventCard({ event, style, onConfirm, onDelete, onEdit }) {
  const eventStyle = EVENT_STYLES[event.type] || EVENT_STYLES.personal;
  
  // Determinar si es un evento pequeño (menos de 45 minutos)
  const durationMinutes = (event.endTime - event.startTime) / (1000 * 60);
  const isSmallEvent = durationMinutes < 45;

  // Identificar si es tentativo/sugerencia
  const isTentative = event.isTentative || event.type === 'suggestion';

  // Manejar confirmación de evento tentativo
  const handleConfirm = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    if (onConfirm && event.id) {
      try {
        await onConfirm(event.id);
      } catch (error) {
        console.error('Error al confirmar evento:', error);
      }
    }
  };

  // Manejar eliminación de evento tentativo
  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.nativeEvent) {
      e.nativeEvent.stopImmediatePropagation();
    }
    
    if (onDelete && event.id) {
      try {
        await onDelete(event.id);
      } catch (error) {
        console.error('Error al eliminar evento:', error);
      }
    }
  };

  // Manejar clic en la tarjeta para editar
  const handleCardClick = (e) => {
    // Solo abrir modal de edición si no se hizo clic en un botón
    if (e.target.closest('button')) {
      return;
    }
    if (onEdit) {
      onEdit(event);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className={cn(
        'absolute inset-x-1 rounded-lg border-l-4 shadow-sm z-10',
        'overflow-hidden cursor-pointer transition-all',
        'hover:shadow-md hover:scale-[1.02] hover:z-20',
        eventStyle.bg,
        eventStyle.border,
        isSmallEvent ? 'px-2 py-1' : 'px-3 py-2',
        isTentative && 'border-dashed opacity-80 bg-opacity-50'
      )}
      style={{
        position: 'relative',
        top: `${style.top}px`,
        height: `${style.height}px`,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header con icono y hora */}
        <div className="flex items-center gap-1 min-h-0">
          <span className="text-xs">{eventStyle.icon}</span>
          <span className={cn(
            'font-semibold truncate flex-1',
            isSmallEvent ? 'text-xs' : 'text-sm',
            eventStyle.text
          )}>
            {event.title}
          </span>

          {/* Botones de acción para eventos tentativos (solo si no es pequeño) */}
          {isTentative && !isSmallEvent && (
            <div className="flex items-center gap-1 ml-auto z-50 relative pointer-events-auto">
              <button
                onClick={handleConfirm}
                className="p-1 rounded hover:bg-green-200 hover:scale-110 transition-all cursor-pointer z-50 relative pointer-events-auto"
                title="Confirmar evento"
                type="button"
              >
                <Check className="w-3 h-3 text-green-600 pointer-events-none" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 rounded hover:bg-red-200 hover:scale-110 transition-all cursor-pointer z-50 relative pointer-events-auto"
                title="Eliminar evento"
                type="button"
              >
                <X className="w-3 h-3 text-red-600 pointer-events-none" />
              </button>
            </div>
          )}
        </div>

        {/* Horario (solo si hay espacio) */}
        {!isSmallEvent && (
          <div className={cn('text-xs mt-0.5', eventStyle.text, 'opacity-70')}>
            {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
          </div>
        )}

        {/* Badge de tipo */}
        {!isSmallEvent && (
          <div className="mt-1 flex items-center gap-2">
            {event.isFixed && (
              <span className={cn(
                'inline-block px-1.5 py-0.5 text-xs font-medium rounded',
                eventStyle.text,
                'bg-white/50'
              )}>
                Fijo
              </span>
            )}
            {isTentative && (
              <span className={cn(
                'inline-block px-1.5 py-0.5 text-xs font-medium rounded',
                'bg-amber-100 text-amber-700 border border-amber-300'
              )}>
                💡 Sugerencia
              </span>
            )}
          </div>
        )}
      </div>

      {/* Indicador visual para eventos muy pequeños */}
      {isSmallEvent && (
        <div className="flex items-center justify-between">
          <div className={cn('text-xs', eventStyle.text, 'opacity-60')}>
            {formatEventTime(event.startTime)}
          </div>
          {isTentative && (
            <div className="flex gap-0.5 z-50 relative pointer-events-auto">
              <button
                onClick={handleConfirm}
                className="p-0.5 rounded hover:bg-green-200 hover:scale-110 transition-all cursor-pointer z-50 relative pointer-events-auto"
                title="Confirmar"
                type="button"
              >
                <Check className="w-2.5 h-2.5 text-green-600 pointer-events-none" />
              </button>
              <button
                onClick={handleDelete}
                className="p-0.5 rounded hover:bg-red-200 hover:scale-110 transition-all cursor-pointer z-50 relative pointer-events-auto"
                title="Eliminar"
                type="button"
              >
                <X className="w-2.5 h-2.5 text-red-600 pointer-events-none" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

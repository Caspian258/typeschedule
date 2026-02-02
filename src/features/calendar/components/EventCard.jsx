import { cn } from '@/lib/utils';
import { EVENT_STYLES } from '@/features/events/types';
import { formatEventTime } from '../utils/gridHelpers';

export default function EventCard({ event, style }) {
  const eventStyle = EVENT_STYLES[event.type] || EVENT_STYLES.personal;
  
  // Determinar si es un evento pequeño (menos de 45 minutos)
  const durationMinutes = (event.endTime - event.startTime) / (1000 * 60);
  const isSmallEvent = durationMinutes < 45;

  return (
    <div
      className={cn(
        'absolute inset-x-1 rounded-lg border-l-4 shadow-sm z-10',
        'overflow-hidden cursor-pointer transition-all',
        'hover:shadow-md hover:scale-[1.02] hover:z-20',
        eventStyle.bg,
        eventStyle.border,
        isSmallEvent ? 'px-2 py-1' : 'px-3 py-2'
      )}
      style={{
        top: `${style.top}px`,
        height: `${style.height}px`,
      }}
    >
      <div className="flex flex-col h-full">
        {/* Header con icono y hora */}
        <div className="flex items-center gap-1 min-h-0">
          <span className="text-xs">{eventStyle.icon}</span>
          <span className={cn(
            'font-semibold truncate',
            isSmallEvent ? 'text-xs' : 'text-sm',
            eventStyle.text
          )}>
            {event.title}
          </span>
        </div>

        {/* Horario (solo si hay espacio) */}
        {!isSmallEvent && (
          <div className={cn('text-xs mt-0.5', eventStyle.text, 'opacity-70')}>
            {formatEventTime(event.startTime)} - {formatEventTime(event.endTime)}
          </div>
        )}

        {/* Badge de tipo fijo */}
        {event.isFixed && !isSmallEvent && (
          <div className="mt-1">
            <span className={cn(
              'inline-block px-1.5 py-0.5 text-xs font-medium rounded',
              eventStyle.text,
              'bg-white/50'
            )}>
              Fijo
            </span>
          </div>
        )}
      </div>

      {/* Indicador visual para eventos muy pequeños */}
      {isSmallEvent && (
        <div className={cn('text-xs', eventStyle.text, 'opacity-60')}>
          {formatEventTime(event.startTime)}
        </div>
      )}
    </div>
  );
}

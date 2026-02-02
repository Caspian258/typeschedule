import { 
  startOfWeek, 
  addDays, 
  format, 
  isToday,
  parseISO 
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import EventCard from './EventCard';
import { mockEvents } from '../data/mockEvents';
import { calculateEventStyle, getEventDayIndex } from '../utils/gridHelpers';

export default function WeeklyView() {
  // Generar los 7 días de la semana actual (empezando el lunes)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 1 = lunes
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Generar las horas del día (05:00 - 23:00)
  const hours = Array.from({ length: 19 }, (_, i) => i + 5); // 5 a 23

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header: Navegación de semana */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {format(weekStart, 'd', { locale: es })} - {format(addDays(weekStart, 6), "d 'de' MMMM yyyy", { locale: es })}
          </h2>
          <p className="text-sm text-gray-500">Vista Semanal</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            ← Anterior
          </button>
          <button className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
            Hoy
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            Siguiente →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Grid Container */}
          <div 
            className="grid"
            style={{
              gridTemplateColumns: 'auto repeat(7, 1fr)',
              gridTemplateRows: `auto repeat(${hours.length}, 64px)`,
            }}
          >
            {/* Empty corner cell */}
            <div className="sticky left-0 z-10 bg-gray-50 border-b border-r border-gray-200" />

            {/* Day Headers */}
            {weekDays.map((day, idx) => {
              const isTodayDay = isToday(day);
              return (
                <div
                  key={idx}
                  className={cn(
                    'sticky top-0 z-10 py-4 px-2 text-center border-b border-r border-gray-200',
                    isTodayDay ? 'bg-indigo-50' : 'bg-gray-50'
                  )}
                >
                  <div className={cn(
                    'text-xs font-medium uppercase tracking-wide',
                    isTodayDay ? 'text-indigo-600' : 'text-gray-500'
                  )}>
                    {format(day, 'EEE', { locale: es })}
                  </div>
                  <div className={cn(
                    'text-2xl font-bold mt-1',
                    isTodayDay ? 'text-indigo-600' : 'text-gray-800'
                  )}>
                    {format(day, 'd')}
                  </div>
                  {isTodayDay && (
                    <div className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-indigo-600 text-white rounded-full">
                      Hoy
                    </div>
                  )}
                </div>
              );
            })}

            {/* Time Slots Grid */}
            {hours.map((hour) => (
              <div key={hour} className="contents">
                {/* Hour Label */}
                <div className="sticky left-0 z-10 bg-gray-50 border-r border-b border-gray-200 px-3 py-2 text-right">
                  <span className="text-xs font-medium text-gray-500">
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>

                {/* Day Cells */}
                {weekDays.map((day, dayIdx) => {
                  const isTodayDay = isToday(day);
                  
                  // Filtrar eventos para este día y esta hora
                  const dayEvents = mockEvents.filter(event => {
                    const eventDayIdx = getEventDayIndex(event.startTime, weekDays);
                    return eventDayIdx === dayIdx;
                  });
                  
                  return (
                    <div
                      key={`${hour}-${dayIdx}`}
                      className={cn(
                        'border-r border-b border-gray-200 relative z-0',
                        'hover:bg-indigo-50/30 transition-colors cursor-pointer',
                        isTodayDay && 'bg-indigo-50/10'
                      )}
                    >
                      {/* Renderizar eventos solo en la primera celda del día */}
                      {hour === hours[0] && dayEvents.map(event => {
                        const style = calculateEventStyle(event.startTime, event.endTime);
                        return (
                          <EventCard
                            key={event.id}
                            event={event}
                            style={style}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer con ayuda visual */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          💡 <strong>Próximo paso:</strong> Aquí se renderizarán los eventos (bloques fijos y flexibles)
        </p>
      </div>
    </div>
  );
}

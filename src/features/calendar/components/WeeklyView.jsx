import { 
  startOfWeek, 
  addDays, 
  format, 
  isToday,
  parseISO,
  setHours,
  setMinutes
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import EventCard from './EventCard';
import { calculateEventStyle, getEventDayIndex } from '../utils/gridHelpers';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { calculateBedtime } from '@/features/profile/services/profileService';

export default function WeeklyView({ events = [] }) {
  const { profile } = useProfile();
  
  // Generar los 7 días de la semana actual (empezando el lunes)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 1 = lunes
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Generar las horas del día (05:00 - 23:00)
  const hours = Array.from({ length: 19 }, (_, i) => i + 5); // 5 a 23

  // Calcular zonas de sueño si el perfil está configurado
  const sleepZones = profile?.wakeupTime && profile?.sleepDuration
    ? calculateSleepZones(profile.wakeupTime, profile.sleepDuration, hours)
    : null;

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
                  
                  // Filtrar eventos para este día
                  const dayEvents = events.filter(event => {
                    const eventDayIdx = getEventDayIndex(event.startTime, weekDays);
                    return eventDayIdx === dayIdx;
                  });
                  
                  const isSleepZone = sleepZones?.includes(hour);
                  
                  return (
                    <div
                      key={`${hour}-${dayIdx}`}
                      className={cn(
                        'border-r border-b border-gray-200 relative z-0',
                        'hover:bg-indigo-50/30 transition-colors cursor-pointer',
                        isTodayDay && 'bg-indigo-50/10',
                        isSleepZone && 'bg-slate-800/5 border-slate-300'
                      )}
                    >
                      {/* Indicador de zona de sueño */}
                      {isSleepZone && hour === sleepZones[0] && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
                          <div className="bg-slate-700/80 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            💤 Sueño Recomendado
                          </div>
                        </div>
                      )}
                      
                      {/* Pattern de rayas para zona de sueño */}
                      {isSleepZone && (
                        <div 
                          className="absolute inset-0 z-0 pointer-events-none"
                          style={{
                            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(51, 65, 85, 0.03) 10px, rgba(51, 65, 85, 0.03) 20px)'
                          }}
                        />
                      )}
                      
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
          📊 <strong>{events.length}</strong> eventos esta semana
          {sleepZones && ' | 💤 Zonas de sueño configuradas'}
          {' | 💡 Click en "Nuevo Evento" para agregar más'}
        </p>
      </div>
    </div>
  );
}

/**
 * Calcula qué horas del grid corresponden a la zona de sueño
 */
function calculateSleepZones(wakeupTime, sleepDuration, hours) {
  const bedtime = calculateBedtime(wakeupTime, sleepDuration);
  if (!bedtime) return null;

  const [bedHour] = bedtime.split(':').map(Number);
  const [wakeHour] = wakeupTime.split(':').map(Number);

  const sleepHours = [];

  // Si el sueño cruza la medianoche (ej: 23:00 a 07:00)
  if (bedHour > wakeHour || bedHour < 5) {
    // Desde bedHour hasta 23:59
    for (let h = bedHour; h <= 23; h++) {
      if (hours.includes(h)) sleepHours.push(h);
    }
    // Desde 00:00 hasta wakeHour
    for (let h = 5; h < wakeHour; h++) {
      if (hours.includes(h)) sleepHours.push(h);
    }
  } else {
    // Sueño normal en el mismo día
    for (let h = bedHour; h < wakeHour; h++) {
      if (hours.includes(h)) sleepHours.push(h);
    }
  }

  return sleepHours;
}

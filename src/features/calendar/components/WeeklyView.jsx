import { 
  startOfWeek, 
  addDays, 
  format, 
  isToday,
  parseISO,
  setHours,
  setMinutes
} from 'date-fns';
import { useEffect, useRef } from 'react';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import EventCard from './EventCard';
import CurrentTimeLine from './CurrentTimeLine';
import { calculateEventStyle, getEventDayIndex } from '../utils/gridHelpers';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { calculateBedtime } from '@/features/profile/services/profileService';
import { useEvents } from '@/features/events/hooks/useEvents';
import { HOUR_HEIGHT, HEADER_HEIGHT } from '../constants';

export default function WeeklyView({ events = [], onEditEvent }) {
  const { profile } = useProfile();
  const { confirmSuggestion, deleteEvent } = useEvents();
  const scrollContainerRef = useRef(null);
  
  // Generar los 7 días de la semana actual (empezando el lunes)
  const today = new Date();
  const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // 1 = lunes
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Generar las horas del día (00:00 - 23:00) - Formato 24h
  const hours = Array.from({ length: 24 }, (_, i) => i); // 0 a 23

  // Calcular zonas de sueño si el perfil está configurado
  const sleepZones = profile?.wakeupTime && profile?.sleepDuration
    ? calculateSleepZones(profile.wakeupTime, profile.sleepDuration, hours)
    : null;

  // Calcular picos de energía según cronotipo
  const peakEnergyZones = profile?.chronotype
    ? getPeakEnergyHours(profile.chronotype)
    : null;

  // Scroll automático a la hora de despertar (o 7:00 por defecto)
  useEffect(() => {
    if (scrollContainerRef.current) {
      const wakeHour = profile?.wakeupTime 
        ? parseInt(profile.wakeupTime.split(':')[0]) 
        : 7;
      
      // Calcular posición de scroll usando HOUR_HEIGHT
      const scrollPosition = wakeHour * HOUR_HEIGHT;
      
      // Scroll suave a la posición
      scrollContainerRef.current.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, []); // Solo al montar el componente

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
      <div className="overflow-y-auto overflow-x-hidden h-[calc(100vh-200px)] w-full scroll-smooth" ref={scrollContainerRef}>
        {/* Contenedor con position relative para capas absolutas */}
        <div className="w-full relative">
          
          {/* HEADER STICKY (z-40) - Alineado con Grid del Body */}
          <div 
            className="sticky top-0 z-40 grid w-full bg-white border-b border-gray-200 shadow-sm"
            style={{
              gridTemplateColumns: '60px repeat(7, minmax(0, 1fr))',
              height: `${HEADER_HEIGHT}px`,
            }}
          >
            {/* Esquina superior izquierda (60px) - Zona Horaria */}
            <div className="bg-gray-50 border-r border-gray-200 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-400">GMT-5</span>
            </div>

            {/* Columnas de Días */}
            {weekDays.map((day, idx) => {
              const isTodayDay = isToday(day);
              const dayNumber = format(day, 'd');
              const dayName = format(day, 'EEE', { locale: es }).toUpperCase();
              
              return (
                <div
                  key={idx}
                  className={cn(
                    'h-full px-3 py-2 flex flex-col items-center justify-center gap-2 border-r border-gray-200 transition-colors',
                    isTodayDay ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50/50'
                  )}
                >
                  {/* Nombre del día */}
                  <span className={cn(
                    'text-xs font-semibold uppercase tracking-wider',
                    isTodayDay ? 'text-blue-600' : 'text-gray-500'
                  )}>
                    {dayName}
                  </span>
                  
                  {/* Número del día con indicador circular para "Hoy" */}
                  <div className={cn(
                    'flex items-center justify-center w-10 h-10 rounded-full text-xl transition-all',
                    isTodayDay ? 'bg-blue-600 text-white shadow-md font-medium' : 'text-gray-900 font-light'
                  )}>
                    {dayNumber}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Segunda fila: Columna de horas + Columnas de días con CSS Background Grid */}
          <div className="grid w-full" style={{
            gridTemplateColumns: '60px repeat(7, minmax(0, 1fr))',
            gridTemplateRows: '1fr',
          }}>
            {/* Columna de Horas (Izquierda) */}
            <div className="sticky left-0 z-10 bg-gray-50 border-r border-gray-200">
              {hours.map((hour) => (
                <div 
                  key={hour}
                  className="flex items-start justify-end px-3 pt-2 border-b border-gray-200"
                  style={{ height: `${HOUR_HEIGHT}px` }}
                >
                  <span className="text-xs font-medium text-gray-500">
                    {String(hour).padStart(2, '0')}:00
                  </span>
                </div>
              ))}
            </div>

            {/* Columnas de Días (CAPA 0 - Base) */}
            {weekDays.map((day, dayIdx) => {
              const isTodayDay = isToday(day);
              
              return (
                <div
                  key={dayIdx}
                  className={cn(
                    'relative border-r border-gray-200 pointer-events-none',
                    isTodayDay && 'bg-indigo-50/10'
                  )}
                  style={{
                    height: `${hours.length * HOUR_HEIGHT}px`,
                  }}
                >
                  {/* Capa de Líneas (Grid Background) - z-0 */}
                  <div 
                    className="absolute left-0 right-0 z-0 pointer-events-none"
                    style={{
                      top: 0,
                      height: '100%',
                      backgroundImage: 'linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)',
                      backgroundSize: `100% ${HOUR_HEIGHT}px`,
                      backgroundPosition: '0 0',
                    }}
                  />

                  {/* CAPA 1: Zonas de Sueño y Energía (z-10) */}
                  {hours.map((hour) => {
                    const isSleepZone = sleepZones?.includes(hour);
                    const isPeakEnergy = peakEnergyZones?.includes(hour);
                    
                    if (!isSleepZone && !isPeakEnergy) return null;
                    
                    return (
                      <div
                        key={hour}
                        className={cn(
                          'absolute left-0 right-0 z-10 pointer-events-none',
                          isSleepZone && 'bg-slate-800/5',
                          isPeakEnergy && !isSleepZone && 'bg-amber-50/40'
                        )}
                        style={{
                          top: `${hour * HOUR_HEIGHT}px`,
                          height: `${HOUR_HEIGHT}px`,
                        }}
                      >
                        {/* Indicador de zona de sueño */}
                        {isSleepZone && hour === sleepZones[0] && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-slate-700/80 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                              💤 Sueño Recomendado
                            </div>
                          </div>
                        )}
                        
                        {/* Indicador de pico de energía */}
                        {isPeakEnergy && !isSleepZone && hour === peakEnergyZones[0] && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="bg-amber-500/90 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                              ⚡ Pico de Energía
                            </div>
                          </div>
                        )}
                        
                        {/* Pattern de rayas para zona de sueño */}
                        {isSleepZone && (
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(51, 65, 85, 0.03) 10px, rgba(51, 65, 85, 0.03) 20px)'
                            }}
                          />
                        )}
                        
                        {/* Pattern sutil para zona de energía */}
                        {isPeakEnergy && !isSleepZone && (
                          <div 
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 15px, rgba(251, 191, 36, 0.05) 15px, rgba(251, 191, 36, 0.05) 30px)'
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* CAPA 2: Línea de Tiempo Actual (z-30) */}
          <CurrentTimeLine />

          {/* CAPA 3: Eventos (z-20) - Con pointer-events-auto */}
          <div className="absolute pointer-events-none" style={{ 
            top: `${HOUR_HEIGHT}px`, 
            left: '60px',
            right: 0,
            height: `${hours.length * HOUR_HEIGHT}px`,
          }}>
            {events.map(event => {
              const dayIdx = getEventDayIndex(event.startTime, weekDays);
              if (dayIdx === -1) return null;

              const style = calculateEventStyle(event.startTime, event.endTime);

              return (
                <div
                  key={event.id}
                  className="absolute pointer-events-auto z-20"
                  style={{
                    left: `calc(${dayIdx} * (100% / 7))`,
                    width: `calc(100% / 7)`,
                    top: `${style.top}px`,
                    height: `${style.height}px`,
                  }}
                >
                  <EventCard
                    event={event}
                    style={{ top: 0, height: style.height }}
                    onConfirm={confirmSuggestion}
                    onDelete={deleteEvent}
                    onEdit={onEditEvent}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer con ayuda visual */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          📊 <strong>{events.length}</strong> eventos esta semana
          {sleepZones && ' | 💤 Zonas de sueño configuradas'}
          {peakEnergyZones && ' | ⚡ Picos de energía visualizados'}
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
  if (bedHour > wakeHour) {
    // Desde bedHour hasta 23:59
    for (let h = bedHour; h <= 23; h++) {
      if (hours.includes(h)) sleepHours.push(h);
    }
    // Desde 00:00 hasta wakeHour
    for (let h = 0; h < wakeHour; h++) {
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

/**
 * Obtiene las horas de pico de energía según el cronotipo
 */
function getPeakEnergyHours(chronotype) {
  const peakRanges = {
    lion: [8, 9, 10, 11],      // 08:00 - 12:00
    bear: [10, 11, 12, 13],    // 10:00 - 14:00
    wolf: [16, 17, 18, 19, 20], // 16:00 - 21:00
    dolphin: [10, 11],          // 10:00 - 12:00
  };

  return peakRanges[chronotype] || null;
}

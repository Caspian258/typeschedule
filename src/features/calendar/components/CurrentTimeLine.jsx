import { useState, useEffect } from 'react';
import { HOUR_HEIGHT, HEADER_HEIGHT, TIMELINE_OFFSET_Y } from '../constants';

/**
 * Componente que muestra una línea roja indicando la hora actual en el calendario
 */
export default function CurrentTimeLine() {
  const [position, setPosition] = useState(0);

  const calculatePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    // Calcular posición en píxeles usando la constante HOUR_HEIGHT + TIMELINE_OFFSET_Y
    // Fórmula: (hours * HOUR_HEIGHT) + ((minutes / 60) * HOUR_HEIGHT) + TIMELINE_OFFSET_Y
    const positionInPixels = (hours * HOUR_HEIGHT) + ((minutes / 60) * HOUR_HEIGHT) + TIMELINE_OFFSET_Y;
    
    return positionInPixels;
  };

  useEffect(() => {
    // Calcular posición inicial
    setPosition(calculatePosition());

    // Actualizar cada minuto
    const interval = setInterval(() => {
      setPosition(calculatePosition());
    }, 60000); // 60 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="absolute z-30 pointer-events-none"
      style={{
        top: `${position + HEADER_HEIGHT}px`, // Compensar header de días
        left: '60px', // Después de la columna de horas
        right: 0,
        width: 'calc(100% - 60px)',
      }}
    >
      {/* Círculo indicador */}
      <div className="absolute -left-1.5 -top-1.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md" />
      
      {/* Línea horizontal */}
      <div className="h-0.5 bg-red-500 shadow-md" />
      
      {/* Hora actual */}
      <div className="absolute -top-2.5 left-4 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-md">
        {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  );
}

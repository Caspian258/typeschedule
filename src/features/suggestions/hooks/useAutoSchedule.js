import { useState, useCallback } from 'react';
import { useEvents } from '@/features/events/hooks/useEvents';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { generateStudySchedule } from '@/core/bio-algorithms/scheduler';

/**
 * Hook para generación automática de horarios de estudio
 * 
 * @returns {Object} { generateSuggestions, loading, error, suggestions }
 */
export function useAutoSchedule() {
  const { events, createEvent } = useEvents();
  const { profile } = useProfile();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  /**
   * Genera y guarda sugerencias de estudio automático
   */
  const generateSuggestions = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Validar que exista perfil
      if (!profile?.chronotype || !profile?.wakeupTime || !profile?.sleepDuration) {
        throw new Error('Por favor configura tu perfil antes de auto-agendar');
      }

      // Generar sugerencias usando el algoritmo
      const newSuggestions = generateStudySchedule(events, profile);

      if (newSuggestions.length === 0) {
        setError('No se encontraron huecos disponibles para agendar estudio');
        setLoading(false);
        return { success: false, count: 0 };
      }

      // Guardar cada sugerencia en Firestore
      const savedSuggestions = [];
      for (const suggestion of newSuggestions) {
        try {
          await createEvent(suggestion);
          savedSuggestions.push(suggestion);
        } catch (err) {
          console.error('Error al guardar sugerencia:', err);
        }
      }

      setSuggestions(savedSuggestions);
      setLoading(false);

      if (import.meta.env.DEV) {
        console.log('✅ Sugerencias guardadas:', savedSuggestions.length);
      }

      return { 
        success: true, 
        count: savedSuggestions.length 
      };
    } catch (err) {
      console.error('❌ Error al generar sugerencias:', err);
      setError(err.message || 'Error al generar sugerencias');
      setLoading(false);
      return { success: false, count: 0 };
    }
  }, [events, profile, createEvent]);

  /**
   * Limpia las sugerencias sin confirmar
   */
  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setError(null);
  }, []);

  return {
    generateSuggestions,
    clearSuggestions,
    loading,
    error,
    suggestions,
  };
}

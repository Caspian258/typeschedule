import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { 
  addEvent, 
  subscribeToUserEvents, 
  validateEventData,
  deleteEvent as deleteEventService,
  updateEvent as updateEventService
} from '../services/eventsService';

/**
 * Custom Hook para gestionar eventos del usuario
 * Proporciona suscripción en tiempo real y funciones CRUD
 */
export function useEvents() {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Suscribirse a eventos en tiempo real
  useEffect(() => {
    if (!user?.uid) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Suscripción a Firestore
    const unsubscribe = subscribeToUserEvents(
      user.uid,
      (updatedEvents, err) => {
        if (err) {
          setError(err.message || 'Error al cargar eventos');
          setEvents([]);
        } else {
          setEvents(updatedEvents);
          setError(null);
        }
        setLoading(false);
      }
    );

    // Cleanup al desmontar
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user?.uid]);

  /**
   * Crea un nuevo evento
   */
  const createEvent = async (eventData) => {
    try {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      // Validar datos
      const validation = validateEventData(eventData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      setError(null);
      const eventId = await addEvent(eventData, user.uid);
      
      return eventId;
    } catch (err) {
      const errorMessage = err.message || 'Error al crear evento';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Elimina un evento
   */
  const deleteEvent = async (eventId) => {
    try {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      setError(null);
      await deleteEventService(eventId);
    } catch (err) {
      const errorMessage = err.message || 'Error al eliminar evento';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Actualiza un evento existente
   */
  const updateEvent = async (eventId, updates) => {
    try {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      setError(null);
      await updateEventService(eventId, updates);
    } catch (err) {
      const errorMessage = err.message || 'Error al actualizar evento';
      setError(errorMessage);
      throw err;
    }
  };

  /**
   * Confirma una sugerencia convirtiéndola en evento real
   */
  const confirmSuggestion = async (eventId) => {
    try {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      setError(null);
      await updateEventService(eventId, {
        isTentative: false,
        type: 'study',
        status: 'confirmed',
        isFixed: true
      });

      if (import.meta.env.DEV) {
        console.log('✅ Sugerencia confirmada:', eventId);
      }
    } catch (err) {
      const errorMessage = err.message || 'Error al confirmar sugerencia';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    createEvent,
    deleteEvent,
    updateEvent,
    confirmSuggestion,
  };
}

export default useEvents;

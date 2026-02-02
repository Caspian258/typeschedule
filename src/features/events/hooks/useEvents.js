import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { addEvent, subscribeToUserEvents, validateEventData } from '../services/eventsService';

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

  return {
    events,
    loading,
    error,
    createEvent,
  };
}

export default useEvents;

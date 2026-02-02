import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  where,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';

/**
 * Convierte un Timestamp de Firestore a Date de JavaScript
 */
const timestampToDate = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

/**
 * Convierte un Date de JavaScript a Timestamp de Firestore
 */
const dateToTimestamp = (date) => {
  if (!date) return null;
  return Timestamp.fromDate(date instanceof Date ? date : new Date(date));
};

/**
 * Crea un nuevo evento en Firestore
 * 
 * @param {Object} eventData - Datos del evento
 * @param {string} userId - ID del usuario propietario
 * @returns {Promise<string>} ID del documento creado
 */
export async function addEvent(eventData, userId) {
  try {
    // Convertir fechas a Timestamps de Firestore
    const eventToSave = {
      ...eventData,
      userId,
      startTime: dateToTimestamp(eventData.startTime),
      endTime: dateToTimestamp(eventData.endTime),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, 'events'), eventToSave);
    
    if (import.meta.env.DEV) {
      console.log('✅ Evento creado:', docRef.id);
    }
    
    return docRef.id;
  } catch (error) {
    console.error('❌ Error al crear evento:', error);
    throw error;
  }
}

/**
 * Suscripción en tiempo real a los eventos del usuario
 * 
 * @param {string} userId - ID del usuario
 * @param {Function} callback - Función que se ejecuta con los eventos actualizados
 * @returns {Function} Función para cancelar la suscripción
 */
export function subscribeToUserEvents(userId, callback) {
  if (!userId) {
    console.warn('⚠️ No se puede suscribir sin userId');
    return () => {};
  }

  // Query para obtener eventos del usuario
  // Nota: El ordenamiento se hace en el cliente hasta que se cree el índice compuesto
  const q = query(
    collection(db, 'events'),
    where('userId', '==', userId)
    // orderBy('startTime', 'asc') // Comentado temporalmente - requiere índice
  );

  // Escuchar cambios en tiempo real
  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const events = snapshot.docs.map(doc => {
        const data = doc.data();
        
        // Convertir Timestamps a Date objects
        return {
          id: doc.id,
          ...data,
          startTime: timestampToDate(data.startTime),
          endTime: timestampToDate(data.endTime),
          createdAt: timestampToDate(data.createdAt),
          updatedAt: timestampToDate(data.updatedAt),
        };
      });

      // Ordenar en el cliente (temporal hasta que se cree el índice)
      events.sort((a, b) => a.startTime - b.startTime);

      if (import.meta.env.DEV) {
        console.log('📅 Eventos actualizados:', events.length);
      }

      callback(events);
    },
    (error) => {
      console.error('❌ Error en suscripción de eventos:', error);
      callback([], error);
    }
  );

  return unsubscribe;
}

/**
 * Valida los datos de un evento antes de guardarlo
 */
export function validateEventData(eventData) {
  const errors = [];

  if (!eventData.title || eventData.title.trim() === '') {
    errors.push('El título es obligatorio');
  }

  if (!eventData.type) {
    errors.push('El tipo de evento es obligatorio');
  }

  if (!eventData.startTime || !eventData.endTime) {
    errors.push('Las fechas de inicio y fin son obligatorias');
  }

  if (eventData.startTime && eventData.endTime) {
    if (eventData.endTime <= eventData.startTime) {
      errors.push('La hora de fin debe ser posterior a la hora de inicio');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Elimina un evento de Firestore
 * 
 * @param {string} eventId - ID del evento a eliminar
 * @returns {Promise<void>}
 */
export async function deleteEvent(eventId) {
  try {
    await deleteDoc(doc(db, 'events', eventId));
    
    if (import.meta.env.DEV) {
      console.log('✅ Evento eliminado:', eventId);
    }
  } catch (error) {
    console.error('❌ Error al eliminar evento:', error);
    throw error;
  }
}

/**
 * Actualiza un evento existente en Firestore
 * 
 * @param {string} eventId - ID del evento a actualizar
 * @param {Object} updates - Datos a actualizar
 * @returns {Promise<void>}
 */
export async function updateEvent(eventId, updates) {
  try {
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    // Convertir fechas si están presentes
    if (updates.startTime) {
      updateData.startTime = dateToTimestamp(updates.startTime);
    }
    if (updates.endTime) {
      updateData.endTime = dateToTimestamp(updates.endTime);
    }

    await updateDoc(doc(db, 'events', eventId), updateData);
    
    if (import.meta.env.DEV) {
      console.log('✅ Evento actualizado:', eventId);
    }
  } catch (error) {
    console.error('❌ Error al actualizar evento:', error);
    throw error;
  }
}

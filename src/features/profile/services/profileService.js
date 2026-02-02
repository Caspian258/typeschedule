import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

/**
 * Obtiene el perfil de usuario desde Firestore
 * 
 * @param {string} userId - ID del usuario
 * @returns {Promise<Object|null>} Datos del perfil o null si no existe
 */
export async function getUserProfile(userId) {
  try {
    if (!userId) {
      throw new Error('userId es requerido');
    }

    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      
      if (import.meta.env.DEV) {
        console.log('✅ Perfil cargado:', data);
      }
      
      return {
        id: docSnap.id,
        ...data,
      };
    } else {
      if (import.meta.env.DEV) {
        console.log('ℹ️ No existe perfil para este usuario');
      }
      return null;
    }
  } catch (error) {
    console.error('❌ Error al obtener perfil:', error);
    throw error;
  }
}

/**
 * Actualiza o crea el perfil de usuario en Firestore
 * 
 * @param {string} userId - ID del usuario
 * @param {Object} profileData - Datos del perfil a guardar
 * @returns {Promise<void>}
 */
export async function updateUserProfile(userId, profileData) {
  try {
    if (!userId) {
      throw new Error('userId es requerido');
    }

    const docRef = doc(db, 'users', userId);
    
    // Usar merge: true para no sobreescribir otros campos
    await setDoc(
      docRef,
      {
        ...profileData,
        updatedAt: new Date(),
      },
      { merge: true }
    );

    if (import.meta.env.DEV) {
      console.log('✅ Perfil actualizado:', profileData);
    }
  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    throw error;
  }
}

/**
 * Configuraciones de cronotipos con sus características
 */
export const CHRONOTYPE_CONFIG = {
  lion: {
    label: 'León 🦁',
    description: 'Madrugador extremo',
    peakHours: '08:00 - 12:00',
    traits: 'Despierta temprano naturalmente, máxima energía en la mañana',
    color: 'amber',
    bgClass: 'bg-amber-50',
    borderClass: 'border-amber-500',
    textClass: 'text-amber-700',
  },
  bear: {
    label: 'Oso 🐻',
    description: 'Ritmo solar (50% de la población)',
    peakHours: '10:00 - 14:00',
    traits: 'Sigue el ritmo del sol, energía equilibrada durante el día',
    color: 'purple',
    bgClass: 'bg-purple-50',
    borderClass: 'border-purple-500',
    textClass: 'text-purple-700',
  },
  wolf: {
    label: 'Lobo 🐺',
    description: 'Nocturno / Vespertino',
    peakHours: '16:00 - 21:00',
    traits: 'Difícil despertar temprano, creativo en la noche',
    color: 'blue',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-500',
    textClass: 'text-blue-700',
  },
  dolphin: {
    label: 'Delfín 🐬',
    description: 'Sueño ligero / Irregular',
    peakHours: '15:00 - 21:00',
    traits: 'Sueño fragmentado, sensible al entorno, ansioso',
    color: 'green',
    bgClass: 'bg-green-50',
    borderClass: 'border-green-500',
    textClass: 'text-green-700',
  },
};

/**
 * Opciones de duración de sueño (basado en ciclos de 90 min)
 */
export const SLEEP_DURATION_OPTIONS = [
  { value: 7.5, label: '7.5 horas (5 ciclos)', description: 'Mínimo recomendado' },
  { value: 9, label: '9 horas (6 ciclos)', description: 'Óptimo para recuperación' },
];

/**
 * Calcula la hora ideal para dormir basado en hora de despertar y duración
 * 
 * @param {string} wakeupTime - Hora de despertar en formato "HH:MM"
 * @param {number} sleepDuration - Duración en horas (7.5 o 9)
 * @returns {string} Hora de dormir en formato "HH:MM"
 */
export function calculateBedtime(wakeupTime, sleepDuration) {
  if (!wakeupTime || !sleepDuration) return null;

  const [hours, minutes] = wakeupTime.split(':').map(Number);
  
  // Crear fecha con la hora de despertar
  const wakeDate = new Date();
  wakeDate.setHours(hours, minutes, 0, 0);
  
  // Restar la duración del sueño (en milisegundos)
  const sleepMs = sleepDuration * 60 * 60 * 1000;
  const bedDate = new Date(wakeDate.getTime() - sleepMs);
  
  // Formatear a HH:MM
  const bedHours = String(bedDate.getHours()).padStart(2, '0');
  const bedMinutes = String(bedDate.getMinutes()).padStart(2, '0');
  
  return `${bedHours}:${bedMinutes}`;
}

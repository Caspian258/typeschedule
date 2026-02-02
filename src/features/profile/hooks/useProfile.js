import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/profileService';

/**
 * Custom Hook para gestionar el perfil del usuario
 */
export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar perfil al montar o cuando cambie el usuario
  useEffect(() => {
    if (!user?.uid) {
      setProfile(null);
      setLoading(false);
      return;
    }

    loadProfile();
  }, [user?.uid]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserProfile(user.uid);
      setProfile(data);
    } catch (err) {
      setError(err.message || 'Error al cargar perfil');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Actualiza el perfil del usuario
   */
  const saveProfile = async (profileData) => {
    try {
      if (!user?.uid) {
        throw new Error('Usuario no autenticado');
      }

      setError(null);
      await updateUserProfile(user.uid, profileData);
      
      // Actualizar estado local
      setProfile({ ...profile, ...profileData });
      
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Error al guardar perfil';
      setError(errorMessage);
      throw err;
    }
  };

  return {
    profile,
    loading,
    error,
    saveProfile,
    refreshProfile: loadProfile,
  };
}

export default useProfile;

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut 
} from 'firebase/auth';
import { auth } from '@/services/firebase/config';

// Crear el contexto
const AuthContext = createContext({});

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

// Provider del contexto
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Escuchar cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
      
      if (import.meta.env.DEV) {
        console.log('👤 Auth State:', currentUser ? currentUser.email : 'No autenticado');
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  // Login con Google
  const loginWithGoogle = async () => {
    try {
      setError(null);
      const provider = new GoogleAuthProvider();
      
      // Configuración adicional del provider (opcional)
      provider.setCustomParameters({
        prompt: 'select_account', // Forzar selección de cuenta
      });

      const result = await signInWithPopup(auth, provider);
      
      if (import.meta.env.DEV) {
        console.log('✅ Login exitoso:', result.user.email);
      }
      
      return result.user;
    } catch (error) {
      console.error('❌ Error en login:', error);
      
      // Manejo de errores específicos
      let errorMessage = 'Error al iniciar sesión';
      
      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'Popup cerrado. Intenta nuevamente.';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'Popup bloqueado por el navegador. Permite popups para este sitio.';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'Solicitud cancelada.';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      setError(null);
      await signOut(auth);
      
      if (import.meta.env.DEV) {
        console.log('👋 Logout exitoso');
      }
    } catch (error) {
      console.error('❌ Error en logout:', error);
      setError('Error al cerrar sesión');
      throw error;
    }
  };

  const value = {
    user,
    isLoading,
    error,
    loginWithGoogle,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

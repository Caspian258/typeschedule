import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { Calendar, Brain, Clock, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const { loginWithGoogle, error: authError } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      // La redirección se manejará automáticamente por el App.jsx
      navigate('/calendar');
    } catch (error) {
      console.error('Error en login:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-slide-up">
        {/* Logo y Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl">
              <Clock className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-800">
            TimeWeave
          </h1>
          <p className="text-gray-500">
            Optimización Biológica para Estudiantes
          </p>
        </div>

        {/* Features destacados */}
        <div className="grid grid-cols-3 gap-3 py-4">
          <div className="text-center">
            <div className="bg-blue-50 p-3 rounded-xl mb-2 mx-auto w-fit">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-xs text-gray-600">Calendario Inteligente</p>
          </div>
          <div className="text-center">
            <div className="bg-purple-50 p-3 rounded-xl mb-2 mx-auto w-fit">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Cronotipos</p>
          </div>
          <div className="text-center">
            <div className="bg-pink-50 p-3 rounded-xl mb-2 mx-auto w-fit">
              <Sparkles className="w-6 h-6 text-pink-600" />
            </div>
            <p className="text-xs text-gray-600">IA Sugerencias</p>
          </div>
        </div>

        {/* Google Sign In Button */}
        <div className="space-y-3">
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                <span>Conectando...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continuar con Google</span>
              </>
            )}
          </button>

          {/* Error message */}
          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{authError}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad
          </p>
        </div>

        {/* Version Badge */}
        <div className="text-center">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
            MVP v1.0 - Fase 1
          </span>
        </div>
      </div>
    </div>
  );
}

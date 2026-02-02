import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth/context/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { 
  CHRONOTYPE_CONFIG, 
  SLEEP_DURATION_OPTIONS,
  calculateBedtime 
} from '../services/profileService';
import { Brain, Clock, Moon, Save, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, loading, error, saveProfile } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    chronotype: 'bear',
    wakeupTime: '07:00',
    sleepDuration: 7.5,
  });

  // Cargar datos del perfil existente
  useEffect(() => {
    if (profile) {
      setFormData({
        chronotype: profile.chronotype || 'bear',
        wakeupTime: profile.wakeupTime || '07:00',
        sleepDuration: profile.sleepDuration || 7.5,
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setSaveSuccess(false);
      
      await saveProfile({
        chronotype: formData.chronotype,
        wakeupTime: formData.wakeupTime,
        sleepDuration: formData.sleepDuration,
      });
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error al guardar:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const bedtime = calculateBedtime(formData.wakeupTime, formData.sleepDuration);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">Configuración de Perfil</h1>
        <p className="text-gray-500">
          Personaliza tu experiencia basada en tu ritmo biológico
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <img 
            src={user?.photoURL || 'https://via.placeholder.com/80'} 
            alt="Avatar" 
            className="w-20 h-20 rounded-full border-4 border-white/30"
          />
          <div>
            <h2 className="text-2xl font-bold">{user?.displayName || 'Usuario'}</h2>
            <p className="text-indigo-100">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 animate-slide-up">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700 font-medium">¡Perfil actualizado correctamente!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">⚠️ {error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cronotipo Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-800">Tu Cronotipo</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(CHRONOTYPE_CONFIG).map(([key, config]) => (
              <label
                key={key}
                className={cn(
                  'relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all',
                  formData.chronotype === key
                    ? `${config.borderClass} ${config.bgClass}`
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                )}
              >
                <input
                  type="radio"
                  name="chronotype"
                  value={key}
                  checked={formData.chronotype === key}
                  onChange={(e) => setFormData({ ...formData, chronotype: e.target.value })}
                  className="absolute top-4 right-4"
                />
                
                <div className="space-y-2">
                  <div className="text-lg font-bold text-gray-800">
                    {config.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {config.description}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    🕐 Pico: {config.peakHours}
                  </div>
                  <div className="text-xs text-gray-500">
                    {config.traits}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Sleep Schedule Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-6 h-6 text-indigo-600" />
            <h3 className="text-xl font-bold text-gray-800">Horario de Sueño</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Hora de despertar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⏰ Hora habitual de despertar
              </label>
              <input
                type="time"
                value={formData.wakeupTime}
                onChange={(e) => setFormData({ ...formData, wakeupTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                required
              />
            </div>

            {/* Duración del sueño */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                💤 Duración de sueño (ciclos de 90 min)
              </label>
              <select
                value={formData.sleepDuration}
                onChange={(e) => setFormData({ ...formData, sleepDuration: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              >
                {SLEEP_DURATION_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Cálculo automático de bedtime */}
          {bedtime && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <div className="flex items-center gap-3">
                <Moon className="w-8 h-8 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-600">Hora recomendada para dormir:</p>
                  <p className="text-2xl font-bold text-indigo-700">{bedtime}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Basado en ciclos de 90 minutos para despertar fresco
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Guardando...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>Guardar Configuración</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Footer */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-sm text-amber-700">
          💡 <strong>Tip:</strong> Esta configuración se usará para calcular tus "zonas de sueño" 
          en el calendario y optimizar sugerencias de estudio según tu cronotipo.
        </p>
      </div>
    </div>
  );
}

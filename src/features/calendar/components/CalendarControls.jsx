import { Sparkles, Loader2 } from 'lucide-react';
import { useAutoSchedule } from '@/features/suggestions/hooks/useAutoSchedule';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function CalendarControls() {
  const { generateSuggestions, loading, error } = useAutoSchedule();
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);

  const handleAutoSchedule = async () => {
    const result = await generateSuggestions();
    
    if (result.success) {
      setGeneratedCount(result.count);
      setShowSuccess(true);
      
      // Ocultar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="relative">
      {/* Botón principal de auto-agendado */}
      <button
        onClick={handleAutoSchedule}
        disabled={loading}
        className={cn(
          'flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all shadow-sm font-medium',
          loading 
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 hover:shadow-md'
        )}
        title="Genera automáticamente sesiones de estudio en tus huecos libres"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Generando...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            <span>⚡ Auto-Agendar</span>
          </>
        )}
      </button>

      {/* Toast de éxito (posición absoluta) */}
      {showSuccess && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-green-50 border border-green-200 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 duration-300 z-50 whitespace-nowrap">
          <p className="text-sm text-green-700 font-medium">
            ✅ {generatedCount} sesiones generadas
          </p>
        </div>
      )}

      {/* Toast de error (posición absoluta) */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 border border-red-200 rounded-lg shadow-lg z-50 min-w-max">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      )}
    </div>
  );
}

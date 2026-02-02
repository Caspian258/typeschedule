import { Plus } from 'lucide-react';
import WeeklyView from '../components/WeeklyView';

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Calendario</h1>
          <p className="text-gray-500 mt-1">
            Vista semanal con bloques fijos y flexibles
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nuevo Evento</span>
        </button>
      </div>

      {/* Weekly Calendar View */}
      <WeeklyView />

      {/* Info Banner */}
      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <p className="text-sm text-indigo-700">
          <strong>Fase 1 (MVP):</strong> F1.3 - Vista de Calendario Semanal | 
          Click en cualquier celda para crear eventos (próximamente)
        </p>
      </div>
    </div>
  );
}

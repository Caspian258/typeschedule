import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EVENT_STYLES } from '@/features/events/types';
import { startOfWeek, addDays, setHours, setMinutes, format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function AddEventModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    type: 'study',
    dayOfWeek: 1, // 0 = Domingo, 1 = Lunes
    startTime: '09:00',
    endTime: '10:00',
    isFixed: true,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const eventTypes = [
    { value: 'class', label: '📚 Clase' },
    { value: 'work', label: '💼 Trabajo' },
    { value: 'study', label: '🧠 Estudio' },
    { value: 'biological', label: '🍽️ Biológico (Comida/Descanso)' },
    { value: 'personal', label: '⭐ Personal' },
  ];

  const daysOfWeek = [
    { value: 1, label: 'Lunes' },
    { value: 2, label: 'Martes' },
    { value: 3, label: 'Miércoles' },
    { value: 4, label: 'Jueves' },
    { value: 5, label: 'Viernes' },
    { value: 6, label: 'Sábado' },
    { value: 0, label: 'Domingo' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validaciones básicas
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('La hora de fin debe ser posterior a la hora de inicio');
      return;
    }

    try {
      setIsSaving(true);

      // Calcular la fecha real del evento para esta semana
      const today = new Date();
      const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Lunes
      const eventDate = addDays(weekStart, formData.dayOfWeek === 0 ? 6 : formData.dayOfWeek - 1);

      // Parsear horas
      const [startHour, startMinute] = formData.startTime.split(':').map(Number);
      const [endHour, endMinute] = formData.endTime.split(':').map(Number);

      // Crear fechas completas
      const startTime = setMinutes(setHours(eventDate, startHour), startMinute);
      const endTime = setMinutes(setHours(eventDate, endHour), endMinute);

      // Construir objeto de evento
      const eventData = {
        title: formData.title.trim(),
        type: formData.type,
        startTime,
        endTime,
        isFixed: formData.isFixed,
        description: '',
        isRecurring: false,
      };

      await onSave(eventData);

      // Reset form y cerrar
      setFormData({
        title: '',
        type: 'study',
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:00',
        isFixed: true,
      });
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar el evento');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Nuevo Evento</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título del Evento *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Clase de Matemáticas"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          {/* Tipo de Evento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Evento *
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Día de la Semana */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Día de la Semana *
            </label>
            <select
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {daysOfWeek.map(day => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* Horarios */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Inicio *
              </label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora Fin *
              </label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Bloque Fijo */}
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="isFixed"
              checked={formData.isFixed}
              onChange={(e) => setFormData({ ...formData, isFixed: e.target.checked })}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="isFixed" className="text-sm text-gray-700">
              <strong>Bloque Fijo</strong> (No modificable por el sistema)
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Guardando...' : 'Guardar Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

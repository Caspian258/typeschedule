import { Plus } from 'lucide-react';
import { useState } from 'react';
import WeeklyView from '../components/WeeklyView';
import AddEventModal from '../components/AddEventModal';
import CalendarControls from '../components/CalendarControls';
import { useEvents } from '@/features/events/hooks/useEvents';

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { events, loading, error, createEvent, updateEvent, deleteEvent } = useEvents();

  const handleCreateOrUpdateEvent = async (eventData, eventId) => {
    try {
      if (eventId) {
        // Actualizar evento existente
        await updateEvent(eventId, eventData);
      } else {
        // Crear nuevo evento
        await createEvent(eventData);
      }
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error al guardar evento:', error);
      throw error;
    }
  };

  const handleEditEvent = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      throw error;
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

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
        <div className="flex items-center gap-3">
          {/* Botón de Auto-Agendado */}
          <CalendarControls />
          
          {/* Botón de Nuevo Evento */}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Nuevo Evento</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-500">Cargando eventos...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">⚠️ {error}</p>
        </div>
      )}

      {/* Weekly Calendar View */}
      {!loading && <WeeklyView events={events} onEditEvent={handleEditEvent} />}

      {/* Info Banner */}
      <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <p className="text-sm text-indigo-700">
          <strong>Fase 1 (MVP):</strong> F1.2 - CRUD de Eventos | 
          Eventos en tiempo real desde Firestore 🔥
        </p>
      </div>

      {/* Floating Action Button (Mobile friendly) */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center justify-center lg:hidden z-40"
        aria-label="Agregar evento"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add/Edit Event Modal */}
      <AddEventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleCreateOrUpdateEvent}
        onDelete={handleDeleteEvent}
        eventToEdit={selectedEvent}
      />
    </div>
  );
}

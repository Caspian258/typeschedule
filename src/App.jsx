import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import CalendarPage from './features/calendar/pages/CalendarPage';

// Placeholder components para rutas futuras
function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Bienvenido a TimeWeave</h2>
        <p className="text-gray-500 mb-6">Inicia sesión para continuar</p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition">
            Entrar
          </button>
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">
          [Placeholder - Auth se implementará en Sprint 2]
        </p>
      </div>
    </div>
  );
}

function SleepPage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800">🌙 Módulo de Sueño</h2>
      <p className="text-gray-500 mt-2">Próximamente: Fase 2</p>
    </div>
  );
}

function StudyPage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800">📚 Study Tracker</h2>
      <p className="text-gray-500 mt-2">Próximamente: Fase 2</p>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-gray-800">👤 Perfil de Usuario</h2>
      <p className="text-gray-500 mt-2">Configuración de cronotipo y preferencias</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to calendar */}
        <Route path="/" element={<Navigate to="/calendar" replace />} />

        {/* Auth routes (sin layout) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes con MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/study" element={<StudyPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-300">404</h1>
              <p className="text-gray-500 mt-2">Página no encontrada</p>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import MainLayout from './layouts/MainLayout';
import CalendarPage from './features/calendar/pages/CalendarPage';
import LoginPage from './features/auth/pages/LoginPage';
import ProfilePage from './features/profile/pages/ProfilePage';

// Componente para proteger rutas privadas
function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Componente para redireccionar si ya está autenticado
function PublicRoute({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/calendar" replace />;
  }

  return children;
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



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root to calendar */}
          <Route path="/" element={<Navigate to="/calendar" replace />} />

          {/* Auth routes (sin layout) - Solo accesibles si NO está autenticado */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />

          {/* Protected routes con MainLayout - Solo accesibles si está autenticado */}
          <Route 
            element={
              <PrivateRoute>
                <MainLayout />
              </PrivateRoute>
            }
          >
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

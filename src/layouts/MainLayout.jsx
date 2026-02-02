import { Outlet, NavLink } from 'react-router-dom';
import { Calendar, Moon, BookOpen, User, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../features/auth/context/AuthContext';

export default function MainLayout() {
  const { user, logout } = useAuth();
  
  const navItems = [
    { to: '/calendar', label: 'Calendario', icon: Calendar },
    { to: '/sleep', label: 'Sueño', icon: Moon },
    { to: '/study', label: 'Estudio', icon: BookOpen },
    { to: '/profile', label: 'Perfil', icon: User },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo/Header */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-indigo-600">TimeWeave</h1>
          <p className="text-xs text-gray-500 mt-1">Optimización Biológica</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    'text-gray-700 hover:bg-indigo-50 hover:text-indigo-600',
                    isActive && 'bg-indigo-100 text-indigo-700 font-medium'
                  )
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-200 space-y-3">
          {/* User Info */}
          {user && (
            <div className="flex items-center gap-3 px-2">
              <img 
                src={user.photoURL || 'https://via.placeholder.com/40'} 
                alt="Avatar" 
                className="w-10 h-10 rounded-full border-2 border-indigo-200"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {user.displayName || 'Usuario'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            v1.0.0 - MVP Phase
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

import { Outlet, NavLink } from 'react-router-dom';
import { Calendar, Moon, BookOpen, User } from 'lucide-react';
import { cn } from '../lib/utils';

export default function MainLayout() {
  const navItems = [
    { to: '/calendar', label: 'Calendario', icon: Calendar },
    { to: '/sleep', label: 'Sueño', icon: Moon },
    { to: '/study', label: 'Estudio', icon: BookOpen },
    { to: '/profile', label: 'Perfil', icon: User },
  ];

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

import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Table, CalendarDays, Clock, UtensilsCrossed, ClipboardList, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/admin/tables', icon: Table, label: 'Tables' },
    { to: '/admin/reservations', icon: CalendarDays, label: 'Reservations' },
    { to: '/admin/waitlist', icon: Clock, label: 'Liste d\'attente' },
    { to: '/admin/menu', icon: UtensilsCrossed, label: 'Menu' },
    { to: '/admin/orders', icon: ClipboardList, label: 'Commandes' }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <aside className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">RestoFlow Admin</h1>
        </div>
        <nav className="p-4 space-y-2">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded transition-colors ${
                  isActive ? 'bg-red-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <link.icon className="h-5 w-5" />
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-gray-300 hover:bg-gray-800 rounded transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

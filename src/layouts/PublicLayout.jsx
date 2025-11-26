import { Outlet, Link, useLocation } from 'react-router-dom';
import { UtensilsCrossed, Menu, X } from 'lucide-react';
import { useState } from 'react';

const PublicLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <header className={isHome ? 'absolute top-0 left-0 right-0 z-50 bg-transparent' : 'bg-white shadow-sm sticky top-0 z-50'}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className={isHome ? 'flex items-center gap-2 text-white' : 'flex items-center gap-2 text-red-600'}>
            <UtensilsCrossed className="h-8 w-8" />
            <span className="text-xl font-bold">Le Gourmet</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={isHome ? 'text-white hover:text-red-300' : 'text-gray-600 hover:text-red-600'}>
              Accueil
            </Link>
            <Link to="/menu" className={isHome ? 'text-white hover:text-red-300' : 'text-gray-600 hover:text-red-600'}>
              Menu
            </Link>
            <Link to="/reservation" className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
              Reserver
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={isHome ? 'h-6 w-6 text-white' : 'h-6 w-6 text-gray-900'} />
            ) : (
              <Menu className={isHome ? 'h-6 w-6 text-white' : 'h-6 w-6 text-gray-900'} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg">
            <div className="px-4 py-4 space-y-3">
              <Link 
                to="/" 
                className="block text-gray-600 hover:text-red-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Accueil
              </Link>
              <Link 
                to="/menu" 
                className="block text-gray-600 hover:text-red-600 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Menu
              </Link>
              <Link 
                to="/reservation" 
                className="block bg-red-600 text-white px-4 py-2 rounded text-center hover:bg-red-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                Reserver
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;

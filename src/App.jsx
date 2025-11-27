import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/HomePage';
import PublicMenuPage from './pages/PublicMenuPage';
import ReservationPage from './pages/ReservationPage';
import LoginPage from './pages/LoginPage';

// Admin Pages
import DashboardPage from './pages/admin/DashboardPage';
import TablesPage from './pages/admin/TablesPage';
import ReservationsPage from './pages/admin/ReservationsPage';
import WaitlistPage from './pages/admin/WaitlistPage';
import MenuPage from './pages/admin/MenuPage';
import OrdersPage from './pages/admin/OrdersPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// App Routes Component (inside AuthProvider)
const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes with Layout */}
      {/* <Route element={<PublicLayout />}> */}
      <Route >
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<PublicMenuPage />} />
        <Route path="/reservation" element={<ReservationPage />} />
      </Route>

      {/* Login Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="tables" element={<TablesPage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="waitlist" element={<WaitlistPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

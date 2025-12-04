import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import WalkersDashboard from './pages/WalkersDashboard';
import MyPets from './pages/MyPets';
import MyWalks from './pages/MyWalks';
import { AuthProvider, useAuth } from './context/AuthContext';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

function AppLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg-app)' }}>
      <Navbar />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: 'clamp(1.5rem, 4vw, 2.5rem) clamp(1rem, 3vw, 2rem)' }}>
        {children}
      </main>
    </div>
  );
}

function PublicLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

// Componente para la ruta raíz: muestra Dashboard si está logueado, Landing si no
function HomePage() {
  const { user } = useAuth();
  
  if (user) {
    // Usuario logueado: mostrar Dashboard con layout
    return (
      <AppLayout>
        <WalkersDashboard />
      </AppLayout>
    );
  }
  
  // Usuario no logueado: mostrar Landing
  return (
    <PublicLayout>
      <Landing />
    </PublicLayout>
  );
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <Routes>
          {/* Ruta raíz: condicional según autenticación */}
          <Route path="/" element={<HomePage />} />
          
          {/* Rutas públicas */}
          <Route 
            path="/register" 
            element={
              <PublicLayout>
                <Register />
              </PublicLayout>
            } 
          />
          <Route 
            path="/login" 
            element={
              <PublicLayout>
                <Login />
              </PublicLayout>
            } 
          />

          {/* Rutas protegidas con layout moderno */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <WalkersDashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Rutas protegidas con layout moderno */}
          <Route
            path="/pets"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MyPets />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-walks"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <MyWalks />
                </AppLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/jobs"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <div style={{ textAlign: 'center', padding: 60 }}>
                    <h2 style={{ fontSize: 24, color: '#1e293b', marginBottom: 12 }}>Mis Trabajos</h2>
                    <p style={{ color: '#6b7280' }}>Próximamente: Historial de paseos</p>
                  </div>
                </AppLayout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all: redirige a raíz */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}
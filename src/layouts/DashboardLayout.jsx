import { LayoutDashboard, Box, Users, LogOut } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const sidebarStyle = {
  width: '250px',
  background: '#1e293b',
  color: '#fff',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '24px 0',
  position: 'fixed',
  left: 0,
  top: 0,
};

const menuItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 32px',
  textDecoration: 'none',
  color: '#fff',
  fontWeight: 500,
  fontSize: '16px',
};

const logoutStyle = {
  ...menuItemStyle,
  color: '#ef4444',
  marginTop: 'auto',
};


const contentStyle = {
  marginLeft: '250px',
  marginTop: '64px',
  padding: '32px',
  minHeight: 'calc(100vh - 64px)',
  background: '#f8fafc',
};

export default function DashboardLayout() {
  const { logout } = useAuth();

  return (
    <div>
      <aside style={sidebarStyle}>
        <div>
          <div style={{ padding: '0 32px', marginBottom: '32px', fontWeight: 'bold', fontSize: '22px', letterSpacing: '1px' }}>
            ERP Alquileres
          </div>
          <nav>
            <Link to="/" style={menuItemStyle}>
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link to="/inventario" style={menuItemStyle}>
              <Box size={20} /> Inventario
            </Link>
            <Link to="/usuarios" style={menuItemStyle}>
              <Users size={20} /> Usuarios
            </Link>
          </nav>
        </div>
        <button style={logoutStyle} onClick={logout}>
          <LogOut size={20} /> Cerrar Sesión
        </button>
      </aside>
      <Navbar />
      <main style={contentStyle}>
        <Outlet />
      </main>
    </div>
  );
}

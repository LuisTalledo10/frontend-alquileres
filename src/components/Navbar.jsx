import React, { useState, useEffect } from 'react';
import { Menu, X, LogOut, User as UserIcon, Dog, MapPin, Briefcase } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isWalker = user?.role === 'walker';
  const name = user ? (user.full_name || user.name || user.email) : 'Usuario';
  const initial = name ? String(name).trim()[0]?.toUpperCase() : 'U';

  // Detectar scroll para glassmorphism effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú móvil cuando se hace clic en un enlace
  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const navLinks = isWalker ? [
    { to: '/dashboard', label: 'Mi Perfil', icon: UserIcon },
    { to: '/jobs', label: 'Mis Trabajos', icon: Briefcase },
  ] : [
    { to: '/dashboard', label: 'Buscar Paseador', icon: MapPin },
    { to: '/pets', label: 'Mis Mascotas', icon: Dog },
    { to: '/my-walks', label: 'Mis Paseos', icon: Dog },
  ];

  return (
    <>
      {/* Navbar con Glassmorphism */}
      <header 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          background: scrolled 
            ? 'rgba(255, 255, 255, 0.8)' 
            : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: scrolled ? '1px solid rgba(226, 232, 240, 0.8)' : '1px solid transparent',
          boxShadow: scrolled ? 'var(--shadow-md)' : 'none',
          transition: 'all 0.3s ease',
        }}
      >
        <nav 
          style={{
            maxWidth: '1440px',
            margin: '0 auto',
            padding: '0 clamp(1rem, 3vw, 2rem)',
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <Link 
            to="/" 
            onClick={handleLinkClick}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img src={logo} alt="DogWalker Logo" style={{ width: '50px', height: '50px', objectFit: 'contain' }} />
            <span style={{ 
              fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.02em',
            }}>
              DogWalker
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div 
            style={{ 
              display: 'none',
              gap: '0.5rem',
              alignItems: 'center',
            }}
            className="desktop-nav"
          >
            {user && navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.625rem 1.25rem',
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  color: 'var(--color-text)',
                  textDecoration: 'none',
                  borderRadius: 'var(--radius-full)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'var(--color-primary)';
                  e.currentTarget.style.color = 'var(--color-white)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth / User */}
          <div 
            style={{ 
              display: 'none',
              alignItems: 'center',
              gap: '1rem',
            }}
            className="desktop-auth"
          >
            {!user ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '0.625rem 1.5rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: 'var(--color-primary)',
                    background: 'transparent',
                    border: '2px solid var(--color-primary)',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-primary)';
                    e.target.style.color = 'var(--color-white)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = 'var(--color-primary)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => navigate('/register')}
                  style={{
                    padding: '0.625rem 1.5rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: 'var(--color-white)',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(79, 70, 229, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                  }}
                >
                  Registrarse
                </button>
              </>
            ) : (
              <>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.5rem 1rem',
                  background: 'rgba(79, 70, 229, 0.08)',
                  borderRadius: 'var(--radius-full)',
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: 'var(--radius-full)',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '1rem',
                    color: 'var(--color-white)',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                  }}>
                    {initial}
                  </div>
                  <span style={{ 
                    fontSize: '0.9375rem', 
                    fontWeight: '600', 
                    color: 'var(--color-text)',
                  }}>
                    {name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.625rem 1.25rem',
                    fontSize: '0.9375rem',
                    fontWeight: '600',
                    color: 'var(--color-error)',
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--color-error)';
                    e.target.style.color = 'var(--color-white)';
                    e.target.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.color = 'var(--color-error)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <LogOut size={18} />
                  Salir
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              background: mobileMenuOpen 
                ? 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)'
                : 'rgba(79, 70, 229, 0.08)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              color: mobileMenuOpen ? 'var(--color-white)' : 'var(--color-primary)',
              boxShadow: mobileMenuOpen ? '0 4px 12px rgba(79, 70, 229, 0.3)' : 'none',
            }}
            className="mobile-menu-button"
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </header>

      {/* Mobile Sidebar Menu */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '320px',
          background: 'var(--color-white)',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.12)',
          zIndex: 2000,
          transform: mobileMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflowY: 'auto',
        }}
        className="mobile-sidebar"
      >
        {/* Header del Sidebar */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem',
          }}>
            <span style={{ fontSize: '28px' }}>🐕</span>
            <span style={{ 
              fontSize: '1.25rem', 
              fontWeight: '700', 
              background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              DogWalker
            </span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              background: 'rgba(79, 70, 229, 0.08)',
              border: 'none',
              borderRadius: 'var(--radius-lg)',
              cursor: 'pointer',
              color: 'var(--color-primary)',
            }}
            aria-label="Cerrar menú"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Info (si está logueado) */}
        {user && (
          <div style={{
            padding: '1.5rem',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
            color: 'var(--color-white)',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '1.5rem',
                border: '3px solid rgba(255, 255, 255, 0.3)',
              }}>
                {initial}
              </div>
              <div>
                <div style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '700',
                  marginBottom: '0.25rem',
                }}>
                  {name}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  opacity: 0.9,
                  fontWeight: '500',
                }}>
                  {isWalker ? '🚶 Paseador' : '🐾 Dueño'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Links */}
        <nav style={{
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {!user ? (
            <>
              <button
                onClick={() => {
                  navigate('/login');
                  handleLinkClick();
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--color-primary)',
                  background: 'rgba(79, 70, 229, 0.08)',
                  border: '2px solid var(--color-primary)',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  marginBottom: '0.75rem',
                }}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  navigate('/register');
                  handleLinkClick();
                }}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--color-white)',
                  background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                }}
              >
                Registrarse
              </button>
            </>
          ) : (
            <>
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={handleLinkClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    fontSize: '1rem',
                    fontWeight: '500',
                    color: 'var(--color-text)',
                    textDecoration: 'none',
                    borderRadius: 'var(--radius-lg)',
                    transition: 'all 0.2s ease',
                    background: 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(79, 70, 229, 0.08)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <link.icon size={20} />
                  {link.label}
                </Link>
              ))}
              
              {/* Separator */}
              <div style={{
                height: '1px',
                background: 'var(--color-border)',
                margin: '0.75rem 0',
              }} />
              
              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  handleLinkClick();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  width: '100%',
                  padding: '1rem 1.25rem',
                  fontSize: '1rem',
                  fontWeight: '600',
                  color: 'var(--color-error)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </>
          )}
        </nav>
      </div>

      {/* Overlay (Backdrop) */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1999,
            animation: 'fadeIn 0.3s ease',
          }}
          className="mobile-overlay"
        />
      )}

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        /* Desktop navigation - visible >= 768px */
        @media (min-width: 768px) {
          .desktop-nav,
          .desktop-auth {
            display: flex !important;
          }
          .mobile-menu-button {
            display: none !important;
          }
        }

        /* Mobile - visible < 768px */
        @media (max-width: 767px) {
          .desktop-nav,
          .desktop-auth {
            display: none !important;
          }
          .mobile-menu-button {
            display: flex !important;
          }
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}

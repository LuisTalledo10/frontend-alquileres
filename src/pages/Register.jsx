import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, CreditCard, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const Register = () => {
  const navigate = useNavigate();
  
  // Estados del formulario
  const [role, setRole] = useState('owner');
  
  // Datos del formulario
  const [dni, setDni] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
  // Estados de UI
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Registro
  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!dni || !fullName || !email || !password || !phone) {
      setError('Completa todos los campos');
      return;
    }

    if (dni.length < 8) {
      setError('El DNI debe tener al menos 8 dígitos');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dni,
          full_name: fullName,
          email,
          password,
          phone,
          role,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al registrar usuario');
      }

      alert('¡Registro exitoso! Ahora puedes iniciar sesión.');
      navigate('/login');
      
    } catch (err) {
      setError(err.message || 'Error al registrar. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Split Screen Container */}
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'row',
      }}>
        {/* Left Side - Brand Pattern (Desktop Only) */}
        <div style={{
          flex: '1',
          background: 'linear-gradient(135deg, #4f46e5 0%, #f43f5e 100%)',
          position: 'relative',
          overflow: 'hidden',
          display: 'none',
        }}
        className="register-left-panel"
        >
          {/* Patrón de fondo */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          {/* Contenido del panel izquierdo */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 'clamp(200px, 5vw, 60px)',
            textAlign: 'center',
          }}>
            {/* Icono grande */}
            <div style={{
              marginBottom: '32px',
            }}>
              <img src={logo} alt="PetWalk Logo" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
            </div>

            {/* Texto */}
            <h2 style={{
              fontSize: 'clamp(28px, 3vw, 42px)',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '20px',
              lineHeight: '1.2',
            }}>
              ¡Únete a DogWalker!
            </h2>
            <p style={{
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'rgba(255, 255, 255, 0.9)',
              lineHeight: '1.6',
              maxWidth: '450px',
              marginBottom: '48px',
            }}>
              Crea tu cuenta gratis y comienza a disfrutar de paseos profesionales o empieza a ganar dinero como paseador
            </p>

            {/* Benefits */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
              width: '100%',
              maxWidth: '420px',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#ffffff',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}>
                  ✓
                </div>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Registro 100% gratuito</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#ffffff',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}>
                  ✓
                </div>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Sin comisiones ocultas</span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: '#ffffff',
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}>
                  ✓
                </div>
                <span style={{ fontSize: '16px', fontWeight: '500' }}>Soporte 24/7 disponible</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{
          flex: '1',
          background: 'var(--color-bg-app)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(24px, 4vw, 60px)',
          minWidth: '320px',
          overflowY: 'auto',
        }}>
          {/* Formulario Container */}
          <div style={{
            maxWidth: '520px',
            width: '100%',
          }}>
            {/* Header */}
            <div style={{ marginBottom: '32px' }}>
              <h1 style={{
                fontSize: 'clamp(32px, 5vw, 42px)',
                fontWeight: '800',
                color: 'var(--color-text)',
                marginBottom: '12px',
              }}>
                Crear Cuenta ✨
              </h1>
              <p style={{
                fontSize: 'clamp(16px, 2vw, 18px)',
                color: '#64748b',
              }}>
                Completa el formulario para empezar
              </p>
            </div>

            {/* Selector de Rol */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '32px',
            }}>
              <button
                type="button"
                onClick={() => setRole('owner')}
                style={{
                  padding: '16px 20px',
                  fontSize: '16px',
                  fontWeight: '700',
                  background: role === 'owner'
                    ? 'linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%)'
                    : '#f8fafc',
                  color: role === 'owner' ? '#ffffff' : '#64748b',
                  border: role === 'owner' ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: role === 'owner' ? '0 4px 14px rgba(79, 70, 229, 0.4)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (role !== 'owner') {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (role !== 'owner') {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                  }
                }}
              >
                🏠 Soy Dueño
              </button>
              <button
                type="button"
                onClick={() => setRole('walker')}
                style={{
                  padding: '16px 20px',
                  fontSize: '16px',
                  fontWeight: '700',
                  background: role === 'walker'
                    ? 'linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%)'
                    : '#f8fafc',
                  color: role === 'walker' ? '#ffffff' : '#64748b',
                  border: role === 'walker' ? 'none' : '2px solid #e2e8f0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: role === 'walker' ? '0 4px 14px rgba(79, 70, 229, 0.4)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (role !== 'walker') {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.background = '#f1f5f9';
                  }
                }}
                onMouseLeave={(e) => {
                  if (role !== 'walker') {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.background = '#f8fafc';
                  }
                }}
              >
                🦴 Soy Paseador
              </button>
            </div>

            {/* Formulario de Registro */}
            <form onSubmit={handleRegister}>
              {/* Grid de inputs - 2 columnas en desktop */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
                gap: '20px',
                marginBottom: '20px',
              }}>
                {/* DNI */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-text)',
                    marginBottom: '8px',
                  }}>
                    DNI
                  </label>
                  <div style={{ position: 'relative' }}>
                    <CreditCard size={20} style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      zIndex: 1,
                    }} />
                    <input
                      type="text"
                      placeholder="12345678"
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      maxLength={8}
                      required
                      style={{
                        width: '100%',
                        padding: '16px 16px 16px 48px',
                        fontSize: '16px',
                        background: '#f8fafc',
                        border: '2px solid transparent',
                        borderRadius: '12px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary)';
                        e.target.style.background = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: 'var(--color-text)',
                    marginBottom: '8px',
                  }}>
                    Teléfono
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={20} style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#94a3b8',
                      zIndex: 1,
                    }} />
                    <input
                      type="tel"
                      placeholder="999 999 999"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '16px 16px 16px 48px',
                        fontSize: '16px',
                        background: '#f8fafc',
                        border: '2px solid transparent',
                        borderRadius: '12px',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                        fontFamily: 'Poppins, sans-serif',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--color-primary)';
                        e.target.style.background = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'transparent';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Nombre Completo - Full Width */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '8px',
                }}>
                  Nombre Completo
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={20} style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    zIndex: 1,
                  }} />
                  <input
                    type="text"
                    placeholder="Juan Pérez García"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      fontSize: '16px',
                      background: '#f8fafc',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Email - Full Width */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '8px',
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={20} style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    zIndex: 1,
                  }} />
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      fontSize: '16px',
                      background: '#f8fafc',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password - Full Width */}
              <div style={{ marginBottom: '32px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-text)',
                  marginBottom: '8px',
                }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={20} style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    zIndex: 1,
                  }} />
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '16px 16px 16px 48px',
                      fontSize: '16px',
                      background: '#f8fafc',
                      border: '2px solid transparent',
                      borderRadius: '12px',
                      outline: 'none',
                      transition: 'all 0.3s ease',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.background = '#ffffff';
                      e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'transparent';
                      e.target.style.background = '#f8fafc';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div style={{
                  marginBottom: '24px',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
                  color: '#dc2626',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: '600',
                  textAlign: 'center',
                  border: '1px solid #fca5a5',
                }}>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: '17px',
                  fontWeight: '700',
                  background: loading
                    ? '#94a3b8'
                    : 'linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  marginBottom: '24px',
                  boxShadow: loading ? 'none' : '0 4px 14px rgba(79, 70, 229, 0.4)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 14px rgba(79, 70, 229, 0.4)';
                  }
                }}
              >
                {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>

              {/* Link a Login */}
              <p style={{
                textAlign: 'center',
                fontSize: '15px',
                color: '#64748b',
              }}>
                ¿Ya tienes cuenta?{' '}
                <span
                  onClick={() => navigate('/login')}
                  style={{
                    color: 'var(--color-primary)',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = 'var(--color-accent)';
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = 'var(--color-primary)';
                    e.target.style.textDecoration = 'none';
                  }}
                >
                  Inicia Sesión
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* CSS para mostrar/ocultar panel izquierdo en responsive */}
      <style>{`
        @media (min-width: 768px) {
          .register-left-panel {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;

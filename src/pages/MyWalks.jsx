import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';
import { MessageCircle, CheckCircle, Clock, XCircle, Calendar, User, Dog, Eye, X, Phone, Mail, DollarSign } from 'lucide-react';

const MyWalks = () => {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        console.log('❌ No token available');
        setLoading(false);
        return;
      }

      try {
        console.log('📡 Fetching owner bookings...');
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/bookings/owner`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        console.log('📡 Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        console.log('✅ Bookings loaded:', data);
        setBookings(data.bookings || data || []);
      } catch (error) {
        console.error('❌ Error loading bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, refreshTrigger]);

  const handleCompleteWalk = async (bookingId) => {
    if (!token) return;

    if (!confirm('¿Confirmar que el paseo ha finalizado?')) {
      return;
    }

    try {
      console.log('🏁 Completing walk:', bookingId);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/bookings/${bookingId}`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'completed' })
        }
      );

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      console.log('✅ Walk completed successfully');
      alert('Paseo marcado como completado');
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('❌ Error completing walk:', error);
      alert('Error al completar el paseo');
    }
  };

  const handleOpenChat = (booking) => {
    console.log('💬 Opening chat for booking:', booking.id);
    setSelectedBooking(booking);
  };

  const handleCloseChat = () => {
    console.log('💬 Closing chat');
    setSelectedBooking(null);
  };

  // Organizar paseos por estado
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const activeBookings = bookings.filter(b => b.status === 'accepted');
  const historyBookings = bookings.filter(b => ['completed', 'rejected'].includes(b.status));

  if (loading) {
    return (
      <div style={{
        padding: '60px 20px',
        textAlign: 'center'
      }}>
        <Clock size={48} style={{ color: '#666', marginBottom: '20px' }} />
        <h2 style={{ color: '#333' }}>Cargando tus paseos...</h2>
      </div>
    );
  }

  return (
    <div style={{
      padding: '40px 20px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <h1 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Dog size={36} style={{ color: '#4F46E5' }} />
        Mis Paseos
      </h1>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '80px 20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          color: 'white'
        }}>
          <Dog size={64} style={{ marginBottom: '20px', opacity: 0.9 }} />
          <h2 style={{ fontSize: '24px', marginBottom: '12px' }}>
            Aún no tienes paseos programados
          </h2>
          <p style={{ fontSize: '16px', opacity: 0.9, marginBottom: '24px' }}>
            Busca un paseador y reserva el primer paseo para tu mascota
          </p>
          <a
            href="/dashboard"
            style={{
              display: 'inline-block',
              padding: '12px 32px',
              background: 'white',
              color: '#667eea',
              borderRadius: '8px',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            Buscar Paseador
          </a>
        </div>
      )}

      {/* Solicitudes Pendientes */}
      {pendingBookings.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Clock size={24} style={{ color: '#F59E0B' }} />
            Solicitudes Pendientes
            <span style={{
              background: '#FEF3C7',
              color: '#92400E',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {pendingBookings.length}
            </span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {pendingBookings.map(booking => (
              <div
                key={booking.id}
                style={{
                  background: 'white',
                  border: '2px solid #FCD34D',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                      {booking.walker_name || 'Paseador'}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#666', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Dog size={16} />
                      {booking.pet_name || 'Tu mascota'}
                    </p>
                  </div>
                  <span style={{
                    background: '#FEF3C7',
                    color: '#92400E',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    Pendiente
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#666', fontSize: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} />
                    {new Date(booking.start_time).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} />
                    {new Date(booking.start_time).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {booking.duration_hours}h
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDetail(booking)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#F3F4F6',
                    color: '#374151',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#E5E7EB';
                    e.target.style.borderColor = '#D1D5DB';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#F3F4F6';
                    e.target.style.borderColor = '#E5E7EB';
                  }}
                >
                  <Eye size={16} />
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paseos Activos / Aceptados */}
      {activeBookings.length > 0 && (
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <CheckCircle size={24} style={{ color: '#10B981' }} />
            Paseos Activos
            <span style={{
              background: '#D1FAE5',
              color: '#065F46',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {activeBookings.length}
            </span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {activeBookings.map(booking => (
              <div
                key={booking.id}
                style={{
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  borderRadius: '12px',
                  padding: '24px',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                      {booking.walker_name || 'Paseador'}
                    </h3>
                    <p style={{ fontSize: '14px', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Dog size={16} />
                      {booking.pet_name || 'Tu mascota'}
                    </p>
                  </div>
                  <span style={{
                    background: 'rgba(255,255,255,0.3)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600'
                  }}>
                    Aceptado
                  </span>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                  opacity: 0.95
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} />
                    {new Date(booking.start_time).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} />
                    {new Date(booking.start_time).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {booking.duration_hours}h
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      onClick={() => handleOpenChat(booking)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#2563EB';
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = '#3B82F6';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <MessageCircle size={18} />
                      Chat
                    </button>

                    <button
                      onClick={() => handleCompleteWalk(booking.id)}
                      style={{
                        flex: 1,
                        padding: '12px',
                        background: 'white',
                        color: '#059669',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#F0FDF4';
                        e.target.style.transform = 'scale(1.02)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <CheckCircle size={18} />
                      Finalizar
                    </button>
                  </div>

                  <button
                    onClick={() => setSelectedDetail(booking)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      background: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      border: '1px solid rgba(255,255,255,0.3)',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.3)';
                      e.target.style.borderColor = 'rgba(255,255,255,0.5)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'rgba(255,255,255,0.2)';
                      e.target.style.borderColor = 'rgba(255,255,255,0.3)';
                    }}
                  >
                    <Eye size={16} />
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial */}
      {historyBookings.length > 0 && (
        <div>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Calendar size={24} style={{ color: '#6B7280' }} />
            Historial
            <span style={{
              background: '#F3F4F6',
              color: '#374151',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              {historyBookings.length}
            </span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px'
          }}>
            {historyBookings.map(booking => (
              <div
                key={booking.id}
                style={{
                  background: '#F9FAFB',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  padding: '20px',
                  opacity: 0.8
                }}
              >
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#4B5563', marginBottom: '4px' }}>
                      {booking.walker_name || 'Paseador'}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Dog size={16} />
                      {booking.pet_name || 'Tu mascota'}
                    </p>
                  </div>
                  <span style={{
                    background: booking.status === 'completed' ? '#D1FAE5' : '#FEE2E2',
                    color: booking.status === 'completed' ? '#065F46' : '#991B1B',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {booking.status === 'completed' ? (
                      <>
                        <CheckCircle size={14} />
                        Completado
                      </>
                    ) : (
                      <>
                        <XCircle size={14} />
                        Rechazado
                      </>
                    )}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#6B7280', fontSize: '14px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={16} />
                    {new Date(booking.start_time).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={16} />
                    {new Date(booking.start_time).toLocaleTimeString('es-ES', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })} - {booking.duration_hours}h
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDetail(booking)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#F9FAFB',
                    color: '#6B7280',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#F3F4F6';
                    e.target.style.color = '#374151';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = '#F9FAFB';
                    e.target.style.color = '#6B7280';
                  }}
                >
                  <Eye size={16} />
                  Ver Detalles
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedDetail && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '8px'
          }}
          onClick={() => setSelectedDetail(null)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              margin: '0 auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header - Sticky */}
            <div style={{
              padding: 'clamp(16px, 3vw, 24px)',
              borderBottom: '1px solid #E5E7EB',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'sticky',
              top: 0,
              background: 'white',
              borderRadius: '16px 16px 0 0',
              zIndex: 10,
              gap: '12px'
            }}>
              <h2 style={{ 
                fontSize: 'clamp(20px, 4vw, 24px)', 
                fontWeight: '700', 
                color: '#1F2937',
                margin: 0,
                flex: 1
              }}>
                Detalles del Paseo
              </h2>
              <button
                onClick={() => setSelectedDetail(null)}
                type="button"
                style={{
                  background: '#F3F4F6',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                  minWidth: '40px',
                  minHeight: '40px'
                }}
                onMouseOver={(e) => e.target.style.background = '#E5E7EB'}
                onMouseOut={(e) => e.target.style.background = '#F3F4F6'}
              >
                <X size={20} style={{ color: '#6B7280' }} />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div style={{ padding: 'clamp(16px, 3vw, 24px)' }}>
              {/* Sección Paseador */}
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '12px',
                padding: '20px',
                color: 'white',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <User size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>
                      {selectedDetail.walker?.full_name || selectedDetail.walker_name || 'Paseador'}
                    </h3>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>Paseador Profesional</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                  {selectedDetail.walker?.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.95 }}>
                      <Mail size={16} />
                      {selectedDetail.walker.email}
                    </div>
                  )}
                  {selectedDetail.walker?.phone && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.95 }}>
                      <Phone size={16} />
                      {selectedDetail.walker.phone}
                    </div>
                  )}
                </div>
              </div>

              {/* Sección Mascota */}
              <div style={{
                background: '#F0FDF4',
                border: '2px solid #10B981',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: '#10B981',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Dog size={20} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#065F46', marginBottom: '2px' }}>
                      {selectedDetail.pet?.name || selectedDetail.pet_name || 'Tu mascota'}
                    </h3>
                    {selectedDetail.pet?.breed && (
                      <p style={{ fontSize: '14px', color: '#059669' }}>
                        Raza: {selectedDetail.pet.breed}
                      </p>
                    )}
                  </div>
                </div>

                {selectedDetail.pet?.notes && (
                  <div style={{
                    background: 'white',
                    padding: '12px',
                    borderRadius: '8px',
                    marginTop: '12px'
                  }}>
                    <p style={{ fontSize: '13px', color: '#065F46', fontWeight: '500', marginBottom: '4px' }}>
                      Notas especiales:
                    </p>
                    <p style={{ fontSize: '14px', color: '#047857', lineHeight: '1.5' }}>
                      {selectedDetail.pet.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Sección Paseo */}
              <div style={{
                background: '#FEF3C7',
                border: '2px solid #F59E0B',
                borderRadius: '12px',
                padding: '20px'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#92400E', marginBottom: '16px' }}>
                  Información del Paseo
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E' }}>
                      <Calendar size={18} />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>Fecha:</span>
                    </div>
                    <span style={{ fontSize: '14px', color: '#78350F', fontWeight: '600' }}>
                      {new Date(selectedDetail.start_time).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E' }}>
                      <Clock size={18} />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>Hora:</span>
                    </div>
                    <span style={{ fontSize: '14px', color: '#78350F', fontWeight: '600' }}>
                      {new Date(selectedDetail.start_time).toLocaleTimeString('es-ES', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E' }}>
                      <Clock size={18} />
                      <span style={{ fontSize: '14px', fontWeight: '500' }}>Duración:</span>
                    </div>
                    <span style={{ fontSize: '14px', color: '#78350F', fontWeight: '600' }}>
                      {selectedDetail.duration_hours} {selectedDetail.duration_hours === 1 ? 'hora' : 'horas'}
                    </span>
                  </div>

                  {selectedDetail.total_cost && (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginTop: '8px',
                      paddingTop: '16px',
                      borderTop: '2px dashed #F59E0B'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#92400E' }}>
                        <DollarSign size={20} />
                        <span style={{ fontSize: '16px', fontWeight: '600' }}>Costo Total:</span>
                      </div>
                      <span style={{ fontSize: '20px', color: '#78350F', fontWeight: '700' }}>
                        ${Number(selectedDetail.total_cost).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Estado del Paseo */}
              <div style={{
                marginTop: '20px',
                padding: '16px',
                background: selectedDetail.status === 'completed' ? '#D1FAE5' :
                           selectedDetail.status === 'accepted' ? '#DBEAFE' :
                           selectedDetail.status === 'rejected' ? '#FEE2E2' : '#FEF3C7',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <p style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: selectedDetail.status === 'completed' ? '#065F46' :
                         selectedDetail.status === 'accepted' ? '#1E40AF' :
                         selectedDetail.status === 'rejected' ? '#991B1B' : '#92400E',
                  margin: 0
                }}>
                  Estado: {
                    selectedDetail.status === 'completed' ? '✅ Completado' :
                    selectedDetail.status === 'accepted' ? '🟢 Activo' :
                    selectedDetail.status === 'rejected' ? '❌ Rechazado' : '🟡 Pendiente'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {selectedBooking && (
        <ChatWindow
          bookingId={selectedBooking.id}
          onClose={handleCloseChat}
          otherUserName={selectedBooking.walker_name || 'Paseador'}
        />
      )}
    </div>
  );
};

export default MyWalks;

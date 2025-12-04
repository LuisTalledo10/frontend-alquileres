import React, { useState, useEffect } from 'react';
import { Dog, MapPin, DollarSign, User, Clock, X, Calendar, Check, XCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ChatWindow from '../components/ChatWindow';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function WalkersDashboard() {
  const { user, token } = useAuth();

  // Estados para Walker
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [available, setAvailable] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [pendingBookings, setPendingBookings] = useState([]);
  const [activeBookings, setActiveBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [refreshBookingsTrigger, setRefreshBookingsTrigger] = useState(0);

  // Estados para Owner
  const [walkers, setWalkers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedWalker, setSelectedWalker] = useState(null);
  const [myPets, setMyPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [hours, setHours] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  // Estados para Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatBookingId, setChatBookingId] = useState(null);
  const [chatOtherUser, setChatOtherUser] = useState('');

  const isWalker = user?.role === 'walker';

  // 🔍 DEBUG: Loggear estado cuando cambia showBookingModal
  useEffect(() => {
    if (showBookingModal) {
      console.log('🎬 MODAL ABIERTO - Estado en este momento:');
      console.log('  selectedPetId:', selectedPetId, 'Tipo:', typeof selectedPetId);
      console.log('  myPets:', myPets);
      console.log('  myPets.length:', myPets.length);
      if (myPets.length > 0) {
        console.log('  myPets[0]:', myPets[0]);
      }
    }
  }, [showBookingModal, selectedPetId, myPets]);

  // Cargar perfil del walker y reservas al montar
  useEffect(() => {
    const loadWalkerProfile = async () => {
      try {
        const res = await fetch(`${API_URL}/api/walkers/profile/${user.id}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setBio(data.bio || '');
          setHourlyRate(data.hourly_rate || '');
          setAvailable(data.available || false);
        }
      } catch (err) {
        console.error('Error cargando perfil:', err);
      }
    };

    const loadWalkerBookings = async () => {
      setLoadingBookings(true);
      try {
        const res = await fetch(`${API_URL}/api/bookings/walker`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const bookings = data.bookings || data || [];
          setPendingBookings(bookings.filter(b => b.status === 'pending'));
          setActiveBookings(bookings.filter(b => b.status === 'accepted'));
        }
      } catch (err) {
        console.error('Error cargando reservas:', err);
      } finally {
        setLoadingBookings(false);
      }
    };

    if (isWalker && user?.id && token) {
      loadWalkerProfile();
      loadWalkerBookings();
    }
  }, [isWalker, user?.id, token, refreshBookingsTrigger]);

  // Cargar mascotas del owner al montar
  useEffect(() => {
    console.log('🐕 useEffect de loadMyPets ejecutado');
    console.log('  isWalker:', isWalker);
    console.log('  user?.id:', user?.id);
    console.log('  token:', token ? 'existe' : 'NO EXISTE');
    console.log('  Condición (!isWalker && user?.id && token):', !isWalker && user?.id && token);
    
    const loadMyPets = async () => {
      console.log('🔄 loadMyPets() iniciando...');
      try {
        const res = await fetch(`${API_URL}/api/pets`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log('📡 Respuesta GET /api/pets:', res.status);
        if (res.ok) {
          const data = await res.json();
          const pets = data.pets || data || [];
          console.log('✅ Mascotas cargadas:', pets);
          setMyPets(pets);
          
          // Auto-seleccionar primera mascota si existe y no hay ninguna seleccionada
          if (pets.length > 0 && !selectedPetId) {
            setSelectedPetId(String(pets[0].id));  // ✅ CONVERTIR A STRING
            console.log('🔄 Auto-select inicial al cargar mascotas. ID:', String(pets[0].id));
          }
        } else {
          console.error('❌ Error en respuesta:', res.status, res.statusText);
        }
      } catch (err) {
        console.error('❌ Error cargando mascotas:', err);
      }
    };

    if (!isWalker && user?.id && token) {
      console.log('✅ Ejecutando loadMyPets()...');
      loadMyPets();
    } else {
      console.log('❌ NO se ejecuta loadMyPets() - Condición no cumplida');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWalker, user?.id, token]);

  const handleAcceptBooking = async (bookingId) => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'accepted' }),
      });

      if (res.ok) {
        alert('✅ Reserva aceptada');
        setRefreshBookingsTrigger(prev => prev + 1);
      } else {
        alert('❌ Error al aceptar reserva');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  const handleRejectBooking = async (bookingId) => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: 'rejected' }),
      });

      if (res.ok) {
        alert('❌ Reserva rechazada');
        setRefreshBookingsTrigger(prev => prev + 1);
      } else {
        alert('Error al rechazar reserva');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  const handleOpenChat = (bookingId, otherUserName) => {
    setChatBookingId(bookingId);
    setChatOtherUser(otherUserName);
    setChatOpen(true);
  };

  const handleContactWalker = (walker) => {
    console.log('🎯 handleContactWalker ejecutado');
    console.log('📋 myPets:', myPets);
    console.log('📋 myPets.length:', myPets.length);
    console.log('📋 selectedPetId ANTES de setear:', selectedPetId);
    
    setSelectedWalker(walker);
    
    // ✅ FORZAR auto-selección de primera mascota SIEMPRE que se abre el modal
    if (myPets.length > 0) {
      const petId = String(myPets[0].id);  // ✅ Convertir a STRING para coincidir con el select
      console.log('🐶 Auto-seleccionando mascota:', myPets[0].name, 'ID:', petId, 'Tipo:', typeof petId);
      setSelectedPetId(petId);
      console.log('✅ selectedPetId DESPUÉS de setear:', petId);
    } else {
      console.error('❌ NO HAY MASCOTAS para auto-seleccionar!');
    }
    
    setShowBookingModal(true);
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    
    console.log('🚀 handleSubmitBooking ejecutado');
    console.log('📊 Estado actual:', {
      selectedPetId,
      tipo_selectedPetId: typeof selectedPetId,
      myPets_length: myPets.length,
      selectedWalker_id: selectedWalker?.id,
      startTime,
      hours
    });

    // ✅ Fallback: Si selectedPetId es null/vacío pero hay mascotas, usar la primera
    let petId = selectedPetId;
    if (!petId && myPets.length > 0) {
      petId = String(myPets[0].id);  // ✅ Convertir a STRING
      console.log('⚠️ Fallback: Usando primera mascota porque selectedPetId está vacío. ID:', petId);
      setSelectedPetId(petId);
    }

    // Validación previa completa
    if (!selectedWalker?.id || !petId || !startTime || !hours) {
      alert('❌ Faltan datos: Completa todos los campos (Paseador, Mascota, Fecha/Hora, Duración)');
      console.error('❌ Validación fallida:', { 
        walker: selectedWalker?.id, 
        petId, 
        startTime, 
        hours 
      });
      return;
    }

    setBookingLoading(true);

    try {
      // Estructura exacta que espera el backend
      const payload = {
        walker_id: selectedWalker.id,
        pet_id: petId,  // ✅ MANTENER COMO STRING (es un UUID, no un número)
        start_time: startTime,
        duration_hours: Number(hours),
      };

      // Console log para depuración DETALLADO
      console.log('📤 Enviando Reserva:', payload);
      console.log('🔍 Tipos de datos:', {
        walker_id: typeof selectedWalker.id,
        walker_id_valor: selectedWalker.id,
        pet_id: typeof petId,
        pet_id_valor: petId,
        start_time: typeof startTime,
        duration_hours: typeof Number(hours),
        duration_hours_valor: Number(hours)
      });

      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        console.log('✅ Respuesta del servidor:', data);
        alert('✅ Solicitud enviada correctamente');
        setShowBookingModal(false);
        setSelectedPetId(null);  // ✅ Limpiar a null
        setStartTime('');
        setHours('');
      } else {
        const data = await res.json();
        console.error('❌ Error del servidor:', data);
        alert(`❌ Error: ${data.message || 'No se pudo crear la reserva'}`);
      }
    } catch (err) {
      console.error('❌ Error de conexión:', err);
      alert('Error de conexión');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user?.id) {
      setProfileMessage('Usuario no identificado');
      return;
    }

    setSavingProfile(true);
    setProfileMessage('');

    // Obtener ubicación del navegador
    if (!navigator.geolocation) {
      setProfileMessage('Tu navegador no soporta geolocalización');
      setSavingProfile(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(`${API_URL}/api/walkers/profile/${user.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
              bio,
              hourly_rate: parseFloat(hourlyRate) || 0,
              available,
              latitude,
              longitude,
            }),
          });

          const data = await res.json();

          if (res.ok) {
            setProfileMessage('✅ Perfil actualizado correctamente');
          } else {
            setProfileMessage(`❌ Error: ${data.error || data.message || 'Error desconocido'}`);
          }
        } catch (err) {
          console.error(err);
          setProfileMessage('❌ Error de conexión con el servidor');
        } finally {
          setSavingProfile(false);
        }
      },
      (error) => {
        console.error(error);
        setProfileMessage('❌ No se pudo obtener tu ubicación. Verifica los permisos del navegador.');
        setSavingProfile(false);
      }
    );
  };

  const handleSearchWalkers = async () => {
    setSearching(true);
    setSearchError('');
    setWalkers([]);

    if (!navigator.geolocation) {
      setSearchError('Tu navegador no soporta geolocalización');
      setSearching(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(`${API_URL}/api/walkers/nearby?lat=${latitude}&lng=${longitude}`, {
            headers: { 'Authorization': `Bearer ${token}` },
          });

          const data = await res.json();

          if (res.ok) {
            setWalkers(data.walkers || data || []);
            if ((data.walkers || data).length === 0) {
              setSearchError('No se encontraron paseadores cercanos en este momento.');
            }
          } else {
            setSearchError(`Error: ${data.error || data.message || 'No se pudo buscar paseadores'}`);
          }
        } catch (err) {
          console.error(err);
          setSearchError('Error de conexión con el servidor');
        } finally {
          setSearching(false);
        }
      },
      (error) => {
        console.error(error);
        setSearchError('No se pudo obtener tu ubicación. Verifica los permisos del navegador.');
        setSearching(false);
      }
    );
  };

  // Vista para Paseadores (Walker)
  if (isWalker) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'var(--color-bg-app)',
        padding: 'clamp(20px, 3vw, 40px)'
      }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px', 
          marginBottom: '32px',
          flexWrap: 'wrap'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-xl)',
            background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <Dog size={32} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ 
              fontSize: 'clamp(24px, 5vw, 32px)', 
              fontWeight: '800', 
              color: 'var(--color-text)', 
              margin: 0,
              letterSpacing: '-0.02em'
            }}>
              Mi Perfil Profesional
            </h1>
            <p style={{
              fontSize: 'clamp(14px, 2.5vw, 16px)',
              color: 'var(--color-text-light)',
              margin: 0,
              marginTop: '4px'
            }}>
              Gestiona tu información y reservas
            </p>
          </div>
        </div>

        {/* Perfil */}
        <div style={{ 
          background: 'var(--color-white)', 
          padding: 'clamp(24px, 4vw, 40px)', 
          borderRadius: '20px', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
          marginBottom: '32px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}>
          {profileMessage && (
            <div style={{ padding: 12, borderRadius: 8, marginBottom: 16, background: profileMessage.includes('✅') ? '#d1fae5' : '#fee2e2', color: profileMessage.includes('✅') ? '#065f46' : '#991b1b' }}>
              {profileMessage}
            </div>
          )}

          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              fontSize: '15px',
              marginBottom: 10, 
              color: 'var(--color-text)' 
            }}>Biografía</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntanos sobre ti, tu experiencia con perros, etc."
              rows={4}
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: 'var(--radius-lg)', 
                border: '2px solid var(--color-border)', 
                fontSize: '15px', 
                fontFamily: 'Poppins, sans-serif', 
                resize: 'vertical',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ 
              display: 'block', 
              fontWeight: 600, 
              fontSize: '15px',
              marginBottom: 10, 
              color: 'var(--color-text)'
            }}>
              <DollarSign size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              Tarifa por Hora (S/)
            </label>
            <input
              type="number"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
              placeholder="Ej: 25.00"
              step="0.01"
              min="0"
              style={{ 
                width: '100%', 
                padding: '14px 16px', 
                borderRadius: 'var(--radius-lg)', 
                border: '2px solid var(--color-border)', 
                fontSize: '15px',
                fontFamily: 'Poppins, sans-serif',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                outline: 'none'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          <div style={{ 
            marginBottom: 32,
            padding: '16px',
            background: 'rgba(79, 70, 229, 0.05)',
            borderRadius: 'var(--radius-lg)',
            border: '2px solid rgba(79, 70, 229, 0.1)'
          }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={available}
                onChange={(e) => setAvailable(e.target.checked)}
                style={{ 
                  width: 22, 
                  height: 22, 
                  cursor: 'pointer',
                  accentColor: 'var(--color-primary)'
                }}
              />
              <span style={{ 
                fontWeight: 600, 
                fontSize: '15px',
                color: 'var(--color-text)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Clock size={20} />
                Disponible ahora para paseos
              </span>
            </label>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={savingProfile}
            style={{
              width: '100%',
              padding: '16px 24px',
              minHeight: '56px',
              background: savingProfile 
                ? 'var(--color-text-light)' 
                : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              fontWeight: '700',
              fontSize: '16px',
              cursor: savingProfile ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              transition: 'all 0.3s ease',
              boxShadow: savingProfile ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!savingProfile) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              if (!savingProfile) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
              }
            }}
          >
            <MapPin size={22} />
            {savingProfile ? 'Guardando...' : 'Guardar y Actualizar Ubicación'}
          </button>
        </div>

        {/* Solicitudes Pendientes */}
        <div style={{ 
          background: 'var(--color-white)', 
          padding: 'clamp(24px, 4vw, 40px)', 
          borderRadius: '20px', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
          marginBottom: '32px',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              📋
            </div>
            <h2 style={{ 
              fontSize: 'clamp(20px, 4vw, 24px)', 
              fontWeight: '700', 
              color: 'var(--color-text)', 
              margin: 0
            }}>
              Solicitudes Pendientes
            </h2>
          </div>
          {loadingBookings ? (
            <p style={{ color: 'var(--color-text-light)', fontSize: '15px' }}>Cargando...</p>
          ) : pendingBookings.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'rgba(79, 70, 229, 0.05)',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed rgba(79, 70, 229, 0.2)'
            }}>
              <p style={{ 
                color: 'var(--color-text-light)', 
                fontSize: '15px',
                margin: 0
              }}>No tienes solicitudes pendientes en este momento.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', 
              gap: '24px' 
            }}>
              {pendingBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    padding: '24px',
                    border: 'none',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                    boxShadow: '0 4px 12px rgba(251, 191, 36, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Badge de estado */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: '#fbbf24',
                    color: '#78350f',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Pendiente
                  </div>
                  <p style={{ 
                    fontSize: '17px', 
                    fontWeight: '700', 
                    color: 'var(--color-text)', 
                    marginBottom: '8px',
                    marginTop: '8px',
                    lineHeight: '1.5',
                    paddingRight: '100px'
                  }}>
                    {booking.owner_name || 'Cliente'}
                  </p>
                  <p style={{
                    fontSize: '15px',
                    color: '#78350f',
                    marginBottom: '12px',
                    fontWeight: '500'
                  }}>
                    🐕 Paseo para <strong>{booking.pet_name || 'su mascota'}</strong>
                  </p>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '20px'
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#92400e', 
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      🕐 <strong>Inicio:</strong> {new Date(booking.start_time).toLocaleString('es-PE')}
                      <br />
                      ⏱️ <strong>Duración:</strong> {booking.hours} hora{booking.hours > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                    gap: '12px' 
                  }}>
                    <button
                      onClick={() => handleAcceptBooking(booking.id)}
                      style={{
                        padding: '14px 20px',
                        minHeight: '48px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: '700',
                        fontSize: '15px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                      }}
                    >
                      <Check size={20} /> Aceptar
                    </button>
                    <button
                      onClick={() => handleRejectBooking(booking.id)}
                      style={{
                        padding: '14px 20px',
                        minHeight: '48px',
                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: '700',
                        fontSize: '15px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(239, 68, 68, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                      }}
                    >
                      <XCircle size={20} /> Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Paseos Activos */}
        <div style={{ 
          background: 'var(--color-white)', 
          padding: 'clamp(24px, 4vw, 40px)', 
          borderRadius: '20px', 
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ✅
            </div>
            <h2 style={{ 
              fontSize: 'clamp(20px, 4vw, 24px)', 
              fontWeight: '700', 
              color: 'var(--color-text)', 
              margin: 0
            }}>
              Paseos Activos
            </h2>
          </div>
          {activeBookings.length === 0 ? (
            <div style={{
              padding: '40px 20px',
              textAlign: 'center',
              background: 'rgba(16, 185, 129, 0.05)',
              borderRadius: 'var(--radius-lg)',
              border: '2px dashed rgba(16, 185, 129, 0.2)'
            }}>
              <p style={{ 
                color: 'var(--color-text-light)', 
                fontSize: '15px',
                margin: 0
              }}>No tienes paseos activos en este momento.</p>
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', 
              gap: '24px' 
            }}>
              {activeBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    padding: '24px',
                    border: 'none',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {/* Badge de estado */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: '#10b981',
                    color: '#ffffff',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Activo
                  </div>
                  
                  <p style={{ 
                    fontSize: '17px', 
                    fontWeight: '700', 
                    color: 'var(--color-text)', 
                    marginBottom: '8px',
                    marginTop: '8px',
                    lineHeight: '1.5',
                    paddingRight: '90px'
                  }}>
                    {booking.owner_name || 'Cliente'}
                  </p>
                  <p style={{
                    fontSize: '15px',
                    color: '#065f46',
                    marginBottom: '12px',
                    fontWeight: '500'
                  }}>
                    🐕 Paseando a <strong>{booking.pet_name || 'mascota'}</strong>
                  </p>
                  <div style={{
                    padding: '12px 16px',
                    background: 'rgba(255, 255, 255, 0.7)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '20px'
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      color: '#047857', 
                      margin: 0,
                      lineHeight: '1.6'
                    }}>
                      🕐 <strong>Inicio:</strong> {new Date(booking.start_time).toLocaleString('es-PE')}
                      <br />
                      ⏱️ <strong>Duración:</strong> {booking.hours} hora{booking.hours > 1 ? 's' : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => handleOpenChat(booking.id, booking.owner_name || 'Cliente')}
                    style={{
                      width: '100%',
                      padding: '14px 24px',
                      minHeight: '52px',
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                      color: 'var(--color-white)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      fontWeight: '700',
                      fontSize: '16px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                    }}
                  >
                    <MessageCircle size={20} /> Abrir Chat con Cliente
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Window */}
        {chatOpen && (
          <ChatWindow
            bookingId={chatBookingId}
            onClose={() => setChatOpen(false)}
            otherUserName={chatOtherUser}
          />
        )}
      </div>
      </div>
    );
  }

  // Vista para Clientes (Owner)
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'var(--color-bg-app)',
      padding: 'clamp(20px, 3vw, 40px)'
    }}>
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto'
    }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '16px', 
        marginBottom: '32px',
        flexWrap: 'wrap'
      }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: 'var(--radius-xl)',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <Dog size={32} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ 
            fontSize: 'clamp(24px, 5vw, 32px)', 
            fontWeight: '800', 
            color: 'var(--color-text)', 
            margin: 0,
            letterSpacing: '-0.02em'
          }}>
            Encuentra un Paseador
          </h1>
          <p style={{
            fontSize: 'clamp(14px, 2.5vw, 16px)',
            color: 'var(--color-text-light)',
            margin: 0,
            marginTop: '4px'
          }}>
            Profesionales certificados cerca de ti
          </p>
        </div>
      </div>

      <div style={{ 
        background: 'var(--color-white)', 
        padding: 'clamp(32px, 5vw, 48px)', 
        borderRadius: '20px', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', 
        marginBottom: '32px', 
        textAlign: 'center',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
      }}>
        <div style={{
          fontSize: '48px',
          marginBottom: '16px'
        }}>
          🐕💕
        </div>
        <p style={{ 
          fontSize: 'clamp(15px, 3vw, 17px)', 
          color: 'var(--color-text)', 
          marginBottom: '24px',
          lineHeight: '1.7',
          maxWidth: '600px',
          margin: '0 auto 24px'
        }}>
          Encuentra paseadores profesionales <strong>cerca de ti</strong> para cuidar a tu mejor amigo con amor y dedicación.
        </p>
        <button
          onClick={handleSearchWalkers}
          disabled={searching}
          style={{
            padding: '18px 40px',
            minHeight: '56px',
            background: searching 
              ? 'var(--color-text-light)' 
              : 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
            color: 'var(--color-white)',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            fontWeight: '700',
            fontSize: 'clamp(16px, 3vw, 18px)',
            cursor: searching ? 'not-allowed' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.3s ease',
            boxShadow: searching ? 'none' : '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}
          onMouseEnter={(e) => {
            if (!searching) {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!searching) {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
            }
          }}
        >
          <MapPin size={24} />
          {searching ? 'Buscando...' : 'Buscar Paseadores Cercanos'}
        </button>
      </div>

      {searchError && (
        <div style={{ 
          padding: '20px 24px', 
          borderRadius: '16px', 
          background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', 
          color: '#991b1b',
          marginBottom: '32px',
          fontSize: '15px',
          fontWeight: '500',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          {searchError}
        </div>
      )}

      {walkers.length > 0 && (
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, var(--color-success) 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              👨‍🤝‍👨
            </div>
            <h2 style={{ 
              fontSize: 'clamp(20px, 4vw, 24px)', 
              fontWeight: '700', 
              color: 'var(--color-text)', 
              margin: 0
            }}>
              Paseadores Disponibles ({walkers.length})
            </h2>
          </div>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(min(320px, 100%), 1fr))', 
            gap: '24px' 
          }}>
            {walkers.map((walker, idx) => (
              <div
                key={walker.id || idx}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  border: 'none',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                }}
              >
                {/* Badge de disponibilidad */}
                {walker.available && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--color-success)',
                    color: 'var(--color-white)',
                    fontSize: '12px',
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
                  }}>
                    Disponible
                  </div>
                )}

                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  marginBottom: '16px',
                  paddingRight: walker.available ? '100px' : '0'
                }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: 'var(--radius-full)', 
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                  }}>
                    <User size={28} color="#ffffff" />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '19px', 
                      fontWeight: '700', 
                      color: 'var(--color-text)', 
                      margin: 0,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {walker.name || walker.full_name || 'Paseador'}
                    </h3>
                    {walker.distance && (
                      <p style={{ 
                        fontSize: '14px', 
                        color: 'var(--color-text-light)', 
                        margin: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        marginTop: '4px',
                        fontWeight: '500'
                      }}>
                        <MapPin size={16} /> {parseFloat(walker.distance).toFixed(2)} km de distancia
                      </p>
                    )}
                  </div>
                </div>

                {walker.bio && (
                  <div style={{
                    padding: '16px',
                    background: 'rgba(79, 70, 229, 0.05)',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: '16px'
                  }}>
                    <p style={{ 
                      fontSize: '14px', 
                      color: 'var(--color-text)', 
                      margin: 0,
                      lineHeight: '1.6',
                      overflow: 'hidden',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}>
                      {walker.bio}
                    </p>
                  </div>
                )}

                <div style={{ 
                  padding: '16px',
                  background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                  borderRadius: 'var(--radius-lg)',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '8px', 
                    fontSize: '20px', 
                    fontWeight: '800', 
                    color: '#065f46' 
                  }}>
                    <DollarSign size={22} />
                    S/ {parseFloat(walker.hourly_rate || 0).toFixed(2)} <span style={{ fontSize: '14px', fontWeight: '600' }}>/hora</span>
                  </div>
                </div>

                <button
                  onClick={() => handleContactWalker(walker)}
                  style={{
                    width: '100%',
                    padding: '16px 24px',
                    minHeight: '56px',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%)',
                    color: 'var(--color-white)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    fontWeight: '700',
                    fontSize: '16px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(79, 70, 229, 0.3)';
                  }}
                >
                  <User size={20} /> Reservar Paseo
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Reserva */}
      {showBookingModal && selectedWalker && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            padding: '8px'
          }}
          onClick={() => setShowBookingModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '500px',
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
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: 'clamp(16px, 3vw, 24px)',
              borderBottom: '1px solid #e5e7eb',
              position: 'sticky',
              top: 0,
              backgroundColor: '#ffffff',
              zIndex: 10,
              borderRadius: '16px 16px 0 0',
              gap: '12px'
            }}>
              <h2 style={{ 
                fontSize: 'clamp(18px, 4vw, 24px)', 
                fontWeight: '700', 
                color: '#1a202c', 
                margin: 0,
                flex: 1
              }}>
                Solicitar Paseo
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                type="button"
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                  minWidth: '40px',
                  minHeight: '40px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#e5e7eb'}
                onMouseLeave={(e) => e.target.style.background = '#f3f4f6'}
              >
                <X size={24} color="#718096" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div style={{ 
              padding: 'clamp(16px, 3vw, 24px)' 
            }}>
              <p style={{ 
                fontSize: 'clamp(14px, 3vw, 16px)', 
                color: '#4a5568', 
                marginBottom: '20px',
                lineHeight: '1.5'
              }}>
                Reservar con <strong>{selectedWalker.name || selectedWalker.full_name}</strong>
              </p>

              <form onSubmit={handleSubmitBooking} style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Selector de Mascota */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px',
                }}>
                  Selecciona tu Mascota
                </label>
                {myPets.length === 0 ? (
                  <p style={{ color: '#ef4444', fontSize: '14px', lineHeight: '1.5' }}>
                    No tienes mascotas registradas. <a href="/pets" style={{ color: '#667eea', textDecoration: 'underline' }}>Agrega una aquí</a>
                  </p>
                ) : (
                  <select
                    value={selectedPetId || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      console.log('🐾 Mascota seleccionada manualmente:', value, 'Tipo:', typeof value);
                      setSelectedPetId(value);  // Ya viene como STRING del select
                    }}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      outline: 'none',
                      backgroundColor: '#ffffff',
                      minHeight: '44px'
                    }}
                  >
                    <option value="" disabled>-- Elige mascota --</option>
                    {myPets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.name} ({pet.breed})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Hora de Inicio */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px',
                }}>
                  Fecha y Hora de Inicio
                </label>
                <input
                  type="datetime-local"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    minHeight: '44px'
                  }}
                />
              </div>

              {/* Horas */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px',
                }}>
                  Duración (horas)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 2"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  required
                  min="0.5"
                  step="0.5"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                    minHeight: '44px'
                  }}
                />
              </div>

              {/* Total estimado */}
              {hours && selectedWalker.hourly_rate && (
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '12px',
                  marginBottom: '24px',
                  border: '2px solid #d1fae5'
                }}>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#4a5568', 
                    marginBottom: '4px' 
                  }}>
                    Costo estimado:
                  </p>
                  <p style={{ 
                    fontSize: 'clamp(20px, 5vw, 24px)', 
                    fontWeight: '700', 
                    color: '#059669',
                    margin: 0
                  }}>
                    S/ {(parseFloat(hours) * parseFloat(selectedWalker.hourly_rate)).toFixed(2)}
                  </p>
                </div>
              )}

              {/* Footer - Sticky */}
              <div style={{
                position: 'sticky',
                bottom: 0,
                backgroundColor: '#ffffff',
                padding: 'clamp(16px, 3vw, 20px) 0 0 0',
                borderTop: '1px solid #f3f4f6',
                marginTop: '8px'
              }}>
                <button
                  type="submit"
                  disabled={bookingLoading || myPets.length === 0}
                  style={{
                    width: '100%',
                    padding: '16px',
                    minHeight: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                    backgroundColor: bookingLoading || myPets.length === 0 ? '#cbd5e0' : '#667eea',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: bookingLoading || myPets.length === 0 ? 'not-allowed' : 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!bookingLoading && myPets.length > 0) {
                      e.target.style.backgroundColor = '#5568d3';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!bookingLoading && myPets.length > 0) {
                      e.target.style.backgroundColor = '#667eea';
                    }
                  }}
                >
                  {bookingLoading ? 'Enviando...' : '📨 Enviar Solicitud'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

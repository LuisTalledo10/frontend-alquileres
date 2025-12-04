import { useState, useEffect } from 'react';
import { Dog, Plus, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function MyPets() {
  const { token } = useAuth();
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cargar mascotas
  useEffect(() => {
    const fetchPets = async () => {
      if (!token) return;
      
      try {
        const response = await fetch(`${API_URL}/api/pets`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Error al cargar mascotas');

        const data = await response.json();
        setPets(data.pets || data || []);
      } catch (err) {
        console.error(err);
        setError('Error al cargar mascotas');
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [token, refreshTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name || !breed) {
      setError('Nombre y Raza son obligatorios');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/pets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          breed,
          age: age ? parseInt(age) : null,
          notes,
        }),
      });

      if (!response.ok) throw new Error('Error al agregar mascota');

      // Limpiar formulario
      setName('');
      setBreed('');
      setAge('');
      setNotes('');
      setShowForm(false);

      // Recargar lista
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.error(err);
      setError('Error al agregar mascota');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a202c',
            marginBottom: '8px',
          }}>
            Mis Mascotas 🐕
          </h1>
          <p style={{ fontSize: '16px', color: '#718096' }}>
            Gestiona la información de tus mascotas
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            backgroundColor: '#667eea',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {showForm ? <X size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancelar' : 'Agregar Mascota'}
        </button>
      </div>

      {/* Error global */}
      {error && (
        <div style={{
          padding: '12px',
          backgroundColor: '#fed7d7',
          color: '#c53030',
          borderRadius: '8px',
          marginBottom: '24px',
        }}>
          {error}
        </div>
      )}

      {/* Formulario */}
      {showForm && (
        <div style={{
          backgroundColor: '#ffffff',
          padding: '32px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          marginBottom: '32px',
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#1a202c',
            marginBottom: '24px',
          }}>
            Agregar Nueva Mascota
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              marginBottom: '20px',
            }}>
              {/* Nombre */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px',
                }}>
                  Nombre *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Max"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Raza */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px',
                }}>
                  Raza *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Labrador"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Edad */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#4a5568',
                  marginBottom: '8px',
                }}>
                  Edad (años)
                </label>
                <input
                  type="number"
                  placeholder="Ej: 3"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="0"
                  max="30"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '16px',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Notas */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#4a5568',
                marginBottom: '8px',
              }}>
                Notas adicionales
              </label>
              <textarea
                placeholder="Alergias, comportamiento, cuidados especiales..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '16px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Botón submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: '600',
                backgroundColor: submitting ? '#a0aec0' : '#667eea',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Guardando...' : 'Guardar Mascota'}
            </button>
          </form>
        </div>
      )}

      {/* Lista de mascotas */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
          Cargando mascotas...
        </div>
      ) : pets.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          backgroundColor: '#f7fafc',
          borderRadius: '12px',
        }}>
          <Dog size={64} style={{ margin: '0 auto 16px', color: '#cbd5e0' }} />
          <h3 style={{ fontSize: '20px', color: '#4a5568', marginBottom: '8px' }}>
            No tienes mascotas registradas
          </h3>
          <p style={{ color: '#718096' }}>
            Agrega tu primera mascota para comenzar a solicitar paseos
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '24px',
        }}>
          {pets.map((pet) => (
            <div
              key={pet.id}
              style={{
                backgroundColor: '#ffffff',
                padding: '24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <Dog size={32} style={{ color: '#667eea' }} />
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1a202c' }}>
                    {pet.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#718096' }}>
                    {pet.breed}
                  </p>
                </div>
              </div>

              {pet.age && (
                <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '8px' }}>
                  <strong>Edad:</strong> {pet.age} {pet.age === 1 ? 'año' : 'años'}
                </p>
              )}

              {pet.notes && (
                <p style={{
                  fontSize: '14px',
                  color: '#718096',
                  marginTop: '12px',
                  padding: '12px',
                  backgroundColor: '#f7fafc',
                  borderRadius: '8px',
                  lineHeight: '1.5',
                }}>
                  {pet.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

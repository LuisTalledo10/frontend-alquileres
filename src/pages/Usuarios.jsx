import React, { useEffect, useState } from 'react';
import { User, Trash2, UserPlus } from 'lucide-react'; // Agregué iconos para que se vea pro

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Usuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'employee' }); // Agregué Role
  const [submitting, setSubmitting] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  // --- CARGAR USUARIOS ---
  const fetchUsers = () => {
    setLoading(true);
    fetch(`${API_URL}/api/users`)
      .then((res) => {
        if (!res.ok) throw new Error('Error cargando usuarios');
        return res.json();
      })
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar los usuarios');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- MODAL Y FORMULARIO ---
  function openModal() {
    setForm({ name: '', email: '', password: '', role: 'employee' });
    setIsModalOpen(true);
    setPasswordError('');
    setPasswordStrength('');
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') {
      validatePassword(value);
    }
  }

  function validatePassword(pw) {
    if (!pw || pw.length === 0) {
      setPasswordError('');
      setPasswordStrength('');
      return;
    }
    if (pw.length < 6) { // Bajé a 6 porque Supabase pide mínimo 6 por defecto
      setPasswordError('Mínimo 6 caracteres.');
      setPasswordStrength('weak');
      return;
    }

    const hasUpper = /[A-Z]/.test(pw);
    const hasNumber = /[0-9]/.test(pw);
    
    if (hasUpper && hasNumber && pw.length >= 8) {
      setPasswordStrength('strong');
      setPasswordError('');
    } else if (pw.length >= 6) {
      setPasswordStrength('medium');
      setPasswordError('');
    } else {
      setPasswordStrength('weak');
    }
  }

  // --- ENVÍO DE DATOS (AQUÍ ESTABA EL PROBLEMA) ---
  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!form.password || form.password.length < 6) {
      setPasswordError('La contraseña es muy corta.');
      return;
    }
    
    setSubmitting(true);
    setError(null);

    try {
      // 1. PREPARAMOS EL PAYLOAD CORRECTO
      // El backend espera "full_name", no "name".
      const payload = {
        full_name: form.name, 
        email: form.email,
        password: form.password,
        role: form.formRole || 'employee' // Por defecto empleado
      };

      console.log('Enviando al backend:', payload);

      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Error al crear usuario');
      }

      // Éxito
      alert("¡Usuario creado con éxito! 🎉");
      setSubmitting(false);
      closeModal();
      fetchUsers(); // Recargar la tabla
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
      setSubmitting(false);
    }
  }

  // --- BORRAR USUARIO ---
  const handleDelete = (id) => {
    if(!confirm("¿Seguro que quieres eliminar este usuario?")) return;
    
    fetch(`${API_URL}/api/users/${id}`, { method: 'DELETE' })
      .then(res => {
        if (!res.ok) throw new Error("Error al eliminar");
        fetchUsers();
      })
      .catch(err => alert(err.message));
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ margin: 0, color: '#1e293b' }}>Gestión de Personal</h1>
        <button
          onClick={openModal}
          style={{ background: '#2563eb', color: '#fff', padding: '10px 16px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserPlus size={18}/> Nuevo Usuario
        </button>
      </div>

      {error && (
        <div style={{ background: '#fff1f2', color: '#7f1d1d', padding: 12, borderRadius: 8, marginBottom: 16 }}>
          {error}
        </div>
      )}

      {loading ? (
        <p>Cargando equipo...</p>
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: 16, color: '#64748b' }}>Nombre</th>
                <th style={{ textAlign: 'left', padding: 16, color: '#64748b' }}>Email</th>
                <th style={{ textAlign: 'left', padding: 16, color: '#64748b' }}>Rol</th>
                <th style={{ textAlign: 'right', padding: 16, color: '#64748b' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 10, fontWeight: '500' }}>
                     <div style={{width: 32, height: 32, borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <User size={16} color="#64748b"/>
                     </div>
                     {u.full_name || u.name}
                  </td>
                  <td style={{ padding: 16, color: '#64748b' }}>{u.email}</td>
                  <td style={{ padding: 16 }}>
                    <span style={{ 
                        padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 'bold',
                        background: u.role === 'admin' ? '#dbeafe' : '#f1f5f9',
                        color: u.role === 'admin' ? '#1e40af' : '#475569'
                    }}>
                        {u.role === 'admin' ? 'Administrador' : 'Empleado'}
                    </span>
                  </td>
                  <td style={{ padding: 16, textAlign: 'right' }}>
                    <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}>
                        <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && <tr><td colSpan="4" style={{padding: 20, textAlign: 'center'}}>No hay usuarios registrados</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ width: '100%', maxWidth: 450, background: '#fff', borderRadius: 16, padding: 30, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginTop: 0, marginBottom: 20, color: '#1e293b' }}>Crear Nuevo Usuario</h2>

            <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: 15}}>
              
              <div>
                <label style={{display:'block', marginBottom: 5, fontWeight: '500', fontSize: 14}}>Nombre Completo</label>
                <input
                  name="name"
                  value={form.name} onChange={handleChange}
                  placeholder="Ej: Juan Pérez"
                  required
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{display:'block', marginBottom: 5, fontWeight: '500', fontSize: 14}}>Correo Electrónico</label>
                <input
                  name="email" type="email"
                  value={form.email} onChange={handleChange}
                  placeholder="ejemplo@empresa.com"
                  required
                  style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }}
                />
              </div>

              <div>
                <label style={{display:'block', marginBottom: 5, fontWeight: '500', fontSize: 14}}>Contraseña</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    name="password"
                    type={passwordVisible ? 'text' : 'password'}
                    value={form.password} onChange={handleChange}
                    placeholder="••••••"
                    required
                    style={{ flex: 1, padding: 10, borderRadius: 8, border: '1px solid #cbd5e1' }}
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    style={{ padding: '0 12px', borderRadius: 8, border: '1px solid #cbd5e1', background: '#f8fafc', cursor: 'pointer' }}>
                    {passwordVisible ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
                {passwordError ? (
                  <div style={{ fontSize: 12, marginTop: 5, color: '#b91c1c' }}>{passwordError}</div>
                ) : passwordStrength ? (
                  <div style={{ fontSize: 12, marginTop: 5, color: passwordStrength === 'strong' ? 'green' : passwordStrength === 'medium' ? 'orange' : 'red' }}>
                    Fortaleza: {passwordStrength === 'strong' ? 'Fuerte 💪' : passwordStrength === 'medium' ? 'Media 😐' : 'Débil ⚠️'}
                  </div>
                ) : null}
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: 12, borderRadius: 8, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: 12, borderRadius: 8, border: 'none', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
                  {submitting ? 'Creando...' : 'Crear Usuario'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
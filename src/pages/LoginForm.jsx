import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const text = await res.text();
      let data = null;
      try { data = JSON.parse(text); } catch { data = null; }

      if (!res.ok) {
        const msg = (data && (data.error || data.message)) || text || `Error ${res.status}`;
        setError(msg);
        setLoading(false);
        return;
      }

      if (data && data.token) localStorage.setItem('token', data.token);
      if (data && data.user) localStorage.setItem('user', JSON.stringify(data.user));

      setLoading(false);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 32, borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: 420 }}>
        <h2 style={{ marginBottom: 24, color: '#1e293b' }}>Iniciar Sesión</h2>

        {error && <div style={{ color: '#b91c1c', background: '#fff1f2', padding: 10, borderRadius: 8, marginBottom: 12 }}>{error}</div>}

        <input type="email" placeholder="admin@empresa.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e6edf3', marginBottom: 12 }} />

        <input type="password" placeholder="••••••" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #e6edf3', marginBottom: 18 }} />

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 12, borderRadius: 8, border: 'none', background: loading ? '#94a3b8' : '#1e293b', color: '#fff', fontWeight: 'bold' }}>{loading ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
    </div>
  );
}

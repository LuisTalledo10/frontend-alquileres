import React, { useState, useEffect } from 'react';

// Usar API local durante el desarrollo
// const API_URL = import.meta.env.VITE_API_URL;
const API_URL = "http://localhost:3000";

export default function Inventario() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!API_URL) {
      setError('API_URL no configurada (VITE_API_URL)');
      setLoading(false);
      return;
    }

    fetch(`${API_URL}/api/products`)
      .then((res) => {
        if (!res.ok) throw new Error('Respuesta inválida del servidor');
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Error cargando inventario');
        setLoading(false);
      });
  }, []);

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '16px',
  };
  const thStyle = {
    textAlign: 'left',
    padding: '8px',
    background: '#f1f5f9',
    border: '1px solid #e2e8f0',
  };
  const tdStyle = {
    padding: '8px',
    border: '1px solid #e2e8f0',
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1>Inventario de Productos</h1>

      {loading ? (
        <p>Cargando inventario...</p>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : products.length === 0 ? (
        <p>No hay productos en el inventario.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Producto</th>
                <th style={thStyle}>Descripción</th>
                <th style={thStyle}>Precio Día</th>
                <th style={thStyle}>Stock</th>
                <th style={thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id ?? p._id}>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>{p.description}</td>
                  <td style={tdStyle}>{`S/ ${Number(p.price_per_day ?? 0).toFixed(2)}`}</td>
                  <td style={tdStyle}>{p.total_quantity ?? 0}</td>
                  <td style={tdStyle}>
                    <span style={{ color: (p.total_quantity ?? 0) > 0 ? '#10b981' : '#ef4444', fontWeight: 600 }}>
                      {(p.total_quantity ?? 0) > 0 ? 'Disponible' : 'Agotado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

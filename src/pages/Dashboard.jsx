import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, Package, ShoppingBag, AlertTriangle } from 'lucide-react';

// API URL (usar variable de entorno si existe, si no fallback a localhost)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalValue: 0,
    lowStockItems: [],
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/dashboard/stats`)
      .then((res) => {
        if (!res.ok) throw new Error('Error en la respuesta del servidor');
        return res.json();
      })
      .then((data) => {
        // Esperamos que 'data' tenga la forma esperada
        setStats({
          totalProducts: data.totalProducts ?? 0,
          totalStock: data.totalStock ?? 0,
          totalValue: data.totalValue ?? 0,
          lowStockItems: Array.isArray(data.lowStockItems) ? data.lowStockItems : [],
        });
        setLoading(false);
      })
      .catch(() => {
        setError('No se pudieron cargar las estadísticas');
        setLoading(false);
      });
  }, []);

  const moneyFormat = (value) => {
    try {
      return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(value);
    } catch {
      return `S/ ${Number(value || 0).toFixed(2)}`;
    }
  };

  const containerStyle = { padding: '24px', minHeight: '100vh', background: '#f4f6f8' };
  const cardsRow = { display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' };
  const card = { flex: 1, minWidth: '200px', background: '#fff', padding: '18px', borderRadius: '10px', boxShadow: '0 6px 18px rgba(15,23,42,0.06)', display: 'flex', alignItems: 'center', gap: '12px' };
  const iconBox = { width: '48px', height: '48px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eef2ff' };

  const mainGrid = { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px' };
  const panel = { background: '#fff', padding: '16px', borderRadius: '10px', boxShadow: '0 6px 18px rgba(15,23,42,0.06)' };

  return (
    <div style={containerStyle}>
      <h1 style={{ margin: 0, marginBottom: '8px' }}>Dashboard</h1>
      <p style={{ marginTop: 0, color: '#6b7280' }}>Resumen rápido del inventario</p>

      {loading ? (
        <div style={{ marginTop: 24 }}>
          <p>Cargando métricas...</p>
        </div>
      ) : error ? (
        <div style={{ color: 'red', marginTop: 24 }}>{error}</div>
      ) : (
        <>
          <div style={cardsRow}>
            <div style={card}>
              <div style={{ ...iconBox, background: '#ecfeff' }}>
                <DollarSign size={20} color="#0369a1" />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Valor del Inventario</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{moneyFormat(stats.totalValue)}</div>
              </div>
            </div>

            <div style={card}>
              <div style={{ ...iconBox, background: '#f0fdf4' }}>
                <Package size={20} color="#065f46" />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Total Productos</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{stats.totalProducts}</div>
              </div>
            </div>

            <div style={card}>
              <div style={{ ...iconBox, background: '#fff7ed' }}>
                <ShoppingBag size={20} color="#92400e" />
              </div>
              <div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>Stock Total</div>
                <div style={{ fontSize: '20px', fontWeight: 700 }}>{stats.totalStock}</div>
              </div>
            </div>
          </div>

          <div style={mainGrid}>
            <div style={panel}>
              <h3 style={{ marginTop: 0 }}>Productos con menos Stock</h3>
              {stats.lowStockItems.length === 0 ? (
                <p>No hay productos con bajo stock.</p>
              ) : (
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.lowStockItems} margin={{ top: 10, right: 10, left: -20, bottom: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} interval={0} angle={-35} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip formatter={(value) => [value, 'Stock']} />
                      <Bar dataKey="quantity" fill="#ef4444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div style={panel}>
              <h3 style={{ marginTop: 0 }}>Alertas de Stock Bajo</h3>
              {stats.lowStockItems.length === 0 ? (
                <p>No hay alertas por el momento.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {stats.lowStockItems.map((it) => (
                    <li key={it.id ?? it.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                      <AlertTriangle size={18} color={it.quantity < 5 ? '#dc2626' : '#f59e0b'} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{it.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{it.quantity} en stock</div>
                      </div>
                      <div>
                        <span style={{
                          display: 'inline-block',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          background: it.quantity < 5 ? '#fff1f2' : '#fffbeb',
                          color: it.quantity < 5 ? '#7f1d1d' : '#7c2d12',
                          fontWeight: 700
                        }}>
                          {it.quantity < 5 ? 'Crítico' : 'Bajo'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [empresa, setEmpresa] = useState(null)
  const [cargando, setCargando] = useState(true)

  // TU URL DE RENDER ☁️
  const API_URL = "https://api-alquileres-trujillo.onrender.com" 

  useEffect(() => {
    // 1. Llamamos a tu servidor en la nube
    fetch(`${API_URL}/api/empresa-test`)
      .then(response => response.json())
      .then(data => {
        // 2. Guardamos el primer dato que llegue
        if(data && data.length > 0) {
          setEmpresa(data[0]) 
        }
        setCargando(false)
      })
      .catch(error => {
        console.error("Error cargando datos:", error)
        setCargando(false)
      })
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial', textAlign: 'center', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>Sistema SaaS: Alquileres Trujillo 🇵🇪</h1>
      <p style={{ color: '#666' }}>Conectado en tiempo real con Supabase + Render</p>
      
      {cargando ? (
        <h3 style={{ marginTop: '50px' }}>🔄 Conectando con el satélite...</h3>
      ) : empresa ? (
        <div style={{ 
          background: 'white',
          padding: '30px', 
          borderRadius: '20px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          maxWidth: '400px',
          margin: '40px auto',
          borderTop: '5px solid #007bff'
        }}>
          <h2 style={{ margin: '0 0 10px 0', color: '#007bff' }}>{empresa.name}</h2>
          <hr style={{ border: 'none', borderBottom: '1px solid #eee', margin: '20px 0' }} />
          
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
            <p>📦 <strong>Plan:</strong> <span style={{ background: '#e3f2fd', color: '#007bff', padding: '5px 10px', borderRadius: '10px', fontSize: '0.9em' }}>{empresa.plan_type.toUpperCase()}</span></p>
            <p>📡 <strong>Estado:</strong> {empresa.active ? '✅ Operativo' : '🔴 Inactivo'}</p>
          </div>

          <button style={{ 
            width: '100%',
            padding: '15px', 
            background: 'linear-gradient(45deg, #007bff, #0056b3)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }} onClick={() => alert("¡Próximamente verás el inventario aquí!")}>
            Ver Inventario
          </button>
        </div>
      ) : (
        <div style={{ color: 'red', marginTop: '20px' }}>
          <h3>⚠️ Error de Conexión</h3>
          <p>Verifica que tu backend en Render siga activo.</p>
        </div>
      )}
    </div>
  )
}

export default App
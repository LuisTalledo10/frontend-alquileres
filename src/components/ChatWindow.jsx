import { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ChatWindow({ bookingId, onClose, otherUserName }) {
  const { user, token } = useAuth();  // ✅ Obtener token del hook
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);  // ✅ Para forzar recarga
  const messagesEndRef = useRef(null);

  // Scroll al final cuando hay nuevos mensajes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Polling cada 3 segundos
  useEffect(() => {
    if (!token || !bookingId) return;

    // Cargar mensajes
    const fetchMessages = async () => {
      try {
        // ✅ Ruta corregida: /api/chat/:bookingId
        const response = await fetch(`${API_URL}/api/chat/${bookingId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          console.error('❌ Error GET /api/chat:', response.status, response.statusText);
          throw new Error('Error al cargar mensajes');
        }

        const data = await response.json();
        console.log('✅ Mensajes cargados:', data);
        setMessages(data.messages || data || []);
        setLoading(false);
      } catch (err) {
        console.error('❌ Error cargando mensajes:', err);
        setLoading(false);
      }
    };
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [bookingId, token, refreshTrigger]);  // ✅ Agregar refreshTrigger

  // Scroll al cargar mensajes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Enviar mensaje
  const handleSend = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;

    setSending(true);

    try {
      // ✅ Ruta corregida: /api/chat
      // ✅ Body corregido: { booking_id, content }
      const payload = {
        booking_id: bookingId,
        content: newMessage.trim(),
      };

      console.log('📤 Enviando mensaje:', payload);

      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Error POST /api/chat:', response.status, errorData);
        throw new Error(errorData.message || 'Error al enviar mensaje');
      }

      const data = await response.json();
      console.log('✅ Mensaje enviado:', data);

      setNewMessage('');
      setRefreshTrigger(prev => prev + 1);  // ✅ Forzar recarga inmediata
    } catch (err) {
      console.error('❌ Error al enviar mensaje:', err);
      alert('Error al enviar mensaje: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '400px',
      height: '600px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
    }}>
      {/* Header */}
      <div style={{
        padding: '20px',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#667eea',
        borderRadius: '16px 16px 0 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <MessageCircle size={24} style={{ color: '#ffffff' }} />
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff' }}>
              Chat
            </h3>
            <p style={{ fontSize: '14px', color: '#e0e7ff' }}>
              {otherUserName || 'Conversación'}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#ffffff',
          }}
        >
          <X size={24} />
        </button>
      </div>

      {/* Mensajes */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        backgroundColor: '#f7fafc',
      }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            Cargando mensajes...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>
            No hay mensajes aún. ¡Envía el primero! 👋
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMyMessage = msg.sender_id === user?.id || msg.user_id === user?.id;
            
            return (
              <div
                key={msg.id || index}
                style={{
                  display: 'flex',
                  justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                  marginBottom: '16px',
                }}
              >
                <div style={{
                  maxWidth: '70%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: isMyMessage ? '#667eea' : '#ffffff',
                  color: isMyMessage ? '#ffffff' : '#1a202c',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}>
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.5',
                    margin: 0,
                  }}>
                    {msg.message || msg.content}
                  </p>
                  <p style={{
                    fontSize: '11px',
                    marginTop: '6px',
                    opacity: 0.7,
                  }}>
                    {new Date(msg.created_at).toLocaleTimeString('es-PE', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        style={{
          padding: '16px',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: '12px',
        }}
      >
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          disabled={sending}
          style={{
            flex: 1,
            padding: '12px 16px',
            fontSize: '14px',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            outline: 'none',
          }}
          onFocus={(e) => e.target.style.borderColor = '#667eea'}
          onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          style={{
            padding: '12px 16px',
            backgroundColor: sending || !newMessage.trim() ? '#cbd5e0' : '#667eea',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: sending || !newMessage.trim() ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}

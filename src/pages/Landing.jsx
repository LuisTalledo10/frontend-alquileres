import { useNavigate } from 'react-router-dom';
import { Dog, Heart, Shield, Star, MapPin, Award, Sparkles } from 'lucide-react';
import logo from '../assets/logo.png';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--color-bg-app)',
    }}>
      {/* Hero Section con Patrón de Fondo */}
      <div style={{
        position: 'relative',
        minHeight: '90vh',
        background: 'linear-gradient(135deg, #4f46e5 0%, #f43f5e 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Patrón de fondo decorativo */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Overlay degradado */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.9) 0%, rgba(244, 63, 94, 0.85) 100%)',
        }} />

        {/* Contenido Hero */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'clamp(40px, 8vw, 100px) clamp(20px, 4vw, 40px)',
          textAlign: 'center',
        }}>
          {/* Main Title - GIGANTE */}
          <h1 style={{
            fontSize: 'clamp(40px, 8vw, 72px)',
            fontWeight: '900',
            color: '#ffffff',
            marginBottom: '24px',
            lineHeight: '1.1',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}>
            Tu Perro Merece<br />
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Los Mejores Paseos
            </span>
            <img src={logo} alt="DogWalker" style={{ width: '180px', height: '180px', objectFit: 'contain', marginTop: '8px' }} />
          </h1>

          {/* Subtitle */}
          <p style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: 'rgba(255, 255, 255, 0.95)',
            marginBottom: '48px',
            maxWidth: '800px',
            margin: '0 auto 48px',
            lineHeight: '1.6',
            fontWeight: '400',
          }}>
            Conecta con paseadores profesionales verificados cerca de ti o comienza a <strong>ganar dinero</strong> paseando perros adorables
          </p>

          {/* CTA Buttons - GRANDES con diferenciación */}
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: '60px',
          }}>
            {/* Botón Primario - Soy Dueño */}
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '22px 50px',
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                color: '#4f46e5',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 0 0 0 rgba(255,255,255,0.5)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: '280px',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-6px) scale(1.02)';
                e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4), 0 0 0 4px rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3), 0 0 0 0 rgba(255,255,255,0.5)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <Dog size={26} />
                Soy Dueño - Buscar Paseador
              </span>
            </button>

            {/* Botón Secundario/Outline - Soy Paseador */}
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '22px 50px',
                fontSize: 'clamp(18px, 2.5vw, 22px)',
                fontWeight: '700',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                color: '#ffffff',
                border: '3px solid rgba(255, 255, 255, 0.8)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                minWidth: '280px',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                e.target.style.color = '#4f46e5';
                e.target.style.border = '3px solid #ffffff';
                e.target.style.transform = 'translateY(-6px) scale(1.02)';
                e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = '#ffffff';
                e.target.style.border = '3px solid rgba(255, 255, 255, 0.8)';
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <Award size={26} />
                Soy Paseador - Ganar Dinero
              </span>
            </button>
          </div>

          {/* Call to Action Simple */}
          <div style={{
            marginTop: '24px',
            fontSize: '16px',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: '500',
          }}>
            Comienza hoy mismo y descubre una nueva forma de cuidar a tu mascota
          </div>
        </div>
      </div>

      {/* Features Section - Tarjetas Flotantes con Iconos Grandes */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(60px, 10vw, 100px) clamp(20px, 4vw, 40px)',
      }}>
        {/* Section Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '60px',
        }}>
          <h2 style={{
            fontSize: 'clamp(32px, 6vw, 48px)',
            fontWeight: '800',
            color: 'var(--color-text)',
            marginBottom: '16px',
            letterSpacing: '-0.01em',
          }}>
            ¿Por qué elegir DogWalker? ✨
          </h2>
          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#64748b',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            La forma más segura y confiable de encontrar el paseador perfecto para tu mejor amigo
          </p>
        </div>

        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
          gap: 'clamp(24px, 4vw, 40px)',
        }}>
          {/* Feature Card 1 */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: 'clamp(32px, 5vw, 48px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              textAlign: 'center',
              border: '1px solid rgba(79, 70, 229, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(79, 70, 229, 0.15)';
              e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1.1) rotate(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
              e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            <div
              className="icon-container"
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(79, 70, 229, 0.3)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Shield size={44} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h3 style={{
              fontSize: 'clamp(20px, 3vw, 24px)',
              fontWeight: '700',
              color: 'var(--color-text)',
              marginBottom: '12px',
            }}>
              100% Verificados
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              lineHeight: '1.6',
            }}>
              Todos nuestros paseadores son verificados con antecedentes penales y referencias comprobadas
            </p>
          </div>

          {/* Feature Card 2 */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: 'clamp(32px, 5vw, 48px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              textAlign: 'center',
              border: '1px solid rgba(244, 63, 94, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(244, 63, 94, 0.15)';
              e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1.1) rotate(-5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
              e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            <div
              className="icon-container"
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(244, 63, 94, 0.3)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <MapPin size={44} color="#ffffff" strokeWidth={2.5} />
            </div>
            <h3 style={{
              fontSize: 'clamp(20px, 3vw, 24px)',
              fontWeight: '700',
              color: 'var(--color-text)',
              marginBottom: '12px',
            }}>
              Rastreo en Tiempo Real
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              lineHeight: '1.6',
            }}>
              Sigue el paseo de tu perro en vivo y recibe fotos/videos durante el recorrido
            </p>
          </div>

          {/* Feature Card 3 */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: 'clamp(32px, 5vw, 48px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              textAlign: 'center',
              border: '1px solid rgba(16, 185, 129, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-12px)';
              e.currentTarget.style.boxShadow = '0 20px 50px rgba(16, 185, 129, 0.15)';
              e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1.1) rotate(5deg)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
              e.currentTarget.querySelector('.icon-container').style.transform = 'scale(1) rotate(0deg)';
            }}
          >
            <div
              className="icon-container"
              style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            >
              <Heart size={44} color="#ffffff" strokeWidth={2.5} fill="#ffffff" />
            </div>
            <h3 style={{
              fontSize: 'clamp(20px, 3vw, 24px)',
              fontWeight: '700',
              color: 'var(--color-text)',
              marginBottom: '12px',
            }}>
              Seguro Incluido
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#64748b',
              lineHeight: '1.6',
            }}>
              Cobertura completa de responsabilidad civil y seguro veterinario durante todos los paseos
            </p>
          </div>


        </div>

        {/* CTA Final */}
        <div style={{
          marginTop: 'clamp(60px, 10vw, 100px)',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #4f46e5 0%, #f43f5e 100%)',
          borderRadius: '24px',
          padding: 'clamp(48px, 8vw, 80px) clamp(24px, 4vw, 48px)',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Patrón decorativo */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />

          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{
              fontSize: 'clamp(28px, 5vw, 42px)',
              fontWeight: '800',
              color: '#ffffff',
              marginBottom: '20px',
              letterSpacing: '-0.01em',
            }}>
              ¿Listo para dar el primer paso? 🚀
            </h2>
            <p style={{
              fontSize: 'clamp(16px, 2.5vw, 20px)',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '32px',
              maxWidth: '700px',
              margin: '0 auto 32px',
            }}>
              Crea tu cuenta gratis y empieza a disfrutar de paseos profesionales
            </p>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '22px 60px',
                fontSize: '20px',
                fontWeight: '700',
                background: '#ffffff',
                color: '#4f46e5',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-6px) scale(1.05)';
                e.target.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
              }}
            >
              Crear Cuenta Gratis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

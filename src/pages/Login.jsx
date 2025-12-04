import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Dog, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const { login } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.state?.from?.pathname || '/';

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

			// Use context login to update global auth state
			if (data && data.token) {
				login(data.token, data.user || null);
			}

			setLoading(false);
			navigate(from, { replace: true });
		} catch (err) {
			console.error(err);
			setError('Error de conexión con el servidor');
			setLoading(false);
		}
	};

	return (
		<div>
			{/* Split Screen Container */}
			<div style={{
				minHeight: 'calc(100vh - 72px)',
				display: 'flex',
				flexDirection: 'row',
			}}>
				{/* Left Side - Brand Image/Pattern (Desktop Only) */}
				<div style={{
					flex: '1',
					background: 'linear-gradient(135deg, #4f46e5 0%, #f43f5e 100%)',
					position: 'relative',
					overflow: 'hidden',
					display: 'none',
				}}
				className="login-left-panel"
				>
					{/* Patrón de fondo */}
					<div style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						opacity: 0.1,
						backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
					}} />

				{/* Contenido del panel izquierdo */}
				<div style={{
					position: 'relative',
					zIndex: 10,
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					padding: 'clamp(200px, 5vw, 60px)',
					textAlign: 'center',
				}}>
					{/* Icono grande */}
					<div style={{
						marginBottom: '32px',
					}}>
						<img src={logo} alt="PetWalk Logo" style={{ width: '120px', height: '120px', objectFit: 'contain' }} />
					</div>						{/* Texto */}
						<h2 style={{
							fontSize: 'clamp(28px, 3vw, 42px)',
							fontWeight: '800',
							color: '#ffffff',
							marginBottom: '20px',
							lineHeight: '1.2',
						}}>
							DogWalker
						</h2>
						<p style={{
							fontSize: 'clamp(16px, 2vw, 20px)',
							color: 'rgba(255, 255, 255, 0.9)',
							lineHeight: '1.6',
							maxWidth: '450px',
						}}>
							Conecta con los mejores paseadores profesionales y dale a tu perro la experiencia que merece
						</p>

					{/* Features */}
					<div style={{
						marginTop: '48px',
						display: 'flex',
						flexDirection: 'column',
						gap: '20px',
						alignItems: 'center',
						width: '100%',
						maxWidth: '420px',
					}}>
							<div style={{
								display: 'flex',
								alignItems: 'center',
								gap: '16px',
								background: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(10px)',
								padding: '16px 24px',
								borderRadius: '12px',
								width: '100%',
								border: '1px solid rgba(255, 255, 255, 0.2)',
							}}>
								<div style={{
									width: '40px',
									height: '40px',
									background: 'rgba(255, 255, 255, 0.3)',
									borderRadius: '10px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
									<Sparkles size={24} color="#ffffff" />
								</div>
								<div style={{ textAlign: 'left' }}>
									<div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
										Paseadores Verificados
									</div>
									<div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
										100% confiables
									</div>
								</div>
							</div>

							<div style={{
								display: 'flex',
								alignItems: 'center',
								gap: '16px',
								background: 'rgba(255, 255, 255, 0.15)',
								backdropFilter: 'blur(10px)',
								padding: '16px 24px',
								borderRadius: '12px',
								width: '100%',
								border: '1px solid rgba(255, 255, 255, 0.2)',
							}}>
								<div style={{
									width: '40px',
									height: '40px',
									background: 'rgba(255, 255, 255, 0.3)',
									borderRadius: '10px',
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
								}}>
									<Dog size={24} color="#ffffff" />
								</div>
								<div style={{ textAlign: 'left' }}>
									<div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff' }}>
										Rastreo en Vivo
									</div>
									<div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>
										Sigue cada paseo
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Side - Form */}
				<div style={{
					flex: '1',
					background: 'var(--color-bg-app)',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					padding: 'clamp(24px, 4vw, 60px)',
					minWidth: '320px',
				}}>
					{/* Formulario Container */}
					<div style={{
						maxWidth: '480px',
						width: '100%',
					}}>
						{/* Header */}
						<div style={{ marginBottom: '40px' }}>
							<h1 style={{
								fontSize: 'clamp(32px, 5vw, 42px)',
								fontWeight: '800',
								color: 'var(--color-text)',
								marginBottom: '12px',
							}}>
								Bienvenido de nuevo 👋
							</h1>
							<p style={{
								fontSize: 'clamp(16px, 2vw, 18px)',
								color: '#64748b',
							}}>
								Ingresa a tu cuenta para continuar
							</p>
						</div>

						{/* Formulario */}
						<form onSubmit={handleSubmit}>
							{/* Email */}
							<div style={{ marginBottom: '24px' }}>
								<label style={{
									display: 'block',
									fontSize: '14px',
									fontWeight: '600',
									color: 'var(--color-text)',
									marginBottom: '8px',
								}}>
									Email
								</label>
								<div style={{ position: 'relative' }}>
									<Mail size={20} style={{
										position: 'absolute',
										left: '16px',
										top: '50%',
										transform: 'translateY(-50%)',
										color: '#94a3b8',
										zIndex: 1,
									}} />
									<input
										type="email"
										placeholder="tu@email.com"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										required
										style={{
											width: '100%',
											padding: '16px 16px 16px 48px',
											fontSize: '16px',
											background: '#f8fafc',
											border: '2px solid transparent',
											borderRadius: '12px',
											outline: 'none',
											transition: 'all 0.3s ease',
											fontFamily: 'Poppins, sans-serif',
										}}
										onFocus={(e) => {
											e.target.style.borderColor = 'var(--color-primary)';
											e.target.style.background = '#ffffff';
											e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
										}}
										onBlur={(e) => {
											e.target.style.borderColor = 'transparent';
											e.target.style.background = '#f8fafc';
											e.target.style.boxShadow = 'none';
										}}
									/>
								</div>
							</div>

							{/* Password */}
							<div style={{ marginBottom: '32px' }}>
								<label style={{
									display: 'block',
									fontSize: '14px',
									fontWeight: '600',
									color: 'var(--color-text)',
									marginBottom: '8px',
								}}>
									Contraseña
								</label>
								<div style={{ position: 'relative' }}>
									<Lock size={20} style={{
										position: 'absolute',
										left: '16px',
										top: '50%',
										transform: 'translateY(-50%)',
										color: '#94a3b8',
										zIndex: 1,
									}} />
									<input
										type="password"
										placeholder="Ingresa tu contraseña"
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										required
										style={{
											width: '100%',
											padding: '16px 16px 16px 48px',
											fontSize: '16px',
											background: '#f8fafc',
											border: '2px solid transparent',
											borderRadius: '12px',
											outline: 'none',
											transition: 'all 0.3s ease',
											fontFamily: 'Poppins, sans-serif',
										}}
										onFocus={(e) => {
											e.target.style.borderColor = 'var(--color-primary)';
											e.target.style.background = '#ffffff';
											e.target.style.boxShadow = '0 0 0 4px rgba(79, 70, 229, 0.1)';
										}}
										onBlur={(e) => {
											e.target.style.borderColor = 'transparent';
											e.target.style.background = '#f8fafc';
											e.target.style.boxShadow = 'none';
										}}
									/>
								</div>
							</div>

							{/* Error Message */}
							{error && (
								<div style={{
									marginBottom: '24px',
									padding: '16px',
									background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
									color: '#dc2626',
									borderRadius: '12px',
									fontSize: '14px',
									fontWeight: '600',
									textAlign: 'center',
									border: '1px solid #fca5a5',
								}}>
									{error}
								</div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={loading}
								style={{
									width: '100%',
									padding: '18px',
									fontSize: '17px',
									fontWeight: '700',
									background: loading
										? '#94a3b8'
										: 'linear-gradient(135deg, var(--color-primary) 0%, #7c3aed 100%)',
									color: '#ffffff',
									border: 'none',
									borderRadius: 'var(--radius-full)',
									cursor: loading ? 'not-allowed' : 'pointer',
									transition: 'all 0.3s ease',
									marginBottom: '24px',
									boxShadow: loading ? 'none' : '0 4px 14px rgba(79, 70, 229, 0.4)',
								}}
								onMouseEnter={(e) => {
									if (!loading) {
										e.target.style.transform = 'translateY(-2px)';
										e.target.style.boxShadow = '0 6px 20px rgba(79, 70, 229, 0.5)';
									}
								}}
								onMouseLeave={(e) => {
									if (!loading) {
										e.target.style.transform = 'translateY(0)';
										e.target.style.boxShadow = '0 4px 14px rgba(79, 70, 229, 0.4)';
									}
								}}
							>
								{loading ? 'Ingresando...' : 'Iniciar Sesión'}
							</button>

							{/* Link a Registro */}
							<p style={{
								textAlign: 'center',
								fontSize: '15px',
								color: '#64748b',
							}}>
								¿No tienes cuenta?{' '}
								<span
									onClick={() => navigate('/register')}
									style={{
										color: 'var(--color-primary)',
										fontWeight: '700',
										cursor: 'pointer',
										transition: 'color 0.2s ease',
									}}
									onMouseEnter={(e) => {
										e.target.style.color = 'var(--color-accent)';
										e.target.style.textDecoration = 'underline';
									}}
									onMouseLeave={(e) => {
										e.target.style.color = 'var(--color-primary)';
										e.target.style.textDecoration = 'none';
									}}
								>
									Regístrate aquí
								</span>
							</p>
						</form>
					</div>
				</div>
			</div>

			{/* CSS para mostrar/ocultar panel izquierdo en responsive */}
			<style>{`
				@media (min-width: 768px) {
					.login-left-panel {
						display: flex !important;
					}
				}
			`}</style>
		</div>
	);
}

import React, { useState } from 'react';
import { usuariosAPI } from '../services/api';

function Login({ onLoginExitoso }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [vistaRegistro, setVistaRegistro] = useState(false);
  const [nombreNuevo, setNombreNuevo] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      setError(null);

      if (!email || !password) {
        setError('Por favor ingresa email y contraseña');
        setCargando(false);
        return;
      }

      // Verificar si es ADMIN
      if (email === 'admin' && password === '123456789') {
        const adminUser = {
          id_usuario: 'ADMIN_001',
          nombre_usuario: 'Administrador',
          email_usuario: 'admin',
          rol: 'admin'
        };
        
        localStorage.setItem('usuario', JSON.stringify(adminUser));
        localStorage.setItem('sesionActiva', 'true');
        localStorage.setItem('emailUsuario', 'admin');
        localStorage.setItem('rolUsuario', 'admin');
        
        console.log('✅ Login admin exitoso');
        onLoginExitoso(adminUser);
        return;
      }

      // Verificar que el usuario NORMAL exista en la base de datos
      const todosResponse = await usuariosAPI.obtenerTodos();
      const usuarios = todosResponse.datos || [];
      
      const usuarioExistente = usuarios.find(u => 
        u.email_usuario === email || u.emailUsuario === email
      );

      if (!usuarioExistente) {
        setError('❌ Email no registrado en la base de datos');
        setCargando(false);
        return;
      }

      // Usuario normal existe - proceder con login
      localStorage.setItem('usuario', JSON.stringify(usuarioExistente));
      localStorage.setItem('sesionActiva', 'true');
      localStorage.setItem('emailUsuario', email);
      localStorage.setItem('rolUsuario', 'usuario');
      
      console.log('✅ Login exitoso para:', email);
      onLoginExitoso(usuarioExistente);
      
    } catch (err) {
      setError('Error al conectar con el servidor: ' + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleRegistro = async (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      setError(null);

      if (!nombreNuevo || !email || !password) {
        setError('Por favor completa todos los campos');
        setCargando(false);
        return;
      }

      // Verificar que el email NO exista ya
      const todosResponse = await usuariosAPI.obtenerTodos();
      const usuarios = todosResponse.datos || [];
      
      const emailYaExiste = usuarios.some(u => 
        u.email_usuario === email || u.emailUsuario === email
      );

      if (emailYaExiste) {
        setError('❌ Este email ya está registrado');
        setCargando(false);
        return;
      }

      // Crear nuevo usuario
      const response = await usuariosAPI.crear({
        nombreUsuario: nombreNuevo,
        emailUsuario: email,
        passwordHash: password,
        experiencia: 'Principiante'
      });

      if (response.exito && response.datos) {
        console.log('✅ Usuario registrado:', email);
        
        // Auto-login después de registrarse
        localStorage.setItem('usuario', JSON.stringify(response.datos));
        localStorage.setItem('sesionActiva', 'true');
        localStorage.setItem('emailUsuario', email);
        
        onLoginExitoso(response.datos);
      } else {
        setError(response.mensaje || 'Error al registrarse');
      }
    } catch (err) {
      setError('Error al registrarse: ' + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: '#222',
        border: '2px solid #4ade80',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(74, 222, 128, 0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#4ade80', marginBottom: '30px' }}>
          🌱 Planta Cuidado
        </h1>

        {error && (
          <div style={{
            background: '#ef4444',
            color: '#fff',
            padding: '12px',
            borderRadius: '6px',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={vistaRegistro ? handleRegistro : handleLogin}>
          {vistaRegistro && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ color: '#a0a0a0', display: 'block', marginBottom: '5px' }}>
                Nombre
              </label>
              <input
                type="text"
                value={nombreNuevo}
                onChange={(e) => setNombreNuevo(e.target.value)}
                placeholder="Tu nombre"
                required={vistaRegistro}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#1a1a1a',
                  border: '1px solid #4ade80',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '1rem',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '15px' }}>
            <label style={{ color: '#a0a0a0', display: 'block', marginBottom: '5px' }}>
              Email o Usuario
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com o admin"
              required
              style={{
                width: '100%',
                padding: '10px',
                background: '#1a1a1a',
                border: '1px solid #4ade80',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ color: '#a0a0a0', display: 'block', marginBottom: '5px' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '10px',
                background: '#1a1a1a',
                border: '1px solid #4ade80',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '1rem',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '12px',
              background: '#4ade80',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: cargando ? 'not-allowed' : 'pointer',
              opacity: cargando ? 0.7 : 1
            }}
          >
            {cargando ? '⏳ Cargando...' : (vistaRegistro ? '📝 Registrarse' : '🔓 Iniciar Sesión')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', color: '#a0a0a0' }}>
          {vistaRegistro ? (
            <>
              ¿Ya tienes cuenta?{' '}
              <button
                onClick={() => setVistaRegistro(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4ade80',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '1rem'
                }}
              >
                Inicia sesión
              </button>
            </>
          ) : (
            <>
              ¿No tienes cuenta?{' '}
              <button
                onClick={() => setVistaRegistro(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4ade80',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontSize: '1rem'
                }}
              >
                Regístrate
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;

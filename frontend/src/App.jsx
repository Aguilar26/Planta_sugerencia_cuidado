import React, { useState, useEffect } from 'react';
import Statistics from './components/Statistics';
import UserList from './components/UserList';
import UserForm from './components/UserForm';
import PlantList from './components/PlantList';
import PlantForm from './components/PlantForm';
import AlertManager from './components/AlertManager';
import Login from './components/Login';
import Recomendaciones from './components/Recomendaciones';
import PreferenciasFormulario from './components/PreferenciasFormulario';

function App() {
  const [rolUsuario, setRolUsuario] = useState(null);
  const [sesionActiva, setSesionActiva] = useState(false);
  const [vistaActual, setVistaActual] = useState('estadisticas');
  const [modoEdicion, setModoEdicion] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [necesitaPreferencias, setNecesitaPreferencias] = useState(false);

  // 🔐 Cargar sesión
  useEffect(() => {
    const sesion = localStorage.getItem('sesionActiva');
    const rol = localStorage.getItem('rolUsuario');

    if (sesion === 'true' && rol) {
      setSesionActiva(true);
      setRolUsuario(rol);
    }
  }, []);

  const cerrarSesion = () => {
    localStorage.clear();
    setSesionActiva(false);
    setRolUsuario(null);
    setUsuarioActual(null);
    setVistaActual('estadisticas');
  };

  const handleLoginExitoso = (usuario) => {
    // usuario puede venir con rol (admin) o sin rol (usuario normal)
    const rol = (usuario && usuario.rol) ? usuario.rol : localStorage.getItem('rolUsuario') || 'usuario';
    setSesionActiva(true);
    setRolUsuario(rol);
    setUsuarioActual(usuario || JSON.parse(localStorage.getItem('usuario') || '{}'));

    // Si es usuario normal, verificar si ya completó preferencias
    if (rol === 'usuario') {
      const preferenciaCompleta = localStorage.getItem('preferenciasFuleno') === 'true';
      if (!preferenciaCompleta) {
        setNecesitaPreferencias(true);
        return;
      }
    }

    // Asegurar persistencia
    localStorage.setItem('sesionActiva', 'true');
    localStorage.setItem('rolUsuario', rol);
    if (usuario) {
      try { localStorage.setItem('usuario', JSON.stringify(usuario)); } catch (e) { /* ignore */ }
    }
  };

  const navegarA = (vista) => {
    setVistaActual(vista);
    setModoEdicion(null);
  };

  /* =======================
     🔒 LOGIN
  ======================== */
  if (!sesionActiva) {
    return <Login onLoginExitoso={handleLoginExitoso} />;
  }

  // Si el usuario normal necesita completar preferencias
  if (necesitaPreferencias && rolUsuario === 'usuario') {
    return (
      <PreferenciasFormulario
        onGuardado={() => {
          setNecesitaPreferencias(false);
          // Persistencia después de guardar preferencias
          localStorage.setItem('preferenciasFuleno', 'true');
          localStorage.setItem('sesionActiva', 'true');
          localStorage.setItem('rolUsuario', rolUsuario);
        }}
      />
    );
  }

  /* =======================
     👤 USUARIO NORMAL
     👉 PLANTFORM
  ======================== */
  if (rolUsuario !== 'admin') {
    return (
      <div className="app">
        <header className="header">
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
            <h1 className="logo">🌱 Recomendador de Plantas</h1>
            <button
              onClick={cerrarSesion}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </header>

        <main className="main">
          <div className="container">
            <Recomendaciones />
          </div>
        </main>
      </div>
    );
  }

  /* =======================
     🔐 ADMIN
  ======================== */
  const renderizarContenido = () => {
    switch (vistaActual) {
      case 'estadisticas':
        return <Statistics />;

      case 'usuarios':
        return modoEdicion ? (
          <UserForm
            usuario={modoEdicion}
            onCancelar={() => setModoEdicion(null)}
            onGuardado={() => {
              setModoEdicion(null);
              setVistaActual('usuarios');
            }}
          />
        ) : (
          <UserList onEditar={(user) => setModoEdicion(user)} />
        );

      case 'plantas':
        return modoEdicion ? (
          <PlantForm
            planta={modoEdicion}
            onCancelar={() => setModoEdicion(null)}
            onGuardado={() => {
              setModoEdicion(null);
              setVistaActual('plantas');
            }}
          />
        ) : (
          <PlantList
            onEditar={(plant) => setModoEdicion(plant)}
            onAgregar={() => navegarA('nueva-planta')}
          />
        );

      case 'nueva-planta':
        return (
          <PlantForm
            onCancelar={() => navegarA('plantas')}
            onGuardado={() => navegarA('plantas')}
          />
        );

      case 'nuevo-usuario':
        return (
          <UserForm
            onCancelar={() => navegarA('usuarios')}
            onGuardado={() => navegarA('usuarios')}
          />
        );

      case 'alertas':
        return <AlertManager />;

      default:
        return <Statistics />;
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <h1 className="logo">🔐 Panel Administrador</h1>
            <p className="subtitle">Sistema de Gestión</p>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {vistaActual === 'plantas' && (
              <button
                className="btn-primary"
                onClick={() => navegarA('nueva-planta')}
                style={{ whiteSpace: 'nowrap' }}
              >
                ➕ Nueva Planta
              </button>
            )}

            <button
              onClick={cerrarSesion}
              style={{
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              🚪 Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="container">
          <button onClick={() => navegarA('estadisticas')}>📊 Estadísticas</button>
          <button onClick={() => navegarA('usuarios')}>👥 Usuarios</button>
          <button onClick={() => navegarA('plantas')}>🌿 Plantas</button>
          <button onClick={() => navegarA('alertas')}>🔔 Alertas</button>
        </div>
      </nav>

      {(vistaActual === 'usuarios' || vistaActual === 'plantas') && !modoEdicion && (
        <div className="container" style={{ marginTop: '20px' }}>
          <button
            className="btn-primary"
            onClick={() => navegarA(vistaActual === 'usuarios' ? 'nuevo-usuario' : 'nueva-planta')}
          >
            ➕ {vistaActual === 'usuarios' ? 'Nuevo Usuario' : 'Nueva Planta'}
          </button>
        </div>
      )}

      <main className="main">
        <div className="container">{renderizarContenido()}</div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>🔐 Panel Administrador - 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default App;

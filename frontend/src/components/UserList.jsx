import React, { useState, useEffect } from 'react';
import { usuariosAPI } from '../services/api';

function UserList({ onEditar }) {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await usuariosAPI.obtenerTodos();
      
      if (response.exito) {
        setUsuarios(response.datos);
      } else {
        setError('Error al cargar usuarios');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) {
      return;
    }

    try {
      const response = await usuariosAPI.eliminar(id);
      
      if (response.exito) {
        setMensaje('Usuario eliminado exitosamente');
        cargarUsuarios();
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setError('Error al eliminar usuario');
      }
    } catch (err) {
      setError('Error al eliminar usuario');
      console.error(err);
    }
  };

  if (cargando) {
    return (
      <div className="loading">
        <p>⏳ Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#4ade80' }}>
        👥 Gestión de Usuarios
      </h2>

      {mensaje && (
        <div className="success">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button className="btn-secondary" onClick={cargarUsuarios}>
            🔄 Reintentar
          </button>
        </div>
      )}

      {usuarios.length === 0 ? (
        <div className="card">
          <p style={{ color: '#a0a0a0', textAlign: 'center' }}>
            No hay usuarios registrados
          </p>
        </div>
      ) : (
        <div className="list">
          {usuarios.map((usuario) => (
            <div key={usuario.id_usuario} className="list-item">
              <div className="list-item-content">
                <h3>{usuario.nombre_usuario}</h3>
                <p>📧 {usuario.email_usuario}</p>
                <p>
                  <span className={`badge ${
                    usuario.experiencia === 'Principiante' ? 'badge-success' :
                    usuario.experiencia === 'Intermedio' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {usuario.experiencia}
                  </span>
                  {usuario.espacio_disponible && (
                    <span style={{ marginLeft: '10px', color: '#a0a0a0' }}>
                      📍 {usuario.espacio_disponible}
                    </span>
                  )}
                  {usuario.condiciones_luz && (
                    <span style={{ marginLeft: '10px', color: '#a0a0a0' }}>
                      ☀️ {usuario.condiciones_luz}
                    </span>
                  )}
                </p>
                {usuario.objetivos && (
                  <p style={{ color: '#a0a0a0', fontSize: '0.9rem', marginTop: '5px' }}>
                    🎯 {usuario.objetivos}
                  </p>
                )}
                <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px' }}>
                  Registrado: {new Date(usuario.fecha_registro).toLocaleDateString('es-ES')}
                </p>
              </div>
              
              <div className="list-item-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => onEditar(usuario)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleEliminar(usuario.id_usuario)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', color: '#a0a0a0', fontSize: '0.9rem' }}>
        <p>Total de usuarios: {usuarios.length}</p>
      </div>
    </div>
  );
}

export default UserList;
import React, { useState, useEffect } from 'react';
import { alertasAPI } from '../services/api';

function AlertManager() {
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [filtro, setFiltro] = useState('todas'); // todas, pendientes, completadas

  useEffect(() => {
    cargarAlertas();
  }, []);

  const cargarAlertas = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await alertasAPI.obtenerTodas();
      
      if (response.exito) {
        setAlertas(response.datos);
      } else {
        setError('Error al cargar alertas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleCompletar = async (id) => {
    try {
      const response = await alertasAPI.completar(id);
      
      if (response.exito) {
        setMensaje('Alerta completada exitosamente');
        cargarAlertas();
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setError('Error al completar alerta');
      }
    } catch (err) {
      setError('Error al completar alerta');
      console.error(err);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta alerta?')) {
      return;
    }

    try {
      const response = await alertasAPI.eliminar(id);
      
      if (response.exito) {
        setMensaje('Alerta eliminada exitosamente');
        cargarAlertas();
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setError('Error al eliminar alerta');
      }
    } catch (err) {
      setError('Error al eliminar alerta');
      console.error(err);
    }
  };

  const alertasFiltradas = alertas.filter(alerta => {
    if (filtro === 'pendientes') return !alerta.completada;
    if (filtro === 'completadas') return alerta.completada;
    return true;
  });

  const obtenerIconoTipo = (tipo) => {
    switch(tipo) {
      case 'Riego': return '💧';
      case 'Poda': return '✂️';
      case 'Fertilizante': return '🌱';
      default: return '📌';
    }
  };

  const obtenerColorTipo = (tipo) => {
    switch(tipo) {
      case 'Riego': return 'badge-info';
      case 'Poda': return 'badge-warning';
      case 'Fertilizante': return 'badge-success';
      default: return 'badge-info';
    }
  };

  const esFechaProxima = (fecha) => {
    const hoy = new Date();
    const fechaAlerta = new Date(fecha);
    const diferenciaDias = Math.ceil((fechaAlerta - hoy) / (1000 * 60 * 60 * 24));
    return diferenciaDias <= 3 && diferenciaDias >= 0;
  };

  if (cargando) {
    return (
      <div className="loading">
        <p>⏳ Cargando alertas...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#4ade80' }}>
        🔔 Gestión de Alertas
      </h2>

      {mensaje && (
        <div className="success">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button className="btn-secondary" onClick={cargarAlertas}>
            🔄 Reintentar
          </button>
        </div>
      )}

      {/* Filtros */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          className={filtro === 'todas' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setFiltro('todas')}
        >
          📋 Todas ({alertas.length})
        </button>
        <button 
          className={filtro === 'pendientes' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setFiltro('pendientes')}
        >
          ⏳ Pendientes ({alertas.filter(a => !a.completada).length})
        </button>
        <button 
          className={filtro === 'completadas' ? 'btn-primary' : 'btn-secondary'}
          onClick={() => setFiltro('completadas')}
        >
          ✅ Completadas ({alertas.filter(a => a.completada).length})
        </button>
      </div>

      {alertasFiltradas.length === 0 ? (
        <div className="card">
          <p style={{ color: '#a0a0a0', textAlign: 'center' }}>
            No hay alertas {filtro === 'todas' ? '' : filtro}
          </p>
        </div>
      ) : (
        <div className="list">
          {alertasFiltradas.map((alerta) => {
            const fechaAlerta = new Date(alerta.fecha_alerta);
            const esProxima = esFechaProxima(alerta.fecha_alerta);
            
            return (
              <div 
                key={alerta.id_alerta} 
                className="list-item"
                style={{
                  borderLeft: `4px solid ${
                    alerta.completada ? '#4ade80' : 
                    esProxima ? '#fbbf24' : 
                    '#60a5fa'
                  }`
                }}
              >
                <div className="list-item-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {obtenerIconoTipo(alerta.tipo_alerta)}
                    </span>
                    <h3>{alerta.nombre_planta}</h3>
                    <span className={`badge ${obtenerColorTipo(alerta.tipo_alerta)}`}>
                      {alerta.tipo_alerta}
                    </span>
                    {alerta.completada && (
                      <span className="badge badge-success">
                        ✅ Completada
                      </span>
                    )}
                    {!alerta.completada && esProxima && (
                      <span className="badge badge-warning">
                        ⚠️ Próxima
                      </span>
                    )}
                  </div>

                  <p style={{ color: '#a0a0a0', marginBottom: '5px' }}>
                    📅 Fecha programada: {fechaAlerta.toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>

                  {alerta.completada && alerta.fecha_completado && (
                    <p style={{ color: '#4ade80', fontSize: '0.9rem' }}>
                      ✅ Completada el: {new Date(alerta.fecha_completado).toLocaleDateString('es-ES')}
                    </p>
                  )}

                  <p style={{ color: '#666', fontSize: '0.85rem', marginTop: '5px' }}>
                    Creada: {new Date(alerta.fecha_creacion).toLocaleDateString('es-ES')}
                  </p>
                </div>

                <div className="list-item-actions">
                  {!alerta.completada && (
                    <button 
                      className="btn-primary"
                      onClick={() => handleCompletar(alerta.id_alerta)}
                    >
                      ✅ Completar
                    </button>
                  )}
                  <button 
                    className="btn-danger"
                    onClick={() => handleEliminar(alerta.id_alerta)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: '20px', color: '#a0a0a0', fontSize: '0.9rem' }}>
        <p>Mostrando {alertasFiltradas.length} alertas</p>
        <p style={{ marginTop: '5px' }}>
          📊 SQL Server: Sistema de alertas y recordatorios
        </p>
      </div>
    </div>
  );
}

export default AlertManager;
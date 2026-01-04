import React, { useState, useEffect } from 'react';
import { reportesAPI } from '../services/api';

function Statistics() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await reportesAPI.obtenerEstadisticas();
      
      if (response.exito) {
        setEstadisticas(response.datos);
      } else {
        setError('Error al cargar estadísticas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <div className="loading">
        <p>⏳ Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button className="btn-secondary" onClick={cargarEstadisticas}>
          🔄 Reintentar
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#4ade80' }}>
        📊 Estadísticas del Sistema
      </h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{estadisticas?.total_plantas || 0}</div>
          <div className="stat-label">🌿 Plantas Totales</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{estadisticas?.total_usuarios || 0}</div>
          <div className="stat-label">👥 Usuarios</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{estadisticas?.total_recomendaciones || 0}</div>
          <div className="stat-label">⭐ Recomendaciones</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{estadisticas?.alertas_pendientes || 0}</div>
          <div className="stat-label">🔔 Alertas Pendientes</div>
        </div>

        <div className="stat-card">
          <div className="stat-value">{estadisticas?.alertas_completadas || 0}</div>
          <div className="stat-label">✅ Alertas Completadas</div>
        </div>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '15px', color: '#f5f5f5' }}>
          📈 Resumen del Sistema
        </h3>
        <div style={{ color: '#a0a0a0', lineHeight: '1.8' }}>
          <p>✅ Sistema operativo y funcionando correctamente</p>
          <p>🗄️ SQL Server: Usuarios, Recomendaciones, Alertas</p>
          <p>🍃 MongoDB: Catálogo completo de plantas</p>
          <p>🔄 Última actualización: {new Date().toLocaleString('es-ES')}</p>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
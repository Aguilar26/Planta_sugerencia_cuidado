import React, { useState, useEffect } from 'react';
import { plantasAPI } from '../services/api';

function PlantList({ onEditar, onAgregar }) {
  const [plantas, setPlantas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [filtro, setFiltro] = useState('');

  useEffect(() => {
    cargarPlantas();
  }, []);

  const cargarPlantas = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await plantasAPI.obtenerTodas();
      
      if (response.exito) {
        setPlantas(response.datos);
      } else {
        setError('Error al cargar plantas');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta planta?')) {
      return;
    }

    try {
      const response = await plantasAPI.eliminar(id);
      
      if (response.exito) {
        setMensaje('Planta eliminada exitosamente');
        cargarPlantas();
        setTimeout(() => setMensaje(null), 3000);
      } else {
        setError('Error al eliminar planta');
      }
    } catch (err) {
      setError('Error al eliminar planta');
      console.error(err);
    }
  };

  const plantasFiltradas = plantas.filter(planta => 
    planta.nombre_comun.toLowerCase().includes(filtro.toLowerCase()) ||
    planta.nombre_cientifico?.toLowerCase().includes(filtro.toLowerCase()) ||
    planta.dificultad.toLowerCase().includes(filtro.toLowerCase())
  );

  if (cargando) {
    return (
      <div className="loading">
        <p>⏳ Cargando plantas...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#4ade80' }}>
        🌿 Catálogo de Plantas
      </h2>

      {mensaje && (
        <div className="success">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="error">
          <p>{error}</p>
          <button className="btn-secondary" onClick={cargarPlantas}>
            🔄 Reintentar
          </button>
        </div>
      )}

      {/* Buscador + botón de agregar (si viene la prop onAgregar) */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <input
          type="text"
          className="form-input"
          placeholder="🔍 Buscar plantas por nombre o dificultad..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          style={{ flex: 1 }}
        />
        {onAgregar && (
          <button
            className="btn-primary"
            onClick={onAgregar}
            style={{ whiteSpace: 'nowrap' }}
          >
            ➕ Nueva Planta
          </button>
        )}
      </div>

      {plantasFiltradas.length === 0 ? (
        <div className="card">
          <p style={{ color: '#a0a0a0', textAlign: 'center' }}>
            {filtro ? 'No se encontraron plantas con ese criterio' : 'No hay plantas registradas'}
          </p>
        </div>
      ) : (
        <div className="plants-grid">
          {plantasFiltradas.map((planta) => (
            <div key={planta._id} className="plant-card">
              <h3>{planta.nombre_comun}</h3>
              
              {planta.nombre_cientifico && (
                <p style={{ color: '#a0a0a0', fontStyle: 'italic', fontSize: '0.9rem', marginBottom: '10px' }}>
                  {planta.nombre_cientifico}
                </p>
              )}

              <div style={{ marginBottom: '15px' }}>
                <span className={`badge ${
                  planta.dificultad === 'Principiante' ? 'badge-success' :
                  planta.dificultad === 'Intermedio' ? 'badge-warning' :
                  'badge-danger'
                }`}>
                  {planta.dificultad}
                </span>
                {planta.precio && (
                  <span style={{ marginLeft: '10px', color: '#4ade80', fontWeight: 'bold' }}>
                    ${planta.precio}
                  </span>
                )}
              </div>

              {planta.descripcion && (
                <p className="plant-card-info">
                  {planta.descripcion.substring(0, 100)}
                  {planta.descripcion.length > 100 && '...'}
                </p>
              )}

              {planta.requerimientos && (
                <div style={{ marginBottom: '15px', fontSize: '0.9rem', color: '#a0a0a0' }}>
                  {planta.requerimientos.luz && (
                    <p>☀️ {planta.requerimientos.luz}</p>
                  )}
                  {planta.cuidados?.riego?.frecuencia_dias && (
                    <p>💧 Riego cada {planta.cuidados.riego.frecuencia_dias} días</p>
                  )}
                  {planta.requerimientos.espacio && (
                    <p>📏 {planta.requerimientos.espacio}</p>
                  )}
                </div>
              )}

              {planta.objetivos && planta.objetivos.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  {planta.objetivos.map((objetivo, idx) => (
                    <span key={idx} className="badge badge-info" style={{ marginRight: '5px', marginBottom: '5px' }}>
                      {objetivo}
                    </span>
                  ))}
                </div>
              )}

              {planta.toxicidad?.mascotas && (
                <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '15px' }}>
                  ⚠️ Tóxica para mascotas
                </p>
              )}

              <div className="btn-group">
                <button 
                  className="btn-secondary"
                  onClick={() => onEditar(planta)}
                >
                  ✏️ Editar
                </button>
                <button 
                  className="btn-danger"
                  onClick={() => handleEliminar(planta._id)}
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', color: '#a0a0a0', fontSize: '0.9rem' }}>
        <p>Mostrando {plantasFiltradas.length} de {plantas.length} plantas</p>
        <p style={{ marginTop: '5px' }}>
          🍃 MongoDB: Catálogo completo de plantas
        </p>
      </div>
    </div>
  );
}

export default PlantList;
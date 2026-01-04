import React, { useState, useEffect } from 'react';
import { plantasAPI } from '../services/api';

function Recomendaciones() {
  const [plantas, setPlantas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Obtener preferencias del usuario desde localStorage
  const usuarioJSON = localStorage.getItem('usuario');
  const usuario = usuarioJSON ? JSON.parse(usuarioJSON) : {};

  useEffect(() => {
    cargarRecomendaciones();
  }, []);

  const cargarRecomendaciones = async () => {
    try {
      setCargando(true);
      setError(null);
      const response = await plantasAPI.obtenerTodas();

      if (response.exito) {
        const plantasRecomendadas = filtrarPlantas(response.datos);
        setPlantas(plantasRecomendadas);
      } else {
        setError('Error al cargar plantas');
      }
    } catch (err) {
      setError('Error de conexión');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  const filtrarPlantas = (todasLasPlantas) => {
    return todasLasPlantas.filter(planta => {
      // Filtro por dificultad (experiencia del usuario)
      const dificultadMatch = !usuario.experiencia || 
        (usuario.experiencia === 'Principiante' && ['Principiante'].includes(planta.dificultad)) ||
        (usuario.experiencia === 'Intermedio' && ['Principiante', 'Intermedio'].includes(planta.dificultad)) ||
        (usuario.experiencia === 'Avanzado' && ['Principiante', 'Intermedio', 'Avanzado'].includes(planta.dificultad));

      if (!dificultadMatch) return false;

      // Filtro por condiciones de luz
      const luzMatch = !usuario.condiciones_luz || 
        usuario.condiciones_luz.toLowerCase().includes('media') ||
        planta.requerimientos?.luz?.toLowerCase().includes('media');

      if (!luzMatch) return false;

      // Filtro por espacio
      const espacioMatch = !usuario.espacio_disponible || 
        usuario.espacio_disponible.toLowerCase().includes('mediano') ||
        planta.requerimientos?.espacio?.toLowerCase().includes('mediano');

      if (!espacioMatch) return false;

      // Filtro por toxicidad si tiene mascotas
      const tieneMascotas = localStorage.getItem('tieneMascotas') === 'true';
      if (tieneMascotas && planta.toxicidad?.mascotas) {
        return false;
      }

      // Filtro por presupuesto
      const presupuesto = parseFloat(localStorage.getItem('presupuesto')) || Infinity;
      if (planta.precio && planta.precio > presupuesto) {
        return false;
      }

      return true;
    });
  };

  if (cargando) {
    return (
      <div className="loading">
        <p>⏳ Buscando las mejores plantas para ti...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#4ade80' }}>
        🌿 Plantas Recomendadas para Ti
      </h2>

      {error && (
        <div className="error">
          <p>{error}</p>
          <button className="btn-secondary" onClick={cargarRecomendaciones}>
            🔄 Reintentar
          </button>
        </div>
      )}

      {plantas.length === 0 ? (
        <div className="card">
          <p style={{ color: '#a0a0a0', textAlign: 'center' }}>
            📭 No encontramos plantas que se adapten a tus preferencias. 
            <br />
            Intenta ajustar tu perfil.
          </p>
        </div>
      ) : (
        <>
          <p style={{ color: '#a0a0a0', marginBottom: '20px', fontSize: '0.9rem' }}>
            ✅ Encontramos {plantas.length} planta{plantas.length !== 1 ? 's' : ''} para ti basado en:
            <br />
            🌱 Experiencia: {usuario.experiencia || 'No especificada'}
            {usuario.condiciones_luz && ` | ☀️ Luz: ${usuario.condiciones_luz}`}
            {usuario.espacio_disponible && ` | 📏 Espacio: ${usuario.espacio_disponible}`}
            {localStorage.getItem('presupuesto') && ` | 💰 Presupuesto: $${localStorage.getItem('presupuesto')}`}
          </p>

          <div className="plants-grid">
            {plantas.map((planta) => (
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
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Recomendaciones;

import React, { useState } from 'react';

function PreferenciasFormulario({ onGuardado }) {
  const [formData, setFormData] = useState({
    experiencia: 'Principiante',
    condiciones_luz: 'Media',
    espacio_disponible: 'Mediano',
    objetivos: [],
    tieneMascotas: false,
    presupuesto: ''
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const opcionesObjetivos = [
    'Decoración',
    'Purificación del aire',
    'Cultivo medicinal',
    'Cultivo comestible',
    'Aromática',
    'Bajo mantenimiento'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleObjetivosChange = (objetivo) => {
    setFormData(prev => ({
      ...prev,
      objetivos: prev.objetivos.includes(objetivo)
        ? prev.objetivos.filter(o => o !== objetivo)
        : [...prev.objetivos, objetivo]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setCargando(true);
      setError(null);

      // Guardar preferencias en localStorage
      localStorage.setItem('experiencia', formData.experiencia);
      localStorage.setItem('condiciones_luz', formData.condiciones_luz);
      localStorage.setItem('espacio_disponible', formData.espacio_disponible);
      localStorage.setItem('objetivos', JSON.stringify(formData.objetivos));
      localStorage.setItem('tieneMascotas', formData.tieneMascotas);
      localStorage.setItem('presupuesto', formData.presupuesto);
      localStorage.setItem('preferenciasFuleno', 'true'); // Flag para saber que ya completó

      setTimeout(() => {
        onGuardado();
      }, 500);
    } catch (err) {
      setError('Error al guardar preferencias');
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
        background: '#2a2a2a',
        border: '2px solid #4ade80',
        borderRadius: '12px',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 8px 32px rgba(74, 222, 128, 0.1)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#4ade80', marginBottom: '10px' }}>
          🌱 Personaliza tu Experiencia
        </h1>
        <p style={{ textAlign: 'center', color: '#a0a0a0', marginBottom: '30px', fontSize: '0.9rem' }}>
          Cuéntanos sobre tus preferencias para recomendarte plantas perfectas
        </p>

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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">🌱 Mi experiencia con plantas</label>
            <select
              name="experiencia"
              value={formData.experiencia}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Principiante">🌱 Principiante (Primeras plantas)</option>
              <option value="Intermedio">🌿 Intermedio (Algo de experiencia)</option>
              <option value="Avanzado">🌳 Avanzado (Experto en cuidados)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">☀️ Condiciones de luz en mi espacio</label>
            <select
              name="condiciones_luz"
              value={formData.condiciones_luz}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Baja">🌑 Baja (Sombra, pocas ventanas)</option>
              <option value="Media">☁️ Media (Luz indirecta)</option>
              <option value="Alta">☀️ Alta (Sol directo)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">📏 Espacio disponible</label>
            <select
              name="espacio_disponible"
              value={formData.espacio_disponible}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Pequeño">📦 Pequeño (Escritorio, mesa)</option>
              <option value="Mediano">📐 Mediano (Piso, estante)</option>
              <option value="Grande">🏢 Grande (Patio, jardín)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">🎯 Qué buscas (elige múltiples)</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {opcionesObjetivos.map(objetivo => (
                <label key={objetivo} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={formData.objetivos.includes(objetivo)}
                    onChange={() => handleObjetivosChange(objetivo)}
                    style={{ marginRight: '8px', width: 'auto' }}
                  />
                  <span style={{ fontSize: '0.9rem', color: '#e0e0e0' }}>{objetivo}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">💰 Presupuesto estimado (USD)</label>
            <input
              type="number"
              name="presupuesto"
              value={formData.presupuesto}
              onChange={handleChange}
              className="form-input"
              placeholder="Ej: 50, 100, 200"
              min="0"
              step="10"
            />
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                name="tieneMascotas"
                checked={formData.tieneMascotas}
                onChange={handleChange}
                style={{ marginRight: '10px', width: 'auto' }}
              />
              <span className="form-label" style={{ marginBottom: 0 }}>
                🐕 Tengo mascotas (evitar plantas tóxicas)
              </span>
            </label>
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
              opacity: cargando ? 0.7 : 1,
              marginTop: '20px'
            }}
          >
            {cargando ? '⏳ Guardando...' : '✅ Continuar a Recomendaciones'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PreferenciasFormulario;

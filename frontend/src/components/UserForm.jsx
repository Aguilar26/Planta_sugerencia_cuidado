import React, { useState, useEffect } from 'react';
import { usuariosAPI } from '../services/api';

function UserForm({ usuario, onCancelar, onGuardado }) {
  const esEdicion = !!usuario;

  const [formData, setFormData] = useState({
    nombreUsuario: '',
    emailUsuario: '',
    experiencia: 'Principiante',
    espacioDisponible: '',
    condicionesLuz: '',
    objetivos: '',
    presupuesto: '',
    aceptaCondiciones: false
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    if (usuario) {
      setFormData({
        nombreUsuario: usuario.nombre_usuario || usuario.nombreUsuario || '',
        emailUsuario: usuario.email_usuario || usuario.emailUsuario || '',
        experiencia: usuario.experiencia || 'Principiante',
        espacioDisponible: usuario.espacio_disponible || usuario.espacioDisponible || '',
        condicionesLuz: usuario.condiciones_luz || usuario.condicionesLuz || '',
        objetivos: usuario.objetivos || '',
        presupuesto: usuario.presupuesto || '',
        aceptaCondiciones: true
      });
    }
  }, [usuario]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.aceptaCondiciones && !esEdicion) {
      setError('Debes aceptar las condiciones de uso para registrarte');
      return;
    }

    try {
      setCargando(true);
      setError(null);

      let response;
      if (esEdicion) {
        const usuarioId = usuario.id_usuario || usuario.id || usuario.idUsuario;
        response = await usuariosAPI.actualizar(usuarioId, formData);
      } else {
        response = await usuariosAPI.crear(formData);
      }

      if (response.exito) {
        setMensaje(esEdicion ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
        setTimeout(() => onGuardado(), 1200);
      } else {
        setError(response.mensaje || 'Error al guardar usuario');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#4ade80' }}>
        {esEdicion ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
      </h2>

      {mensaje && <div className="success">{mensaje}</div>}
      {error && <div className="error">{error}</div>}

      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Nombre *</label>
          <input
            name="nombreUsuario"
            value={formData.nombreUsuario}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            name="emailUsuario"
            type="email"
            value={formData.emailUsuario}
            onChange={handleChange}
            className="form-input"
            required
            disabled={esEdicion}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Experiencia</label>
          <select name="experiencia" value={formData.experiencia} onChange={handleChange} className="form-select">
            <option value="Principiante">🌱 Principiante</option>
            <option value="Intermedio">🌿 Intermedio</option>
            <option value="Avanzado">🌳 Avanzado</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Espacio disponible</label>
          <input
            name="espacioDisponible"
            value={formData.espacioDisponible}
            onChange={handleChange}
            className="form-input"
            placeholder="Ej: Apartamento, Casa, Balcón"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Condiciones de luz</label>
          <input
            name="condicionesLuz"
            value={formData.condicionesLuz}
            onChange={handleChange}
            className="form-input"
            placeholder="Ej: Luz media, Sombra, Sol directo"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Objetivos</label>
          <input
            name="objetivos"
            value={formData.objetivos}
            onChange={handleChange}
            className="form-input"
            placeholder="Ej: Decoración, Aire puro, Comestible"
          />
        </div>

        <div className="form-group">
          <label className="form-label">💰 Presupuesto estimado (USD)</label>
          <input
            name="presupuesto"
            type="number"
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
              name="aceptaCondiciones"
              checked={formData.aceptaCondiciones}
              onChange={handleChange}
              style={{ marginRight: '10px', width: 'auto' }}
              required
            />
            <span className="form-label" style={{ marginBottom: 0 }}>
              ✅ Acepto las condiciones de uso
            </span>
          </label>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-primary" disabled={cargando}>
            {cargando ? '⏳ Guardando...' : (esEdicion ? '💾 Actualizar' : '➕ Crear')}
          </button>
          <button type="button" className="btn-secondary" onClick={onCancelar} disabled={cargando}>
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
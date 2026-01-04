import React, { useState, useEffect } from 'react';
import { plantasAPI } from '../services/api';

function PlantForm({ planta, onCancelar, onGuardado }) {
  const [formData, setFormData] = useState({
    nombre_comun: 'Pothos',
    nombre_cientifico: '',
    dificultad: 'Principiante',
    requerimientos_luz: 'Media',
    requerimientos_espacio: 'Mediano',
    requerimientos_temperatura: 'Templado',
    requerimientos_humedad: 'Media',
    cuidados_riego_frecuencia: '7',
    cuidados_luz: 'Evitar sol directo',
    cuidados_poda: 'Podar hojas amarillas',
    cuidados_fertilizante: 'Cada 2 meses',
    objetivos: [],
    toxicidad_mascotas: false,
    descripcion: '',
    precio: '',
    disponible: true
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const esEdicion = !!planta;

  const opcionesObjetivos = [
    'Decoración',
    'Purificación del aire',
    'Cultivo medicinal',
    'Cultivo comestible',
    'Aromática',
    'Bajo mantenimiento'
  ];

  useEffect(() => {
    if (planta) {
      setFormData({
        nombre_comun: planta.nombre_comun || 'Pothos',
        nombre_cientifico: planta.nombre_cientifico || '',
        dificultad: planta.dificultad || 'Principiante',
        requerimientos_luz: planta.requerimientos?.luz || 'Media',
        requerimientos_espacio: planta.requerimientos?.espacio || 'Mediano',
        requerimientos_temperatura: planta.requerimientos?.temperatura || 'Templado',
        requerimientos_humedad: planta.requerimientos?.humedad || 'Media',
        cuidados_riego_frecuencia: planta.cuidados?.riego?.frecuencia_dias?.toString() || '7',
        cuidados_luz: planta.cuidados?.luz || 'Evitar sol directo',
        cuidados_poda: planta.cuidados?.poda || 'Podar hojas amarillas',
        cuidados_fertilizante: planta.cuidados?.fertilizante || 'Cada 2 meses',
        objetivos: planta.objetivos || [],
        toxicidad_mascotas: planta.toxicidad?.mascotas || false,
        descripcion: planta.descripcion || '',
        precio: planta.precio || '',
        disponible: planta.disponible !== false
      });
    }
  }, [planta]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleObjetivosChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setFormData(prev => ({
      ...prev,
      objetivos: selected
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setCargando(true);
      setError(null);

      const plantaData = {
        nombre_comun: formData.nombre_comun,
        nombre_cientifico: formData.nombre_cientifico,
        dificultad: formData.dificultad,
        requerimientos: {
          luz: formData.requerimientos_luz,
          espacio: formData.requerimientos_espacio,
          temperatura: formData.requerimientos_temperatura,
          humedad: formData.requerimientos_humedad
        },
        cuidados: {
          riego: {
            frecuencia_dias: parseInt(formData.cuidados_riego_frecuencia)
          },
          luz: formData.cuidados_luz,
          poda: formData.cuidados_poda,
          fertilizante: formData.cuidados_fertilizante
        },
        objetivos: formData.objetivos,
        toxicidad: {
          es_toxica: formData.toxicidad_mascotas,
          mascotas: formData.toxicidad_mascotas
        },
        descripcion: formData.descripcion,
        precio: formData.precio ? parseFloat(formData.precio) : null,
        disponible: formData.disponible
      };

      let response;
      if (esEdicion) {
        response = await plantasAPI.actualizar(planta._id, plantaData);
      } else {
        response = await plantasAPI.crear(plantaData);
      }

      if (response.exito) {
        setMensaje(esEdicion ? 'Planta actualizada exitosamente' : 'Planta creada exitosamente');
        setTimeout(() => {
          onGuardado();
        }, 1500);
      } else {
        setError(response.mensaje || 'Error al guardar planta');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: '20px', color: '#4ade80' }}>
        {esEdicion ? '✏️ Editar Planta' : '➕ Nueva Planta'}
      </h2>

      {mensaje && (
        <div className="success">
          {mensaje}
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      <form className="form" onSubmit={handleSubmit}>
        {/* Información Básica */}
        <h3 style={{ marginBottom: '15px', color: '#f5f5f5' }}>📋 Información Básica</h3>
        
        <div className="form-group">
          <label className="form-label">Nombre Común *</label>
          <select
            name="nombre_comun"
            value={formData.nombre_comun}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Pothos">Pothos</option>
            <option value="Sansevieria">Sansevieria (Lengua de suegra)</option>
            <option value="Aloe Vera">Aloe Vera</option>
            <option value="Monstera">Monstera Deliciosa</option>
            <option value="Ficus">Ficus</option>
            <option value="Suculenta">Suculenta</option>
            <option value="Cactus">Cactus</option>
            <option value="Helecho">Helecho</option>
            <option value="Orquídea">Orquídea</option>
            <option value="Rosa">Rosa</option>
            <option value="Lavanda">Lavanda</option>
            <option value="Albahaca">Albahaca</option>
            <option value="Menta">Menta</option>
            <option value="Romero">Romero</option>
            <option value="Bambú">Bambú de la suerte</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Nombre Científico</label>
          <select
            name="nombre_cientifico"
            value={formData.nombre_cientifico}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">No especificado</option>
            <option value="Epipremnum aureum">Epipremnum aureum</option>
            <option value="Sansevieria trifasciata">Sansevieria trifasciata</option>
            <option value="Aloe barbadensis">Aloe barbadensis</option>
            <option value="Monstera deliciosa">Monstera deliciosa</option>
            <option value="Ficus benjamina">Ficus benjamina</option>
            <option value="Cactaceae">Cactaceae</option>
            <option value="Nephrolepis exaltata">Nephrolepis exaltata</option>
            <option value="Phalaenopsis">Phalaenopsis</option>
            <option value="Rosa">Rosa</option>
            <option value="Lavandula">Lavandula</option>
            <option value="Ocimum basilicum">Ocimum basilicum</option>
            <option value="Mentha">Mentha</option>
            <option value="Rosmarinus officinalis">Rosmarinus officinalis</option>
            <option value="Dracaena sanderiana">Dracaena sanderiana</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Dificultad de Cuidado *</label>
          <select
            name="dificultad"
            value={formData.dificultad}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="Principiante">🌱 Principiante (Fácil)</option>
            <option value="Intermedio">🌿 Intermedio (Moderado)</option>
            <option value="Avanzado">🌳 Avanzado (Difícil)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <select
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Sin descripción</option>
            <option value="Planta de interior perfecta para principiantes">Planta de interior perfecta para principiantes</option>
            <option value="Resistente y fácil de cuidar">Resistente y fácil de cuidar</option>
            <option value="Purifica el aire de manera eficiente">Purifica el aire de manera eficiente</option>
            <option value="Ideal para espacios con poca luz">Ideal para espacios con poca luz</option>
            <option value="Planta decorativa de gran tamaño">Planta decorativa de gran tamaño</option>
            <option value="Requiere cuidados especiales">Requiere cuidados especiales</option>
            <option value="Aromática y medicinal">Aromática y medicinal</option>
            <option value="Comestible y fácil de cultivar">Comestible y fácil de cultivar</option>
          </select>
        </div>

        {/* Requerimientos */}
        <h3 style={{ marginTop: '25px', marginBottom: '15px', color: '#f5f5f5' }}>🌱 Requerimientos</h3>

        <div className="form-group">
          <label className="form-label">Nivel de Luz</label>
          <select
            name="requerimientos_luz"
            value={formData.requerimientos_luz}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Baja">🌑 Luz Baja (Sombra)</option>
            <option value="Media">☁️ Luz Media (Indirecta)</option>
            <option value="Alta">☀️ Luz Alta (Sol directo)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Espacio Requerido</label>
          <select
            name="requerimientos_espacio"
            value={formData.requerimientos_espacio}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Pequeño">📦 Pequeño (Escritorio/Mesa)</option>
            <option value="Mediano">📐 Mediano (Piso/Estante)</option>
            <option value="Grande">🏢 Grande (Jardín/Patio)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Temperatura Ideal</label>
          <select
            name="requerimientos_temperatura"
            value={formData.requerimientos_temperatura}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Frío">❄️ Frío (10-18°C)</option>
            <option value="Templado">🌤️ Templado (18-24°C)</option>
            <option value="Cálido">🔥 Cálido (24-30°C)</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Humedad</label>
          <select
            name="requerimientos_humedad"
            value={formData.requerimientos_humedad}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Baja">🏜️ Baja (30-40%)</option>
            <option value="Media">💧 Media (40-60%)</option>
            <option value="Alta">💦 Alta (60-80%)</option>
          </select>
        </div>

        {/* Cuidados */}
        <h3 style={{ marginTop: '25px', marginBottom: '15px', color: '#f5f5f5' }}>💧 Cuidados</h3>

        <div className="form-group">
          <label className="form-label">Frecuencia de Riego</label>
          <select
            name="cuidados_riego_frecuencia"
            value={formData.cuidados_riego_frecuencia}
            onChange={handleChange}
            className="form-select"
          >
            <option value="3">Cada 3 días</option>
            <option value="7">Cada semana</option>
            <option value="14">Cada 2 semanas</option>
            <option value="21">Cada 3 semanas</option>
            <option value="30">Cada mes</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Cuidados de Luz</label>
          <select
            name="cuidados_luz"
            value={formData.cuidados_luz}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Evitar sol directo">Evitar sol directo</option>
            <option value="Necesita luz solar directa">Necesita luz solar directa</option>
            <option value="Tolera sombra">Tolera sombra</option>
            <option value="Luz filtrada">Luz filtrada ideal</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Instrucciones de Poda</label>
          <select
            name="cuidados_poda"
            value={formData.cuidados_poda}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Podar hojas amarillas">Podar hojas amarillas</option>
            <option value="Podar regularmente">Podar regularmente</option>
            <option value="No requiere poda">No requiere poda</option>
            <option value="Podar en primavera">Podar en primavera</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Fertilizante</label>
          <select
            name="cuidados_fertilizante"
            value={formData.cuidados_fertilizante}
            onChange={handleChange}
            className="form-select"
          >
            <option value="Cada mes">Cada mes</option>
            <option value="Cada 2 meses">Cada 2 meses</option>
            <option value="Cada 3 meses">Cada 3 meses</option>
            <option value="Solo en primavera/verano">Solo en primavera/verano</option>
            <option value="No requiere">No requiere</option>
          </select>
        </div>

        {/* Otros */}
        <h3 style={{ marginTop: '25px', marginBottom: '15px', color: '#f5f5f5' }}>🎯 Otros Datos</h3>

        <div className="form-group">
          <label className="form-label">Objetivos (mantén Ctrl para seleccionar múltiples)</label>
          <select
            name="objetivos"
            value={formData.objetivos}
            onChange={handleObjetivosChange}
            className="form-select"
            multiple
            style={{ height: '120px' }}
          >
            {opcionesObjetivos.map(obj => (
              <option key={obj} value={obj}>{obj}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Precio (USD)</label>
          <select
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Sin precio</option>
            <option value="5.00">$5.00</option>
            <option value="10.00">$10.00</option>
            <option value="15.00">$15.00</option>
            <option value="20.00">$20.00</option>
            <option value="25.00">$25.00</option>
            <option value="30.00">$30.00</option>
            <option value="40.00">$40.00</option>
            <option value="50.00">$50.00</option>
            <option value="75.00">$75.00</option>
            <option value="100.00">$100.00</option>
          </select>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="toxicidad_mascotas"
              checked={formData.toxicidad_mascotas}
              onChange={handleChange}
              style={{ marginRight: '10px', width: 'auto' }}
            />
            <span className="form-label" style={{ marginBottom: 0 }}>
              ⚠️ Tóxica para mascotas
            </span>
          </label>
        </div>

        <div className="form-group">
          <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              style={{ marginRight: '10px', width: 'auto' }}
            />
            <span className="form-label" style={{ marginBottom: 0 }}>
              ✅ Disponible en catálogo
            </span>
          </label>
        </div>

        <div className="btn-group">
          <button 
            type="submit" 
            className="btn-primary"
            disabled={cargando}
          >
            {cargando ? '⏳ Guardando...' : (esEdicion ? '💾 Actualizar' : '➕ Crear')}
          </button>
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onCancelar}
            disabled={cargando}
          >
            ❌ Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default PlantForm;
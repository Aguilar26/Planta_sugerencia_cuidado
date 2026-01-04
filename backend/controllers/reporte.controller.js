const { ejecutarQuery } = require('../config/database');
const mongoose = require('mongoose');

const obtenerEstadisticas = async (req, res) => {
  try {
    // Contar plantas desde MongoDB
    const PlantModel = mongoose.model('Planta');
    const totalPlantas = await PlantModel.countDocuments();
    
    // Estadísticas desde SQL Server
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM usuarios) as total_usuarios,
        (SELECT COUNT(*) FROM recomendaciones) as total_recomendaciones,
        (SELECT COUNT(*) FROM alertas WHERE completada = 0) as alertas_pendientes,
        (SELECT COUNT(*) FROM alertas WHERE completada = 1) as alertas_completadas
    `;
    
    const resultado = await ejecutarQuery(query);
    
    res.json({
      exito: true,
      datos: {
        total_plantas: totalPlantas,
        ...resultado[0]
      }
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

const obtenerPlantasMasRecomendadas = async (req, res) => {
  try {
    const query = `
      SELECT TOP 10
        id_planta,
        COUNT(*) as veces_recomendada
      FROM recomendaciones
      GROUP BY id_planta
      ORDER BY veces_recomendada DESC
    `;
    
    const recomendaciones = await ejecutarQuery(query);
    const PlantModel = mongoose.model('Planta');
    
    const plantasConRecomendaciones = await Promise.all(
      recomendaciones.map(async (rec) => {
        const planta = await PlantModel.findOne({ idPlanta: rec.id_planta }).lean();
        return {
          nombre_comun: planta?.nombrePlanta || 'Desconocida',
          nombre_cientifico: planta?.nombreCientifico || '',
          veces_recomendada: rec.veces_recomendada
        };
      })
    );
    
    res.json({
      exito: true,
      datos: plantasConRecomendaciones
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener plantas más recomendadas',
      error: error.message
    });
  }
};

const obtenerUsuariosActivos = async (req, res) => {
  try {
    const query = `
      SELECT 
        u.nombre_usuario,
        u.email_usuario,
        u.nivel_experiencia,
        COUNT(r.id_recomendacion) as total_recomendaciones,
        u.fecha_registro,
        u.ultima_conexion
      FROM usuarios u
      LEFT JOIN recomendaciones r ON u.id_usuario = r.id_usuario
      WHERE u.activo = 1
      GROUP BY u.id_usuario, u.nombre_usuario, u.email_usuario, 
               u.nivel_experiencia, u.fecha_registro, u.ultima_conexion
      ORDER BY total_recomendaciones DESC
    `;
    
    const resultado = await ejecutarQuery(query);
    
    res.json({
      exito: true,
      datos: resultado
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener usuarios activos',
      error: error.message
    });
  }
};

const obtenerAlertasProximas = async (req, res) => {
  try {
    const query = `
      SELECT TOP 20
        a.id_alerta,
        a.tipo_alerta,
        a.descripcion_alerta,
        a.fecha_programada,
        a.id_planta,
        u.nombre_usuario as usuario
      FROM alertas a
      INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
      WHERE a.completada = 0 
        AND a.fecha_programada >= GETDATE()
      ORDER BY a.fecha_programada ASC
    `;
    
    const alertas = await ejecutarQuery(query);
    const PlantModel = mongoose.model('Planta');
    
    const alertasConPlantas = await Promise.all(
      alertas.map(async (alerta) => {
        const planta = await PlantModel.findOne({ idPlanta: alerta.id_planta }).lean();
        return {
          ...alerta,
          planta: planta?.nombrePlanta || 'Desconocida'
        };
      })
    );
    
    res.json({
      exito: true,
      datos: alertasConPlantas
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener alertas próximas',
      error: error.message
    });
  }
};

module.exports = {
  obtenerEstadisticas,
  obtenerPlantasMasRecomendadas,
  obtenerUsuariosActivos,
  obtenerAlertasProximas
};
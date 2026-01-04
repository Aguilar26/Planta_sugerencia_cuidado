const { ejecutarQuery } = require('../config/database');
const mongoose = require('mongoose');

const obtenerTodasLasAlertas = async () => {
  console.log('🔍 MODELO obtenerTodasLasAlertas - Iniciando...');
  
  const query = `
    SELECT a.*, u.nombre_usuario
    FROM alertas a
    INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
    ORDER BY a.fecha_alerta ASC
  `;
  
  const alertas = await ejecutarQuery(query);
  console.log(`📊 MODELO - Alertas obtenidas de SQL: ${alertas.length}`);
  
  // Enriquecer con datos de plantas desde MongoDB
  let Plant;
  try {
    Plant = mongoose.model('Planta');
  } catch (error) {
    console.log('⚠️ Modelo Planta no registrado, intentando requerir...');
    const plantaModule = require('./planta');
    Plant = plantaModule.model || mongoose.model('Planta');
  }
  
  const alertasConPlantas = await Promise.all(
    alertas.map(async (alerta) => {
      try {
        const planta = await Plant.findOne({ idPlanta: alerta.id_planta_mongo }).lean();
        return {
          ...alerta,
          nombre_planta: planta?.nombrePlanta || alerta.nombre_planta || 'Desconocida'
        };
      } catch (error) {
        console.log('⚠️ Error al buscar planta, usando nombre de la BD');
        return {
          ...alerta,
          nombre_planta: alerta.nombre_planta || 'Desconocida'
        };
      }
    })
  );
  
  console.log('✅ MODELO - Alertas enriquecidas con datos de plantas');
  return alertasConPlantas;
};

const obtenerAlertaPorId = async (idAlerta) => {
  console.log('🔍 MODELO obtenerAlertaPorId - ID:', idAlerta);
  
  const query = 'SELECT * FROM alertas WHERE id_alerta = @id_alerta';
  const parametros = { id_alerta: idAlerta };
  const resultado = await ejecutarQuery(query, parametros);
  
  console.log('📊 MODELO - Alerta encontrada:', resultado ? 'Sí' : 'No');
  return resultado[0];
};

const obtenerAlertasPorUsuario = async (idUsuario) => {
  console.log('🔍 MODELO obtenerAlertasPorUsuario - ID Usuario:', idUsuario);
  
  const query = `
    SELECT a.*
    FROM alertas a
    WHERE a.id_usuario = @id_usuario
    ORDER BY a.fecha_alerta ASC
  `;
  const parametros = { id_usuario: idUsuario };
  const alertas = await ejecutarQuery(query, parametros);
  
  console.log(`📊 MODELO - Alertas del usuario: ${alertas.length}`);
  
  // Enriquecer con datos de plantas
  let Plant;
  try {
    Plant = mongoose.model('Planta');
  } catch (error) {
    const plantaModule = require('./planta');
    Plant = plantaModule.model || mongoose.model('Planta');
  }
  
  const alertasConPlantas = await Promise.all(
    alertas.map(async (alerta) => {
      try {
        const planta = await Plant.findOne({ idPlanta: alerta.id_planta_mongo }).lean();
        return {
          ...alerta,
          nombre_planta: planta?.nombrePlanta || alerta.nombre_planta || 'Desconocida',
          nombre_cientifico: planta?.nombreCientifico || ''
        };
      } catch (error) {
        return {
          ...alerta,
          nombre_planta: alerta.nombre_planta || 'Desconocida'
        };
      }
    })
  );
  
  return alertasConPlantas;
};

const obtenerAlertasPendientes = async (idUsuario = null) => {
  console.log('🔍 MODELO obtenerAlertasPendientes - ID Usuario:', idUsuario || 'Todos');
  
  let query = `
    SELECT a.*, u.nombre_usuario
    FROM alertas a
    INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
    WHERE a.completada = 0
  `;
  
  const parametros = {};
  
  if (idUsuario) {
    query += ' AND a.id_usuario = @id_usuario';
    parametros.id_usuario = idUsuario;
  }
  
  query += ' ORDER BY a.fecha_alerta ASC';
  
  const alertas = await ejecutarQuery(query, parametros);
  console.log(`📊 MODELO - Alertas pendientes: ${alertas.length}`);
  
  // Enriquecer con datos de plantas
  let Plant;
  try {
    Plant = mongoose.model('Planta');
  } catch (error) {
    const plantaModule = require('./planta');
    Plant = plantaModule.model || mongoose.model('Planta');
  }
  
  const alertasConPlantas = await Promise.all(
    alertas.map(async (alerta) => {
      try {
        const planta = await Plant.findOne({ idPlanta: alerta.id_planta_mongo }).lean();
        return {
          ...alerta,
          nombre_planta: planta?.nombrePlanta || alerta.nombre_planta || 'Desconocida'
        };
      } catch (error) {
        return {
          ...alerta,
          nombre_planta: alerta.nombre_planta || 'Desconocida'
        };
      }
    })
  );
  
  return alertasConPlantas;
};

const obtenerAlertasProximas = async () => {
  console.log('🔍 MODELO obtenerAlertasProximas - Iniciando...');
  
  const query = `
    SELECT TOP 20
      a.id_alerta,
      a.tipo_alerta,
      a.fecha_alerta,
      a.id_planta_mongo,
      a.nombre_planta,
      u.nombre_usuario as usuario,
      DATEDIFF(day, GETDATE(), a.fecha_alerta) as dias_restantes
    FROM alertas a
    INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
    WHERE a.completada = 0 
      AND a.fecha_alerta >= GETDATE()
    ORDER BY a.fecha_alerta ASC
  `;
  
  const alertas = await ejecutarQuery(query);
  console.log(`📊 MODELO - Alertas próximas: ${alertas.length}`);
  
  // Enriquecer con datos de plantas
  let Plant;
  try {
    Plant = mongoose.model('Planta');
  } catch (error) {
    const plantaModule = require('./planta');
    Plant = plantaModule.model || mongoose.model('Planta');
  }
  
  const alertasConPlantas = await Promise.all(
    alertas.map(async (alerta) => {
      try {
        const planta = await Plant.findOne({ idPlanta: alerta.id_planta_mongo }).lean();
        return {
          ...alerta,
          nombre_planta: planta?.nombrePlanta || alerta.nombre_planta || 'Desconocida'
        };
      } catch (error) {
        return {
          ...alerta,
          nombre_planta: alerta.nombre_planta || 'Desconocida'
        };
      }
    })
  );
  
  return alertasConPlantas;
};

const crearAlerta = async (datosAlerta) => {
  console.log('====================================');
  console.log('🔍 MODELO crearAlerta - Datos recibidos:', JSON.stringify(datosAlerta, null, 2));
  console.log('====================================');
  
  const parametros = {
    id_usuario: datosAlerta.idUsuario,
    id_planta_mongo: datosAlerta.idPlanta,
    nombre_planta: datosAlerta.nombrePlanta || '',
    tipo_alerta: datosAlerta.tipoAlerta,
    fecha_alerta: datosAlerta.fechaAlerta
  };
  
  console.log('📤 MODELO - Parámetros para insertar:', JSON.stringify(parametros, null, 2));
  
  // Validar campos requeridos
  if (!parametros.id_usuario) {
    throw new Error('id_usuario es requerido pero llegó como: ' + datosAlerta.idUsuario);
  }
  
  if (!parametros.id_planta_mongo) {
    throw new Error('id_planta_mongo es requerido pero llegó como: ' + datosAlerta.idPlanta);
  }
  
  if (!parametros.tipo_alerta) {
    throw new Error('tipo_alerta es requerido pero llegó como: ' + datosAlerta.tipoAlerta);
  }
  
  if (!parametros.fecha_alerta) {
    throw new Error('fecha_alerta es requerido pero llegó como: ' + datosAlerta.fechaAlerta);
  }
  
  // Usar INSERT directo
  const query = `
    INSERT INTO alertas (id_usuario, id_planta_mongo, nombre_planta, tipo_alerta, fecha_alerta, completada)
    VALUES (@id_usuario, @id_planta_mongo, @nombre_planta, @tipo_alerta, @fecha_alerta, 0);
    SELECT SCOPE_IDENTITY() AS id_alerta;
  `;
  
  const resultado = await ejecutarQuery(query, parametros);
  console.log('✅ MODELO - Alerta creada con ID:', resultado[0]?.id_alerta);
  
  if (resultado && resultado[0] && resultado[0].id_alerta) {
    return await obtenerAlertaPorId(resultado[0].id_alerta);
  }
  
  return resultado;
};

const actualizarAlerta = async (idAlerta, datosAlerta) => {
  console.log('====================================');
  console.log('🔍 MODELO actualizarAlerta - ID:', idAlerta);
  console.log('📥 Datos recibidos:', JSON.stringify(datosAlerta, null, 2));
  console.log('====================================');
  
  const query = `
    UPDATE alertas 
    SET tipo_alerta = @tipo_alerta,
        fecha_alerta = @fecha_alerta
    WHERE id_alerta = @id_alerta
  `;
  
  const parametros = {
    id_alerta: idAlerta,
    tipo_alerta: datosAlerta.tipoAlerta,
    fecha_alerta: datosAlerta.fechaAlerta
  };
  
  console.log('📤 MODELO - Parámetros para actualizar:', parametros);
  
  const resultado = await ejecutarQuery(query, parametros);
  console.log('✅ MODELO - Alerta actualizada');
  
  return resultado;
};

const marcarAlertaCompletada = async (idAlerta) => {
  console.log('🔍 MODELO marcarAlertaCompletada - ID:', idAlerta);
  
  const query = 'UPDATE alertas SET completada = 1, fecha_completado = GETDATE() WHERE id_alerta = @id_alerta';
  const parametros = { id_alerta: idAlerta };
  const resultado = await ejecutarQuery(query, parametros);
  
  console.log('✅ MODELO - Alerta marcada como completada');
  return resultado;
};

const eliminarAlerta = async (idAlerta) => {
  console.log('🔍 MODELO eliminarAlerta - ID:', idAlerta);
  
  const query = 'DELETE FROM alertas WHERE id_alerta = @id_alerta';
  const parametros = { id_alerta: idAlerta };
  const resultado = await ejecutarQuery(query, parametros);
  
  console.log('✅ MODELO - Alerta eliminada');
  return resultado;
};

const eliminarAlertasCompletadas = async (idUsuario) => {
  console.log('🔍 MODELO eliminarAlertasCompletadas - ID Usuario:', idUsuario);
  
  const query = 'DELETE FROM alertas WHERE completada = 1 AND id_usuario = @id_usuario';
  const parametros = { id_usuario: idUsuario };
  const resultado = await ejecutarQuery(query, parametros);
  
  console.log('✅ MODELO - Alertas completadas eliminadas');
  return resultado;
};

module.exports = {
  obtenerTodas: obtenerTodasLasAlertas,
  obtenerPorId: obtenerAlertaPorId,
  obtenerPorUsuario: obtenerAlertasPorUsuario,
  obtenerPendientes: obtenerAlertasPendientes,
  obtenerProximas: obtenerAlertasProximas,
  crear: crearAlerta,
  actualizar: actualizarAlerta,
  completar: marcarAlertaCompletada,
  eliminar: eliminarAlerta,
  eliminarCompletadas: eliminarAlertasCompletadas
};
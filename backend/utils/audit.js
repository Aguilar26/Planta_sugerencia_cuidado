const { ejecutarQuery } = require('../config/database');

const registrarAccion = async (tablaAfectada, operacion, idRegistro, datosAnteriores = null, datosNuevos = null, ipCliente = null) => {
  try {
    const query = `
      INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos, ip_cliente)
      VALUES (@tabla_afectada, @operacion, @id_registro, @datos_anteriores, @datos_nuevos, @ip_cliente)
    `;
    
    const parametros = {
      tabla_afectada: tablaAfectada,
      operacion: operacion,
      id_registro: idRegistro,
      datos_anteriores: datosAnteriores ? JSON.stringify(datosAnteriores) : null,
      datos_nuevos: datosNuevos ? JSON.stringify(datosNuevos) : null,
      ip_cliente: ipCliente
    };
    
    await ejecutarQuery(query, parametros);
    console.log(`✅ Auditoría registrada: ${operacion} en ${tablaAfectada}`);
  } catch (error) {
    console.error('❌ Error al registrar auditoría:', error);
  }
};

const registrarInsert = async (tablaAfectada, idRegistro, datosNuevos, ipCliente = null) => {
  return await registrarAccion(tablaAfectada, 'INSERT', idRegistro, null, datosNuevos, ipCliente);
};

const registrarUpdate = async (tablaAfectada, idRegistro, datosAnteriores, datosNuevos, ipCliente = null) => {
  return await registrarAccion(tablaAfectada, 'UPDATE', idRegistro, datosAnteriores, datosNuevos, ipCliente);
};

const registrarDelete = async (tablaAfectada, idRegistro, datosAnteriores, ipCliente = null) => {
  return await registrarAccion(tablaAfectada, 'DELETE', idRegistro, datosAnteriores, null, ipCliente);
};

const obtenerIPCliente = (req) => {
  const ip = req.headers['x-forwarded-for'] || 
              req.headers['x-real-ip'] || 
              req.connection.remoteAddress || 
              req.socket.remoteAddress || 
              req.ip;
  
  return ip ? ip.split(',')[0].trim() : 'IP desconocida';
};

const obtenerHistorialPorRegistro = async (tablaAfectada, idRegistro) => {
  try {
    const query = `
      SELECT * FROM auditoria 
      WHERE tabla_afectada = @tabla_afectada 
        AND id_registro = @id_registro
      ORDER BY fecha_operacion DESC
    `;
    
    const parametros = {
      tabla_afectada: tablaAfectada,
      id_registro: idRegistro
    };
    
    return await ejecutarQuery(query, parametros);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return [];
  }
};

const obtenerResumenAuditoria = async () => {
  try {
    const query = `
      SELECT 
        tabla_afectada,
        operacion,
        COUNT(*) as total,
        MAX(fecha_operacion) as ultima_operacion
      FROM auditoria
      WHERE fecha_operacion >= DATEADD(DAY, -30, GETDATE())
      GROUP BY tabla_afectada, operacion
      ORDER BY total DESC
    `;
    
    return await ejecutarQuery(query);
  } catch (error) {
    console.error('Error al obtener resumen de auditoría:', error);
    return [];
  }
};

const limpiarAuditoriaAntigua = async (diasAntiguedad = 90) => {
  try {
    const query = `
      DELETE FROM auditoria 
      WHERE fecha_operacion < DATEADD(DAY, -@dias, GETDATE())
    `;
    
    const parametros = { dias: diasAntiguedad };
    const resultado = await ejecutarQuery(query, parametros);
    
    console.log(`✅ Auditorías antiguas eliminadas (mayores a ${diasAntiguedad} días)`);
    return resultado;
  } catch (error) {
    console.error('Error al limpiar auditorías antiguas:', error);
    throw error;
  }
};

module.exports = {
  registrarAccion,
  registrarInsert,
  registrarUpdate,
  registrarDelete,
  obtenerIPCliente,
  obtenerHistorialPorRegistro,
  obtenerResumenAuditoria,
  limpiarAuditoriaAntigua
};
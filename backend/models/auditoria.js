const { ejecutarQuery } = require('../config/database');

const obtenerTodasLasAuditorias = async () => {
  const query = 'SELECT * FROM auditoria ORDER BY fecha_operacion DESC';
  return await ejecutarQuery(query);
};

const obtenerAuditoriaPorId = async (idAuditoria) => {
  const query = 'SELECT * FROM auditoria WHERE id_auditoria = @id_auditoria';
  const parametros = { id_auditoria: idAuditoria };
  const resultado = await ejecutarQuery(query, parametros);
  return resultado[0];
};

const obtenerAuditoriasPorTabla = async (tablaAfectada) => {
  const query = `
    SELECT * FROM auditoria 
    WHERE tabla_afectada = @tabla_afectada 
    ORDER BY fecha_operacion DESC
  `;
  const parametros = { tabla_afectada: tablaAfectada };
  return await ejecutarQuery(query, parametros);
};

const obtenerAuditoriasPorOperacion = async (operacion) => {
  const query = `
    SELECT * FROM auditoria 
    WHERE operacion = @operacion 
    ORDER BY fecha_operacion DESC
  `;
  const parametros = { operacion };
  return await ejecutarQuery(query, parametros);
};

const obtenerAuditoriaReciente = async (dias = 30) => {
  const query = 'SELECT * FROM vw_auditoria_reciente ORDER BY fecha_operacion DESC';
  return await ejecutarQuery(query);
};

const obtenerAuditoriasPorFecha = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT * FROM auditoria 
    WHERE fecha_operacion BETWEEN @fecha_inicio AND @fecha_fin
    ORDER BY fecha_operacion DESC
  `;
  const parametros = {
    fecha_inicio: fechaInicio,
    fecha_fin: fechaFin
  };
  return await ejecutarQuery(query, parametros);
};

const obtenerAuditoriasPorUsuario = async (usuarioBD) => {
  const query = `
    SELECT * FROM auditoria 
    WHERE usuario_bd = @usuario_bd 
    ORDER BY fecha_operacion DESC
  `;
  const parametros = { usuario_bd: usuarioBD };
  return await ejecutarQuery(query, parametros);
};

const obtenerEstadisticasAuditoria = async () => {
  const query = `
    SELECT 
      operacion,
      tabla_afectada,
      COUNT(*) AS total_operaciones,
      MAX(fecha_operacion) AS ultima_operacion
    FROM auditoria
    GROUP BY operacion, tabla_afectada
    ORDER BY total_operaciones DESC
  `;
  return await ejecutarQuery(query);
};

const limpiarAuditoriaAntigua = async (diasAntiguedad = 90) => {
  const query = `
    DELETE FROM auditoria 
    WHERE fecha_operacion < DATEADD(DAY, -@dias, GETDATE())
  `;
  const parametros = { dias: diasAntiguedad };
  return await ejecutarQuery(query, parametros);
};

module.exports = {
  obtenerTodasLasAuditorias,
  obtenerAuditoriaPorId,
  obtenerAuditoriasPorTabla,
  obtenerAuditoriasPorOperacion,
  obtenerAuditoriaReciente,
  obtenerAuditoriasPorFecha,
  obtenerAuditoriasPorUsuario,
  obtenerEstadisticasAuditoria,
  limpiarAuditoriaAntigua
};
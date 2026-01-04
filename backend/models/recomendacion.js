const { ejecutarQuery, ejecutarProcedimiento } = require('../config/database');

const obtenerTodasLasRecomendaciones = async () => {
  const query = 'SELECT * FROM vw_recomendaciones_detalladas ORDER BY fecha_recomendacion DESC';
  return await ejecutarQuery(query);
};

const obtenerRecomendacionPorId = async (idRecomendacion) => {
  const query = 'SELECT * FROM recomendaciones WHERE id_recomendacion = @id_recomendacion';
  const parametros = { id_recomendacion: idRecomendacion };
  const resultado = await ejecutarQuery(query, parametros);
  return resultado[0];
};

const obtenerRecomendacionesPorUsuario = async (idUsuario) => {
  const query = `
    SELECT r.*, p.nombre_planta, p.nombre_cientifico, p.precio_planta
    FROM recomendaciones r
    INNER JOIN plantas p ON r.id_planta = p.id_planta
    WHERE r.id_usuario = @id_usuario
    ORDER BY r.fecha_recomendacion DESC
  `;
  const parametros = { id_usuario: idUsuario };
  return await ejecutarQuery(query, parametros);
};

const obtenerRecomendacionesPorPlanta = async (idPlanta) => {
  const query = `
    SELECT r.*, u.nombre_usuario, u.email_usuario
    FROM recomendaciones r
    INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
    WHERE r.id_planta = @id_planta
    ORDER BY r.fecha_recomendacion DESC
  `;
  const parametros = { id_planta: idPlanta };
  return await ejecutarQuery(query, parametros);
};

const crearRecomendacion = async (datosRecomendacion) => {
  return await ejecutarProcedimiento('sp_crear_recomendacion', {
    id_usuario: datosRecomendacion.idUsuario,
    id_planta: datosRecomendacion.idPlanta,
    puntuacion: datosRecomendacion.puntuacion,
    razon_recomendacion: datosRecomendacion.razonRecomendacion
  });
};

const actualizarRecomendacion = async (idRecomendacion, datosRecomendacion) => {
  const query = `
    UPDATE recomendaciones 
    SET puntuacion = @puntuacion,
        razon_recomendacion = @razon_recomendacion
    WHERE id_recomendacion = @id_recomendacion
  `;
  
  const parametros = {
    id_recomendacion: idRecomendacion,
    puntuacion: datosRecomendacion.puntuacion,
    razon_recomendacion: datosRecomendacion.razonRecomendacion
  };
  
  return await ejecutarQuery(query, parametros);
};

const eliminarRecomendacion = async (idRecomendacion) => {
  const query = 'DELETE FROM recomendaciones WHERE id_recomendacion = @id_recomendacion';
  const parametros = { id_recomendacion: idRecomendacion };
  return await ejecutarQuery(query, parametros);
};

const obtenerPlantasMasRecomendadas = async (limite = 10) => {
  const query = `
    SELECT TOP (@limite) * 
    FROM vw_plantas_mas_recomendadas 
    ORDER BY total_recomendaciones DESC
  `;
  const parametros = { limite };
  return await ejecutarQuery(query, parametros);
};

module.exports = {
  obtenerTodasLasRecomendaciones,
  obtenerRecomendacionPorId,
  obtenerRecomendacionesPorUsuario,
  obtenerRecomendacionesPorPlanta,
  crearRecomendacion,
  actualizarRecomendacion,
  eliminarRecomendacion,
  obtenerPlantasMasRecomendadas
};
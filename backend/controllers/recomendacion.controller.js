const Recomendacion = require('../models/recomendacion');

const obtenerRecomendaciones = async (req, res) => {
  try {
    const recomendaciones = await Recomendacion.obtenerTodas();
    res.json({
      exito: true,
      datos: recomendaciones
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener recomendaciones',
      error: error.message
    });
  }
};

const obtenerRecomendacionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const recomendacion = await Recomendacion.obtenerPorId(id);
    
    if (!recomendacion) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Recomendación no encontrada'
      });
    }
    
    res.json({
      exito: true,
      datos: recomendacion
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener recomendación',
      error: error.message
    });
  }
};

const crearRecomendacion = async (req, res) => {
  try {
    const datosRecomendacion = req.body;
    const nuevaRecomendacion = await Recomendacion.crear(datosRecomendacion);
    
    res.status(201).json({
      exito: true,
      mensaje: 'Recomendación creada exitosamente',
      datos: nuevaRecomendacion
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear recomendación',
      error: error.message
    });
  }
};

const actualizarRecomendacion = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;
    const recomendacionActualizada = await Recomendacion.actualizar(id, datosActualizados);
    
    if (!recomendacionActualizada) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Recomendación no encontrada'
      });
    }
    
    res.json({
      exito: true,
      mensaje: 'Recomendación actualizada exitosamente',
      datos: recomendacionActualizada
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar recomendación',
      error: error.message
    });
  }
};

const eliminarRecomendacion = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Recomendacion.eliminar(id);
    
    if (!eliminada) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Recomendación no encontrada'
      });
    }
    
    res.json({
      exito: true,
      mensaje: 'Recomendación eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar recomendación',
      error: error.message
    });
  }
};

module.exports = {
  obtenerRecomendaciones,
  obtenerRecomendacionPorId,
  crearRecomendacion,
  actualizarRecomendacion,
  eliminarRecomendacion
};
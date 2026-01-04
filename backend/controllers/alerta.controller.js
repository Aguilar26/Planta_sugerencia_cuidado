const Alerta = require('../models/alerta');

const obtenerAlertas = async (req, res) => {
  try {
    const alertas = await Alerta.obtenerTodas();
    res.json({
      exito: true,
      datos: alertas
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener alertas',
      error: error.message
    });
  }
};

const obtenerAlertaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const alerta = await Alerta.obtenerPorId(id);
    
    if (!alerta) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Alerta no encontrada'
      });
    }
    
    res.json({
      exito: true,
      datos: alerta
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener alerta',
      error: error.message
    });
  }
};

const crearAlerta = async (req, res) => {
  try {
    const datosAlerta = req.body;
    const nuevaAlerta = await Alerta.crear(datosAlerta);
    
    res.status(201).json({
      exito: true,
      mensaje: 'Alerta creada exitosamente',
      datos: nuevaAlerta
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear alerta',
      error: error.message
    });
  }
};

const actualizarAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const datosActualizados = req.body;
    const alertaActualizada = await Alerta.actualizar(id, datosActualizados);
    
    if (!alertaActualizada) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Alerta no encontrada'
      });
    }
    
    res.json({
      exito: true,
      mensaje: 'Alerta actualizada exitosamente',
      datos: alertaActualizada
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar alerta',
      error: error.message
    });
  }
};

const completarAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const alertaCompletada = await Alerta.completar(id);
    
    if (!alertaCompletada) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Alerta no encontrada'
      });
    }
    
    res.json({
      exito: true,
      mensaje: 'Alerta completada exitosamente',
      datos: alertaCompletada
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al completar alerta',
      error: error.message
    });
  }
};

const eliminarAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const eliminada = await Alerta.eliminar(id);
    
    if (!eliminada) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Alerta no encontrada'
      });
    }
    
    res.json({
      exito: true,
      mensaje: 'Alerta eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar alerta',
      error: error.message
    });
  }
};

module.exports = {
  obtenerAlertas,
  obtenerAlertaPorId,
  crearAlerta,
  actualizarAlerta,
  completarAlerta,
  eliminarAlerta
};
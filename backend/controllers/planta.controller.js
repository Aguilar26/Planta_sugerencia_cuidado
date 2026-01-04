const mongoose = require('mongoose');

const obtenerTodasLasPlantas = async (req, res) => {
  try {
    const Plant = mongoose.model('Planta');
    const plantas = await Plant.find().lean();
    res.json({
      exito: true,
      datos: plantas
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener plantas',
      error: error.message
    });
  }
};

const obtenerPlantaPorId = async (req, res) => {
  try {
    const Plant = mongoose.model('Planta');
    const planta = await Plant.findById(req.params.id).lean();

    if (!planta) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Planta no encontrada'
      });
    }

    res.json({
      exito: true,
      datos: planta
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al obtener la planta',
      error: error.message
    });
  }
};

const crearPlanta = async (req, res) => {
  try {
    const Plant = mongoose.model('Planta');
    const nuevaPlanta = new Plant({
      idPlanta: String(Date.now()),
      nombre_comun: req.body.nombre_comun,
      nombre_cientifico: req.body.nombre_cientifico,
      dificultad: req.body.dificultad,
      requerimientos: req.body.requerimientos || {},
      cuidados: req.body.cuidados || {},
      objetivos: req.body.objetivos || [],
      toxicidad: req.body.toxicidad || {},
      descripcion: req.body.descripcion,
      precio: req.body.precio !== undefined ? req.body.precio : null,
      disponible: req.body.disponible !== undefined ? req.body.disponible : true,
      imagenes: req.body.imagenes || []
    });

    await nuevaPlanta.save();
    res.status(201).json({
      exito: true,
      mensaje: 'Planta creada exitosamente',
      datos: nuevaPlanta
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al crear la planta',
      error: error.message
    });
  }
};

const actualizarPlanta = async (req, res) => {
  try {
    const Plant = mongoose.model('Planta');
    console.log('🔎 actualizarPlanta id recibido:', req.params.id);
    const existenteAntes = await mongoose.model('Planta').findById(req.params.id).lean();
    console.log('🔎 existenteAntes:', existenteAntes);

    const actualizado = await Plant.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!actualizado) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Planta no encontrada'
      });
    }

    res.json({
      exito: true,
      mensaje: 'Planta actualizada exitosamente',
      datos: actualizado
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al actualizar la planta',
      error: error.message
    });
  }
};

const eliminarPlanta = async (req, res) => {
  try {
    const Plant = mongoose.model('Planta');
    console.log('🔎 eliminarPlanta id recibido:', req.params.id);
    const existenteAntes = await mongoose.model('Planta').findById(req.params.id).lean();
    console.log('🔎 existenteAntes (eliminar):', existenteAntes);

    const eliminado = await Plant.findByIdAndDelete(req.params.id).lean();

    if (!eliminado) {
      return res.status(404).json({
        exito: false,
        mensaje: 'Planta no encontrada'
      });
    }

    res.json({
      exito: true,
      mensaje: 'Planta eliminada correctamente',
      datos: eliminado
    });
  } catch (error) {
    console.error('❌ ERROR:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al eliminar la planta',
      error: error.message
    });
  }
};

module.exports = {
  obtenerTodasLasPlantas,
  obtenerPlantaPorId,
  crearPlanta,
  actualizarPlanta,
  eliminarPlanta
};
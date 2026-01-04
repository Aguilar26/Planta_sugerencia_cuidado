const express = require('express');
const router = express.Router();
const {
  obtenerRecomendaciones,
  obtenerRecomendacionPorId,
  crearRecomendacion,
  actualizarRecomendacion,
  eliminarRecomendacion
} = require('../controllers/recomendacion.controller');

router.get('/', obtenerRecomendaciones);
router.get('/:id', obtenerRecomendacionPorId);
router.post('/', crearRecomendacion);
router.put('/:id', actualizarRecomendacion);
router.delete('/:id', eliminarRecomendacion);

module.exports = router;
const express = require('express');
const router = express.Router();
const plantaController = require('../controllers/planta.controller');

router.get('/', plantaController.obtenerTodasLasPlantas);
router.get('/:id', plantaController.obtenerPlantaPorId);
router.post('/', plantaController.crearPlanta);
router.put('/:id', plantaController.actualizarPlanta);
router.delete('/:id', plantaController.eliminarPlanta);

module.exports = router;
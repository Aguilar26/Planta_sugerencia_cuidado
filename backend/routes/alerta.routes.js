const express = require('express');
const router = express.Router();
const {
  obtenerAlertas,
  obtenerAlertaPorId,
  crearAlerta,
  actualizarAlerta,
  eliminarAlerta,
  completarAlerta
} = require('../controllers/alerta.controller');

router.get('/', obtenerAlertas);
router.get('/:id', obtenerAlertaPorId);
router.post('/', crearAlerta);
router.put('/:id/completar', completarAlerta); // ← ESTA DEBE IR PRIMERO
router.put('/:id', actualizarAlerta);           // ← ESTA DESPUÉS
router.delete('/:id', eliminarAlerta);

module.exports = router;
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuario.controller');

// Rutas CRUD
router.get('/', usuarioController.obtenerTodos);
router.get('/:id', usuarioController.obtenerPorId);
router.post('/', usuarioController.crear);
router.put('/:id', usuarioController.actualizar);
router.delete('/:id', usuarioController.eliminar);

// Rutas de autenticación
router.post('/login', usuarioController.loginUsuario);
router.post('/register', usuarioController.registrarUsuario);

module.exports = router;
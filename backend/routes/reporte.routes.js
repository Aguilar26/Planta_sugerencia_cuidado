const express = require('express');
const router = express.Router();
const {
  obtenerEstadisticas,
  obtenerPlantasMasRecomendadas,
  obtenerUsuariosActivos,
  obtenerAlertasProximas
} = require('../controllers/reporte.controller');

router.get('/estadisticas', obtenerEstadisticas);
router.get('/plantas-mas-recomendadas', obtenerPlantasMasRecomendadas);
router.get('/usuarios-activos', obtenerUsuariosActivos);
router.get('/alertas-proximas', obtenerAlertasProximas);

module.exports = router;
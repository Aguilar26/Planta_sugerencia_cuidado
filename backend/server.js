const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// IMPORTAR CONEXIONES A BASES DE DATOS
const { conectarMongo } = require('./config/mongodb');
const { probarConexion } = require('./config/database');

const app = express();
const PUERTO = 1250;

app.use(cors());
app.use(express.json());

// REGISTRAR MODELO DE MONGOOSE ANTES DE USAR LAS RUTAS
require('./models/planta');

const rutasPlantas = require('./routes/planta.routes');
const rutasUsuarios = require('./routes/usuario.routes');
const rutasRecomendaciones = require('./routes/recomendacion.routes');
const rutasAlertas = require('./routes/alerta.routes');
const rutasReportes = require('./routes/reporte.routes');

// Rutas API PRIMERO
app.use('/api/plantas', rutasPlantas);
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/recomendaciones', rutasRecomendaciones);
app.use('/api/alertas', rutasAlertas);
app.use('/api/reportes', rutasReportes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend funcionando correctamente' });
});

// Servir frontend compilado
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Todas las rutas no API sirven el index.html del frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// INICIAR SERVIDOR
(async () => {
  try {
    console.log('🚀 Iniciando servidor...\n');
    
    const sqlConectado = await probarConexion();
    if (!sqlConectado) {
      console.log('⚠️  SQL Server no conectado');
    }
    
    await conectarMongo();
    
    app.listen(PUERTO, () => {
      console.log(`\n✅ Aplicación completa corriendo en: http://localhost:${PUERTO}\n`);
    });
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
})();
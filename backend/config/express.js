const express = require('express');
const app = express();

const plantaRoutes = require('../routes/planta.routes');
const usuarioRoutes = require('../routes/usuario.routes');

app.use(express.json());

app.use('/api/plantas', plantaRoutes);
app.use('/api/usuarios', usuarioRoutes);

module.exports = app;

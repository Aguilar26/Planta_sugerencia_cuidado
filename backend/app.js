const express = require('express');
const app = express();

const authMiddleware = require('./middlewares/auth.middleware');
const errorMiddleware = require('./middlewares/error.middleware');

app.use(express.json());

app.get('/api/seguro', authMiddleware, (req, res) => {
  res.json({ mensaje: 'Acceso permitido' });
});

app.use(errorMiddleware);

module.exports = app;

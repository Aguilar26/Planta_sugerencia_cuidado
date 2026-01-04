module.exports = (err, req, res, next) => {
  res.status(500).json({ mensaje: 'Error interno del servidor' });
};

module.exports = (req, res, next) => {
  const { nombre, tipo } = req.body;

  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ mensaje: 'Nombre requerido' });
  }

  if (!tipo || tipo.trim() === '') {
    return res.status(400).json({ mensaje: 'Tipo requerido' });
  }

  next();
};

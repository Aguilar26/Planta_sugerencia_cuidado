module.exports = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado' });
  }

  if (token !== 'token-seguro') {
    return res.status(403).json({ mensaje: 'Token inválido' });
  }

  next();
};

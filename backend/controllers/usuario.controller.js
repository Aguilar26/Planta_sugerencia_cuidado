const Usuario = require('../models/usuario');

/* ===============================
   OBTENER TODOS LOS USUARIOS
================================ */
const obtenerTodos = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodosLosUsuarios();
    res.json({ exito: true, datos: usuarios });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

/* ===============================
   OBTENER USUARIO POR ID
================================ */
const obtenerPorId = async (req, res) => {
  try {
    const usuario = await Usuario.obtenerUsuarioPorId(req.params.id);
    if (!usuario) {
      return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado' });
    }
    res.json({ exito: true, datos: usuario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

/* ===============================
   CREAR / REGISTRAR USUARIO
================================ */
const crear = async (req, res) => {
  try {
    const nombreUsuario = req.body.nombreUsuario || req.body.nombre_usuario;
    const emailUsuario = req.body.emailUsuario || req.body.email_usuario;
    const passwordHash = req.body.passwordHash || req.body.password_hash;
    const experiencia = req.body.experiencia || 'Principiante';

    if (!nombreUsuario || !emailUsuario || !passwordHash) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Nombre, email y contraseña son obligatorios'
      });
    }

    const nuevoUsuario = await Usuario.crearUsuario({
      nombreUsuario,
      emailUsuario,
      passwordHash,
      experiencia
    });

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario creado exitosamente',
      datos: nuevoUsuario
    });

  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

/* ===============================
   ACTUALIZAR USUARIO
================================ */
const actualizar = async (req, res) => {
  try {
    await Usuario.actualizarUsuario(req.params.id, {
      nombreUsuario: req.body.nombreUsuario || req.body.nombre_usuario,
      experiencia: req.body.experiencia,
      espacioDisponible: req.body.espacioDisponible || req.body.espacio_disponible,
      condicionesLuz: req.body.condicionesLuz || req.body.condiciones_luz,
      objetivos: req.body.objetivos
    });

    const actualizado = await Usuario.obtenerUsuarioPorId(req.params.id);
    res.json({ exito: true, datos: actualizado });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

/* ===============================
   ELIMINAR USUARIO
================================ */
const eliminar = async (req, res) => {
  try {
    await Usuario.eliminarUsuario(req.params.id);
    res.json({ exito: true, mensaje: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

/* ===============================
   LOGIN (ADMIN DEFINIDO AQUÍ)
================================ */
const loginUsuario = async (req, res) => {
  try {
    const email = req.body.email || req.body.emailUsuario || req.body.email_usuario;
    const password = req.body.password || req.body.passwordHash || req.body.password_hash;

    if (!email || !password) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Email y contraseña obligatorios'
      });
    }

    // 🔐 ADMIN FIJO
    if (email === 'abogacy229@gmail.com' && password === '123456789') {
      return res.json({
        exito: true,
        mensaje: 'Login admin exitoso',
        datos: {
          nombre: 'Administrador',
          email,
          rol: 'admin'
        }
      });
    }

    // 👤 USUARIO NORMAL
    const usuario = await Usuario.obtenerUsuarioPorEmail(email);

    if (!usuario || usuario.password_hash !== password) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Credenciales inválidas'
      });
    }

    res.json({
      exito: true,
      mensaje: 'Login usuario exitoso',
      datos: {
        id: usuario.id_usuario,
        nombre: usuario.nombre_usuario,
        email: usuario.email_usuario,
        rol: 'usuario'
      }
    });

  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

/* ===============================
   EXPORTS
================================ */
module.exports = {
  obtenerTodos,
  obtenerPorId,
  crear,
  actualizar,
  eliminar,
  registrarUsuario: crear,
  loginUsuario
};

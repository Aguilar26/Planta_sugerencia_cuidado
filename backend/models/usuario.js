const { ejecutarQuery, ejecutarProcedimiento } = require('../config/database');

const obtenerTodosLosUsuarios = async () => {
  const query = 'SELECT id_usuario, nombre_usuario, email_usuario, experiencia, espacio_disponible, condiciones_luz, objetivos, fecha_registro, activo FROM usuarios ORDER BY id_usuario DESC';
  return await ejecutarQuery(query);
};

const obtenerUsuarioPorId = async (idUsuario) => {
  const query = 'SELECT id_usuario, nombre_usuario, email_usuario, experiencia, espacio_disponible, condiciones_luz, objetivos, fecha_registro, activo FROM usuarios WHERE id_usuario = @id_usuario';
  const parametros = { id_usuario: idUsuario };
  const resultado = await ejecutarQuery(query, parametros);
  return resultado[0];
};

const obtenerUsuarioPorEmail = async (emailUsuario) => {
  const query = 'SELECT * FROM usuarios WHERE email_usuario = @email_usuario';
  const parametros = { email_usuario: emailUsuario };
  const resultado = await ejecutarQuery(query, parametros);
  return resultado[0];
};

const crearUsuario = async (datosUsuario) => {
  console.log('🔍 MODELO crearUsuario - Datos recibidos:', JSON.stringify(datosUsuario, null, 2));
  
  const parametros = {
    nombre_usuario: datosUsuario.nombreUsuario,
    email_usuario: datosUsuario.emailUsuario,
    password_hash: datosUsuario.passwordHash,
    experiencia: datosUsuario.experiencia
  };
  
  console.log('📤 MODELO - Parámetros para SP:', JSON.stringify(parametros, null, 2));
  
  // Validar que los campos no estén vacíos
  if (!parametros.nombre_usuario) {
    throw new Error('nombre_usuario es requerido pero llegó como: ' + datosUsuario.nombreUsuario);
  }
  
  if (!parametros.email_usuario) {
    throw new Error('email_usuario es requerido pero llegó como: ' + datosUsuario.emailUsuario);
  }
  
  if (!parametros.password_hash) {
    throw new Error('password_hash es requerido pero llegó como: ' + datosUsuario.passwordHash);
  }
  
  return await ejecutarProcedimiento('sp_crear_usuario', parametros);
};

const actualizarUsuario = async (idUsuario, datosUsuario) => {
  const query = `
    UPDATE usuarios 
    SET nombre_usuario = @nombre_usuario,
        experiencia = @experiencia,
        espacio_disponible = @espacio_disponible,
        condiciones_luz = @condiciones_luz,
        objetivos = @objetivos
    WHERE id_usuario = @id_usuario
  `;
  
  const parametros = {
    id_usuario: idUsuario,
    nombre_usuario: datosUsuario.nombreUsuario,
    experiencia: datosUsuario.experiencia,
    espacio_disponible: datosUsuario.espacioDisponible,
    condiciones_luz: datosUsuario.condicionesLuz,
    objetivos: datosUsuario.objetivos
  };
  
  return await ejecutarQuery(query, parametros);
};

const eliminarUsuario = async (idUsuario) => {
  const query = 'DELETE FROM usuarios WHERE id_usuario = @id_usuario';
  const parametros = { id_usuario: idUsuario };
  return await ejecutarQuery(query, parametros);
};

const desactivarUsuario = async (idUsuario) => {
  const query = 'UPDATE usuarios SET activo = 0 WHERE id_usuario = @id_usuario';
  const parametros = { id_usuario: idUsuario };
  return await ejecutarQuery(query, parametros);
};

const activarUsuario = async (idUsuario) => {
  const query = 'UPDATE usuarios SET activo = 1 WHERE id_usuario = @id_usuario';
  const parametros = { id_usuario: idUsuario };
  return await ejecutarQuery(query, parametros);
};

module.exports = {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  obtenerUsuarioPorEmail,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  desactivarUsuario,
  activarUsuario
};
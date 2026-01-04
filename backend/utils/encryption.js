const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

const encriptarPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const passwordHash = await bcrypt.hash(password, salt);
    return passwordHash;
  } catch (error) {
    console.error('Error al encriptar password:', error);
    throw new Error('Error en encriptación');
  }
};

const compararPassword = async (password, passwordHash) => {
  try {
    const esValido = await bcrypt.compare(password, passwordHash);
    return esValido;
  } catch (error) {
    console.error('Error al comparar password:', error);
    throw new Error('Error en comparación');
  }
};

const encriptarDatoSensible = (dato) => {
  if (!dato) return null;
  
  constBuffer = require('buffer').Buffer;
  const datoEncriptado = Buffer.from(dato).toString('base64');
  return datoEncriptado;
};

const desencriptarDatoSensible = (datoEncriptado) => {
  if (!datoEncriptado) return null;
  
  const Buffer = require('buffer').Buffer;
  const datoDesencriptado = Buffer.from(datoEncriptado, 'base64').toString('utf8');
  return datoDesencriptado;
};

const generarTokenAleatorio = (longitud = 32) => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < longitud; i++) {
    const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
    token += caracteres[indiceAleatorio];
  }
  
  return token;
};

const validarFortalezaPassword = (password) => {
  const requisitos = {
    longitudMinima: password.length >= 8,
    tieneMayuscula: /[A-Z]/.test(password),
    tieneMinuscula: /[a-z]/.test(password),
    tieneNumero: /[0-9]/.test(password),
    tieneCaracterEspecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const esValido = Object.values(requisitos).every(req => req === true);
  
  return {
    esValido,
    requisitos
  };
};

module.exports = {
  encriptarPassword,
  compararPassword,
  encriptarDatoSensible,
  desencriptarDatoSensible,
  generarTokenAleatorio,
  validarFortalezaPassword
};
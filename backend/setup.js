const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const execAsync = promisify(exec);

require('dotenv').config();

// Colores para consola
const c = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m'
};

const log = {
  info: (msg) => console.log(`${c.cyan}ℹ${c.reset} ${msg}`),
  success: (msg) => console.log(`${c.green}✅${c.reset} ${msg}`),
  error: (msg) => console.log(`${c.red}❌${c.reset} ${msg}`),
  warning: (msg) => console.log(`${c.yellow}⚠️${c.reset} ${msg}`),
  step: (msg) => console.log(`\n${c.blue}▶${c.reset} ${msg}`),
  title: (msg) => console.log(`\n${c.magenta}${'='.repeat(60)}${c.reset}\n${c.magenta}${msg}${c.reset}\n${c.magenta}${'='.repeat(60)}${c.reset}`)
};

// ============================================
// FUNCIONES AUXILIARES
// ============================================

async function verificarArchivo(ruta) {
  try {
    await fs.access(ruta);
    return true;
  } catch {
    return false;
  }
}

async function ejecutarComando(comando, descripcion) {
  try {
    log.info(`Ejecutando: ${descripcion}...`);
    const { stdout, stderr } = await execAsync(comando);
    if (stderr && !stderr.includes('npm WARN')) {
      log.warning(stderr);
    }
    return { success: true, output: stdout };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ============================================
// PASO 1: VERIFICAR ARCHIVO .ENV
// ============================================

async function verificarEnv() {
  log.step('Verificando archivo .env...');
  
  const envExiste = await verificarArchivo('.env');
  
  if (!envExiste) {
    log.error('No se encontró el archivo .env');
    log.info('Crea un archivo .env con las siguientes variables:');
    console.log(`
PORT=1250

SQL_SERVER=localhost
SQL_USER=tu_usuario
SQL_PASSWORD=tu_contraseña
SQL_DATABASE=planta_cuidado_db
SQL_PORT=1433

MONGODB_URI=mongodb://localhost:27017/planta_cuidado_db

JWT_SECRET=tu_clave_secreta
NODE_ENV=development
    `);
    return false;
  }
  
  log.success('Archivo .env encontrado');
  return true;
}

// ============================================
// PASO 2: INSTALAR DEPENDENCIAS
// ============================================

async function instalarDependencias() {
  log.step('Instalando dependencias del backend...');
  
  const resultado = await ejecutarComando('npm install', 'npm install');
  
  if (resultado.success) {
    log.success('Dependencias del backend instaladas');
    return true;
  } else {
    log.error('Error al instalar dependencias');
    return false;
  }
}

// ============================================
// PASO 3: VERIFICAR SQL SERVER
// ============================================

async function verificarSQLServer() {
  log.step('Verificando conexión a SQL Server...');
  
  const { SQL_SERVER, SQL_USER, SQL_PASSWORD, SQL_DATABASE } = process.env;
  
  const comando = `sqlcmd -S ${SQL_SERVER} -U ${SQL_USER} -P ${SQL_PASSWORD} -d master -Q "SELECT @@VERSION"`;
  
  const resultado = await ejecutarComando(comando, 'Conexión SQL Server');
  
  if (resultado.success) {
    log.success('SQL Server conectado correctamente');
    return true;
  } else {
    log.error('No se pudo conectar a SQL Server');
    log.info('Verifica:');
    log.info('  1. SQL Server está corriendo');
    log.info('  2. Credenciales en .env son correctas');
    log.info('  3. Usuario tiene permisos');
    return false;
  }
}

// ============================================
// PASO 4: CREAR BASE DE DATOS SQL
// ============================================

async function crearBaseDatosSQL() {
  log.step('Verificando/creando base de datos SQL Server...');
  
  const { SQL_SERVER, SQL_USER, SQL_PASSWORD, SQL_DATABASE } = process.env;
  
  const comando = `sqlcmd -S ${SQL_SERVER} -U ${SQL_USER} -P ${SQL_PASSWORD} -Q "IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = '${SQL_DATABASE}') CREATE DATABASE ${SQL_DATABASE};"`;
  
  const resultado = await ejecutarComando(comando, 'Crear base de datos');
  
  if (resultado.success) {
    log.success(`Base de datos '${SQL_DATABASE}' lista`);
    return true;
  } else {
    log.error('Error al crear base de datos');
    return false;
  }
}

// ============================================
// PASO 5: EJECUTAR SCHEMA SQL
// ============================================

async function ejecutarSchemaSQL() {
  log.step('Creando tablas en SQL Server...');
  
  const schemaPath = path.join(__dirname, 'database', 'schema.sql');
  const existe = await verificarArchivo(schemaPath);
  
  if (!existe) {
    log.error('No se encontró database/schema.sql');
    return false;
  }
  
  const { SQL_SERVER, SQL_USER, SQL_PASSWORD, SQL_DATABASE } = process.env;
  const comando = `sqlcmd -S ${SQL_SERVER} -U ${SQL_USER} -P ${SQL_PASSWORD} -d ${SQL_DATABASE} -i "${schemaPath}"`;
  
  const resultado = await ejecutarComando(comando, 'Ejecutar schema.sql');
  
  if (resultado.success) {
    log.success('Tablas creadas: usuarios, recomendaciones, alertas, auditoria');
    return true;
  } else {
    log.error('Error al crear tablas');
    return false;
  }
}

// ============================================
// PASO 6: INSERTAR DATOS SQL
// ============================================

async function ejecutarSeedsSQL() {
  log.step('Insertando datos iniciales en SQL Server...');
  
  const seedsPath = path.join(__dirname, 'database', 'seeds.sql');
  const existe = await verificarArchivo(seedsPath);
  
  if (!existe) {
    log.error('No se encontró database/seeds.sql');
    return false;
  }
  
  const { SQL_SERVER, SQL_USER, SQL_PASSWORD, SQL_DATABASE } = process.env;
  const comando = `sqlcmd -S ${SQL_SERVER} -U ${SQL_USER} -P ${SQL_PASSWORD} -d ${SQL_DATABASE} -i "${seedsPath}"`;
  
  const resultado = await ejecutarComando(comando, 'Ejecutar seeds.sql');
  
  if (resultado.success) {
    log.success('Datos insertados: 3 usuarios, 6 recomendaciones, 6 alertas');
    return true;
  } else {
    log.error('Error al insertar datos SQL');
    return false;
  }
}

// ============================================
// PASO 7: VERIFICAR MONGODB
// ============================================

async function verificarMongoDB() {
  log.step('Verificando conexión a MongoDB...');
  
  try {
    const mongoose = require('mongoose');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    log.success('MongoDB conectado correctamente');
    await mongoose.connection.close();
    return true;
  } catch (error) {
    log.error('No se pudo conectar a MongoDB');
    log.info('Ejecuta: net start MongoDB');
    return false;
  }
}

// ============================================
// PASO 8: INSERTAR PLANTAS EN MONGODB
// ============================================

async function insertarPlantasMongoDB() {
  log.step('Insertando plantas en MongoDB...');
  
  const seedPath = path.join(__dirname, 'seed-plantas.js');
  const existe = await verificarArchivo(seedPath);
  
  if (!existe) {
    log.error('No se encontró seed-plantas.js');
    return false;
  }
  
  const resultado = await ejecutarComando(`node "${seedPath}"`, 'Insertar plantas');
  
  if (resultado.success) {
    log.success('5 plantas insertadas en MongoDB');
    return true;
  } else {
    log.error('Error al insertar plantas');
    return false;
  }
}

// ============================================
// PASO 9: VERIFICAR TODO
// ============================================

async function verificarConfiguracion() {
  log.step('Verificando configuración final...');
  
  try {
    const { conectarDB } = require('./config/database');
    const { conectarMongo } = require('./config/mongodb');
    
    await conectarDB();
    log.success('SQL Server: Conexión verificada ✓');
    
    await conectarMongo();
    log.success('MongoDB: Conexión verificada ✓');
    
    return true;
  } catch (error) {
    log.error('Error en verificación final');
    return false;
  }
}

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================

async function main() {
  log.title('🌱 CONFIGURACIÓN AUTOMÁTICA - PLANTA CUIDADO SUGERENCIA 🌱');
  
  console.log(`
Este script configurará automáticamente:
  1. Dependencias del proyecto
  2. Base de datos SQL Server
  3. Base de datos MongoDB
  4. Datos iniciales

Requisitos previos:
  ✓ SQL Server instalado y corriendo
  ✓ MongoDB instalado y corriendo
  ✓ Archivo .env configurado

Presiona Ctrl+C para cancelar o espera 5 segundos...
  `);
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  let pasosFallidos = [];
  
  // PASO 1
  if (!await verificarEnv()) {
    pasosFallidos.push('Archivo .env');
    process.exit(1);
  }
  
  // PASO 2
  if (!await instalarDependencias()) {
    pasosFallidos.push('Instalación de dependencias');
  }
  
  // PASO 3
  if (!await verificarSQLServer()) {
    pasosFallidos.push('Conexión SQL Server');
  }
  
  // PASO 4
  if (!await crearBaseDatosSQL()) {
    pasosFallidos.push('Crear base de datos SQL');
  }
  
  // PASO 5
  if (!await ejecutarSchemaSQL()) {
    pasosFallidos.push('Crear tablas SQL');
  }
  
  // PASO 6
  if (!await ejecutarSeedsSQL()) {
    pasosFallidos.push('Insertar datos SQL');
  }
  
  // PASO 7
  if (!await verificarMongoDB()) {
    pasosFallidos.push('Conexión MongoDB');
  }
  
  // PASO 8
  if (!await insertarPlantasMongoDB()) {
    pasosFallidos.push('Insertar plantas MongoDB');
  }
  
  // PASO 9
  await verificarConfiguracion();
  
  // RESULTADO FINAL
  log.title('🎉 CONFIGURACIÓN COMPLETADA 🎉');
  
  if (pasosFallidos.length === 0) {
    console.log(`
${c.green}✅ TODO CONFIGURADO CORRECTAMENTE${c.reset}

Bases de datos listas:
  📊 SQL Server: usuarios, recomendaciones, alertas
  🍃 MongoDB: 5 plantas insertadas

Para iniciar el servidor:
  ${c.cyan}npm start${c.reset}

Para ver las APIs:
  ${c.cyan}http://localhost:1250/api/usuarios${c.reset}
  ${c.cyan}http://localhost:1250/api/plantas${c.reset}
  ${c.cyan}http://localhost:1250/api/recomendaciones${c.reset}
  ${c.cyan}http://localhost:1250/api/alertas${c.reset}
    `);
  } else {
    console.log(`
${c.yellow}⚠️  CONFIGURACIÓN COMPLETADA CON ADVERTENCIAS${c.reset}

Pasos fallidos:
${pasosFallidos.map(p => `  ${c.red}✗${c.reset} ${p}`).join('\n')}

Revisa los errores arriba y corrígelos manualmente.
    `);
  }
  
  process.exit(0);
}

// EJECUTAR
main().catch(error => {
  log.error('Error fatal en el setup:');
  console.error(error);
  process.exit(1);
});
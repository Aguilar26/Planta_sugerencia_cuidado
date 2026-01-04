require('dotenv').config();
const sql = require('mssql');
const mongoose = require('mongoose');
const os = require('os');

// Obtener el usuario y dominio actual
const userInfo = os.userInfo();
const userName = process.env.USERNAME || userInfo.username;
const domain = process.env.USERDOMAIN || 'DESKTOP-MMUBUOT';

// Configuración SQL Server - Usar usuario SQL Server
const configuracionSQL = {
  server: os.hostname(),
  database: 'planta_cuidado_db',
  user: 'test_user',
  password: 'Test@1234',
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: false,
    trustServerCertificate: false,
    enableArithAbort: true,
    connectionTimeout: 15000,
    requestTimeout: 15000
  }
};

// Configuración MongoDB
const configuracionMongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/planta_cuidado_db';

console.log('🧪 INICIANDO PRUEBAS DE CONEXIÓN\n');
console.log('═══════════════════════════════════════════════════');

// Prueba SQL Server
async function probarSQLServer() {
  console.log('\n📡 PROBANDO SQL SERVER');
  console.log('───────────────────────────────────────────────────');
  console.log(`Servidor: ${configuracionSQL.server}`);
  console.log(`Base de datos: ${configuracionSQL.database}`);
  console.log(`Usuario: ${configuracionSQL.user}`);
  
  try {
    console.log('Intentando conectar...');
    const pool = await sql.connect(configuracionSQL);
    console.log('✅ CONECTADO A SQL SERVER');
    
    // Prueba de query simple
    const resultado = await pool.request().query('SELECT @@VERSION as version');
    console.log(`📊 Versión: ${resultado.recordset[0].version.substring(0, 80)}...`);
    
    // Obtener información de la base de datos
    const dbInfo = await pool.request().query(`
      SELECT 
        DB_NAME() as NombreBD,
        @@SERVERNAME as ServidorName,
        GETDATE() as FechaHora
    `);
    
    console.log(`📂 BD Actual: ${dbInfo.recordset[0].NombreBD}`);
    console.log(`🖥️  Servidor: ${dbInfo.recordset[0].ServidorName}`);
    console.log(`⏰ Hora del servidor: ${dbInfo.recordset[0].FechaHora}`);
    
    await pool.close();
    console.log('✅ Conexión cerrada correctamente');
    return true;
  } catch (error) {
    console.error('❌ ERROR AL CONECTAR A SQL SERVER');
    console.error(`Mensaje: ${error.message}`);
    console.error(`Código: ${error.code}`);
    return false;
  }
}

// Prueba MongoDB
async function probarMongoDB() {
  console.log('\n🍃 PROBANDO MONGODB');
  console.log('───────────────────────────────────────────────────');
  console.log(`URI: ${configuracionMongoDB}`);
  
  try {
    // Conectar a MongoDB
    const conexion = await mongoose.connect(configuracionMongoDB, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    
    console.log('✅ CONECTADO A MONGODB');
    
    // Información de la conexión
    const admin = mongoose.connection.getClient().db().admin();
    const status = await admin.ping();
    console.log('🏓 Ping exitoso');
    
    // Información del servidor
    const serverInfo = await admin.serverInfo();
    console.log(`📊 Versión MongoDB: ${serverInfo.version}`);
    
    // Listar bases de datos
    const dbs = await admin.listDatabases();
    console.log(`📂 Total de bases de datos: ${dbs.databases.length}`);
    
    // Obtener estadísticas de la BD actual
    const stats = await mongoose.connection.db.stats();
    console.log(`💾 Tamaño de la BD: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📦 Número de colecciones: ${stats.collections}`);
    
    // Listar colecciones
    const colecciones = await mongoose.connection.db.listCollections().toArray();
    console.log(`📋 Colecciones: ${colecciones.map(c => c.name).join(', ') || 'Ninguna'}`);
    
    await mongoose.connection.close();
    console.log('✅ Conexión cerrada correctamente');
    return true;
  } catch (error) {
    console.error('❌ ERROR AL CONECTAR A MONGODB');
    console.error(`Mensaje: ${error.message}`);
    console.error(`Código: ${error.code || 'N/A'}`);
    return false;
  }
}

// Ejecutar pruebas
async function ejecutarPruebas() {
  const resultadoSQL = await probarSQLServer();
  const resultadoMongoDB = await probarMongoDB();
  
  console.log('\n═══════════════════════════════════════════════════');
  console.log('\n📋 RESUMEN DE RESULTADOS');
  console.log('───────────────────────────────────────────────────');
  console.log(`SQL Server: ${resultadoSQL ? '✅ CONECTADO' : '❌ DESCONECTADO'}`);
  console.log(`MongoDB: ${resultadoMongoDB ? '✅ CONECTADO' : '❌ DESCONECTADO'}`);
  
  if (resultadoSQL && resultadoMongoDB) {
    console.log('\n✅ AMBAS CONEXIONES FUNCIONANDO CORRECTAMENTE');
  } else if (!resultadoSQL && !resultadoMongoDB) {
    console.log('\n❌ NINGUNA CONEXIÓN DISPONIBLE - REVISAR SERVICIOS');
  } else {
    console.log('\n⚠️  UNA DE LAS CONEXIONES NO ESTÁ DISPONIBLE');
  }
  
  process.exit(resultadoSQL && resultadoMongoDB ? 0 : 1);
}

ejecutarPruebas().catch(error => {
  console.error('Error fatal:', error);
  process.exit(1);
});

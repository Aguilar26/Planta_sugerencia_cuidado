const sql = require('mssql');
require('dotenv').config();

const configuracionDB = {
  server: process.env.SQL_SERVER || 'localhost',
  database: process.env.SQL_DATABASE || 'planta_cuidado_db',
  user: process.env.SQL_USER || 'planta_user',
  password: process.env.SQL_PASSWORD || 'Planta2024!',
  port: parseInt(process.env.SQL_PORT) || 1433,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    enableArithAbort: true
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

let poolConexion = null;

async function conectarDB() {
  try {
    if (poolConexion) {
      return poolConexion;
    }
    
    poolConexion = await sql.connect(configuracionDB);
    console.log('✅ Conexión exitosa a SQL Server');
    return poolConexion;
  } catch (error) {
    console.error('❌ Error al conectar con SQL Server:', error.message);
    throw error;
  }
}

async function ejecutarQuery(query, parametros = {}) {
  try {
    const pool = await conectarDB();
    const solicitud = pool.request();
    
    for (const [clave, valor] of Object.entries(parametros)) {
      solicitud.input(clave, valor);
    }
    
    const resultado = await solicitud.query(query);
    return resultado.recordset;
  } catch (error) {
    console.error('Error ejecutando query:', error);
    throw error;
  }
}

async function ejecutarProcedimiento(nombreProcedimiento, parametros = {}) {
  try {
    const pool = await conectarDB();
    const solicitud = pool.request();
    
    for (const [clave, valor] of Object.entries(parametros)) {
      solicitud.input(clave, valor);
    }
    
    const resultado = await solicitud.execute(nombreProcedimiento);
    return resultado.recordset;
  } catch (error) {
    console.error('Error ejecutando procedimiento:', error);
    throw error;
  }
}

async function ejecutarTransaccion(operaciones) {
  const pool = await conectarDB();
  const transaccion = new sql.Transaction(pool);
  
  try {
    await transaccion.begin();
    
    const resultados = [];
    
    for (const { query, parametros } of operaciones) {
      const solicitud = new sql.Request(transaccion);
      
      for (const [clave, valor] of Object.entries(parametros || {})) {
        solicitud.input(clave, valor);
      }
      
      const resultado = await solicitud.query(query);
      resultados.push(resultado.recordset);
    }
    
    await transaccion.commit();
    return resultados;
  } catch (error) {
    await transaccion.rollback();
    console.error('Error en transacción:', error);
    throw error;
  }
}

async function cerrarConexion() {
  try {
    if (poolConexion) {
      await poolConexion.close();
      poolConexion = null;
      console.log('Conexión cerrada');
    }
  } catch (error) {
    console.error('Error al cerrar conexión:', error);
  }
}

async function probarConexion() {
  try {
    const pool = await conectarDB();
    return pool ? true : false;
  } catch (error) {
    console.error('Error en prueba de conexión:', error);
    return false;
  }
}

module.exports = {
  conectarDB,
  ejecutarQuery,
  ejecutarProcedimiento,
  ejecutarTransaccion,
  cerrarConexion,
  probarConexion,
  sql
};
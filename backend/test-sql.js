const { probarConexion, ejecutarQuery, cerrarConexion } = require('./config/database');

const probarConexionSQL = async () => {
  console.log('🔍 Probando conexión a SQL Server...\n');
  
  try {
    // Probar conexión básica
    const conectado = await probarConexion();
    
    if (conectado) {
      console.log('\n✅ CONEXIÓN EXITOSA\n');
      
      // Probar una query simple
      console.log('🔍 Probando query simple...');
      const resultado = await ejecutarQuery('SELECT GETDATE() AS fecha_actual, DB_NAME() AS base_datos');
      console.log('📅 Fecha actual:', resultado[0].fecha_actual);
      console.log('🗄️  Base de datos:', resultado[0].base_datos);
      
      console.log('\n✅ TODO FUNCIONA CORRECTAMENTE\n');
    } else {
      console.log('\n❌ NO SE PUDO CONECTAR\n');
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\n💡 SOLUCIONES POSIBLES:');
    console.error('   1. Verifica que SQL Server esté corriendo');
    console.error('   2. Revisa las credenciales en el archivo .env');
    console.error('   3. Verifica que la base de datos "planta_cuidado_db" exista');
    console.error('   4. Asegúrate de que el puerto 1433 esté abierto\n');
  } finally {
    await cerrarConexion();
    process.exit();
  }
};

probarConexionSQL();
const mongoose = require('mongoose');
require('dotenv').config();

const conectarMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✅ Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('📡 MongoDB conectado correctamente');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ Error en MongoDB:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('📴 MongoDB desconectado');
});

const cerrarConexionMongoDB = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ Conexión a MongoDB cerrada');
  } catch (error) {
    console.error('❌ Error al cerrar MongoDB:', error);
  }
};

module.exports = {
  conectarMongo: conectarMongoDB,
  conectarMongoDB,
  cerrarConexionMongoDB
};
const { conectarMongo } = require('../config/mongodb');
const Plant = require('../models/Plant');
const User = require('../models/User');

async function seed() {
  await conectarMongo();

  const sampleUser = {
    idUsuario: 'user-1',
    nombreUsuario: 'Test User',
    emailUsuario: 'test@example.com',
    experiencia: 'Principiante',
    espacioDisponible: 'Pequeño',
    condicionesLuz: 'Interior'
  };

  const samplePlant = {
    idPlanta: 'plant-1',
    nombrePlanta: 'Sansevieria',
    nombreCientifico: 'Sansevieria trifasciata',
    dificultad: 'Baja',
    espacioRequerido: 'Pequeño',
    nivelLuz: 'Baja - Media',
    frecuenciaRiego: 'Cada 2-3 semanas',
    descripcion: 'Planta resistente de interior',
    precioPlanta: 12.5,
    disponible: true
  };

  try {
    const u = await User.findOne({ idUsuario: sampleUser.idUsuario });
    if (!u) {
      await User.create(sampleUser);
      console.log('Usuario de ejemplo creado');
    } else {
      console.log('Usuario de ejemplo ya existe');
    }

    const p = await Plant.findOne({ idPlanta: samplePlant.idPlanta });
    if (!p) {
      await Plant.create(samplePlant);
      console.log('Planta de ejemplo creada');
    } else {
      console.log('Planta de ejemplo ya existe');
    }

    process.exit(0);
  } catch (err) {
    console.error('Error al sembrar datos:', err);
    process.exit(1);
  }
}

seed();

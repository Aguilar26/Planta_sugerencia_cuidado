const mongoose = require('mongoose');
require('dotenv').config();

const plantaSchema = new mongoose.Schema({
  nombre_comun: String,
  nombre_cientifico: String,
  dificultad: String,
  requerimientos: {
    espacio: String,
    luz: String,
    temperatura: String,
    humedad: String
  },
  cuidados: {
    riego: {
      frecuencia_dias: Number,
      descripcion: String
    },
    luz: String,
    temperatura: String,
    poda: String,
    fertilizante: String
  },
  objetivos: [String],
  toxicidad: {
    es_toxica: Boolean,
    mascotas: Boolean,
    detalles: String
  },
  descripcion: String,
  consejos: [String],
  precio: Number,
  disponible: Boolean,
  imagenes: [String]
}, { collection: 'plantas' });

const PlantaModel = mongoose.model('Planta', plantaSchema);

const plantasIniciales = [
  {
    nombre_comun: "Pothos",
    nombre_cientifico: "Epipremnum aureum",
    dificultad: "Principiante",
    requerimientos: {
      espacio: "Pequeño a mediano",
      luz: "Luz indirecta baja a media",
      temperatura: "18-27°C",
      humedad: "Media"
    },
    cuidados: {
      riego: {
        frecuencia_dias: 7,
        descripcion: "Regar cuando la tierra esté seca al tacto"
      },
      luz: "Tolera poca luz pero crece mejor con luz indirecta",
      temperatura: "Temperatura ambiente normal",
      poda: "Podar tallos largos para mantener forma",
      fertilizante: "Cada 2 meses en primavera-verano"
    },
    objetivos: ["Decoración", "Purificación del aire", "Principiantes"],
    toxicidad: {
      es_toxica: true,
      mascotas: true,
      detalles: "Tóxica para gatos y perros si se ingiere"
    },
    descripcion: "Planta trepadora de hojas verdes brillantes, extremadamente resistente y fácil de cuidar",
    consejos: [
      "Perfecta para principiantes",
      "Crece rápido en condiciones adecuadas",
      "Puede cultivarse en agua",
      "Tolera olvidos de riego"
    ],
    precio: 15.99,
    disponible: true,
    imagenes: []
  },
  {
    nombre_comun: "Sansevieria",
    nombre_cientifico: "Sansevieria trifasciata",
    dificultad: "Principiante",
    requerimientos: {
      espacio: "Pequeño",
      luz: "Luz baja a alta",
      temperatura: "15-29°C",
      humedad: "Baja"
    },
    cuidados: {
      riego: {
        frecuencia_dias: 14,
        descripcion: "Regar poco, dejar secar completamente entre riegos"
      },
      luz: "Se adapta a cualquier nivel de luz",
      temperatura: "Muy tolerante a diferentes temperaturas",
      poda: "Mínima, solo hojas dañadas",
      fertilizante: "Cada 3 meses"
    },
    objetivos: ["Decoración", "Purificación del aire", "Bajo mantenimiento"],
    toxicidad: {
      es_toxica: true,
      mascotas: true,
      detalles: "Tóxica para mascotas si se ingiere"
    },
    descripcion: "Planta suculenta con hojas verticales, extremadamente resistente",
    consejos: [
      "Casi indestructible",
      "Purifica el aire por la noche",
      "Tolera sequía extrema",
      "No requiere mucha atención"
    ],
    precio: 18.99,
    disponible: true,
    imagenes: []
  },
  {
    nombre_comun: "Monstera",
    nombre_cientifico: "Monstera deliciosa",
    dificultad: "Intermedio",
    requerimientos: {
      espacio: "Grande",
      luz: "Luz indirecta brillante",
      temperatura: "18-27°C",
      humedad: "Alta"
    },
    cuidados: {
      riego: {
        frecuencia_dias: 7,
        descripcion: "Mantener tierra húmeda pero no encharcada"
      },
      luz: "Necesita buena luz indirecta para desarrollar hojas fenestradas",
      temperatura: "Prefiere ambientes cálidos",
      poda: "Podar hojas viejas y guiar crecimiento",
      fertilizante: "Mensual en primavera-verano"
    },
    objetivos: ["Decoración", "Planta de interior grande"],
    toxicidad: {
      es_toxica: true,
      mascotas: true,
      detalles: "Todas las partes son tóxicas si se ingieren"
    },
    descripcion: "Planta tropical con hojas grandes y fenestradas, muy decorativa",
    consejos: [
      "Limpiar hojas regularmente",
      "Necesita soporte para trepar",
      "Rociar hojas aumenta humedad",
      "Crece rápido con buen cuidado"
    ],
    precio: 35.99,
    disponible: true,
    imagenes: []
  },
  {
    nombre_comun: "Albahaca",
    nombre_cientifico: "Ocimum basilicum",
    dificultad: "Principiante",
    requerimientos: {
      espacio: "Pequeño a mediano",
      luz: "Sol directo 6-8 horas",
      temperatura: "18-30°C",
      humedad: "Media"
    },
    cuidados: {
      riego: {
        frecuencia_dias: 2,
        descripcion: "Mantener tierra húmeda, regar frecuentemente"
      },
      luz: "Necesita mucha luz solar directa",
      temperatura: "No tolera heladas",
      poda: "Podar regularmente para estimular crecimiento",
      fertilizante: "Cada 2 semanas con fertilizante orgánico"
    },
    objetivos: ["Cultivo comestible", "Aromática", "Cocina"],
    toxicidad: {
      es_toxica: false,
      mascotas: false,
      detalles: "Segura para consumo humano y mascotas"
    },
    descripcion: "Hierba aromática comestible, ideal para cocina mediterránea",
    consejos: [
      "Cosechar regularmente para más producción",
      "Pellizcar flores para más hojas",
      "Plantar con tomates",
      "Usar hojas frescas para mejor sabor"
    ],
    precio: 8.99,
    disponible: true,
    imagenes: []
  },
  {
    nombre_comun: "Tomate Cherry",
    nombre_cientifico: "Solanum lycopersicum var. cerasiforme",
    dificultad: "Intermedio",
    requerimientos: {
      espacio: "Mediano a grande",
      luz: "Sol directo 8+ horas",
      temperatura: "21-27°C",
      humedad: "Media"
    },
    cuidados: {
      riego: {
        frecuencia_dias: 2,
        descripcion: "Riego profundo y regular, evitar mojar hojas"
      },
      luz: "Necesita pleno sol para producir frutos",
      temperatura: "Sensible a heladas",
      poda: "Eliminar brotes laterales, guiar planta",
      fertilizante: "Semanal durante fructificación"
    },
    objetivos: ["Cultivo comestible", "Huerto urbano"],
    toxicidad: {
      es_toxica: false,
      mascotas: false,
      detalles: "Frutos seguros, hojas ligeramente tóxicas"
    },
    descripcion: "Planta de tomates pequeños, ideal para cultivo en casa",
    consejos: [
      "Necesita tutor o soporte",
      "Polinizar manualmente si está en interior",
      "Cosechar cuando estén completamente rojos",
      "Requiere nutrientes abundantes"
    ],
    precio: 12.99,
    disponible: true,
    imagenes: []
  }
];

const insertarPlantas = async () => {
  try {
    console.log('🔌 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB\n');

    console.log('🗑️  Limpiando colección de plantas...');
    await PlantaModel.deleteMany({});
    console.log('✅ Colección limpiada\n');

    console.log('🌱 Insertando plantas...');
    const resultado = await PlantaModel.insertMany(plantasIniciales);
    console.log(`✅ ${resultado.length} plantas insertadas exitosamente\n`);

    console.log('📋 PLANTAS INSERTADAS:');
    resultado.forEach((planta, index) => {
      console.log(`${index + 1}. ${planta.nombre_comun} (${planta.dificultad}) - ID: ${planta._id}`);
    });

    console.log('\n✅ PROCESO COMPLETADO');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

insertarPlantas();
const mongoose = require('mongoose');


const plantaSchema = new mongoose.Schema({
  nombre_comun: {
    type: String,
    required: true,
    trim: true
  },
  nombre_cientifico: {
    type: String,
    trim: true
  },
  dificultad: {
    type: String,
    enum: ['Principiante', 'Intermedio', 'Avanzado'],
    required: true
  },
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
  precio: {
    type: Number,
    min: 0
  },
  disponible: {
    type: Boolean,
    default: true
  },
  imagenes: [String],
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  ultima_actualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'plantas',
  timestamps: true
});

// Índices para búsquedas rápidas
plantaSchema.index({ nombre_comun: 1 });
plantaSchema.index({ dificultad: 1 });
plantaSchema.index({ disponible: 1 });
plantaSchema.index({ objetivos: 1 });

const PlantaModel = mongoose.model('Planta', plantaSchema);

// Métodos del modelo
const Planta = {
  // Obtener todas las plantas
  obtenerTodas: async () => {
    return await PlantaModel.find({ disponible: true }).sort({ nombre_comun: 1 });
  },

  // Obtener planta por ID
  obtenerPorId: async (id) => {
    return await PlantaModel.findById(id);
  },

  // Buscar plantas por criterios
  buscarPorCriterios: async (criterios) => {
    const filtro = { disponible: true };
    
    if (criterios.dificultad) {
      filtro.dificultad = criterios.dificultad;
    }
    
    if (criterios.luz) {
      filtro['requerimientos.luz'] = new RegExp(criterios.luz, 'i');
    }
    
    if (criterios.espacio) {
      filtro['requerimientos.espacio'] = new RegExp(criterios.espacio, 'i');
    }
    
    if (criterios.objetivos) {
      filtro.objetivos = { $in: criterios.objetivos };
    }
    
    return await PlantaModel.find(filtro).sort({ nombre_comun: 1 });
  },

  // Crear nueva planta
  crear: async (datosPlanta) => {
    const nuevaPlanta = new PlantaModel(datosPlanta);
    return await nuevaPlanta.save();
  },

  // Actualizar planta
  actualizar: async (id, datosActualizados) => {
    datosActualizados.ultima_actualizacion = new Date();
    return await PlantaModel.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    );
  },

  // Eliminar planta (soft delete)
  eliminar: async (id) => {
    return await PlantaModel.findByIdAndUpdate(
      id,
      { disponible: false, ultima_actualizacion: new Date() },
      { new: true }
    );
  },

  buscarPorNombre: async (nombre) => {
    return await PlantaModel.find({
      nombre_comun: new RegExp(nombre, 'i'),
      disponible: true
    });
  },

  obtenerPorDificultad: async (dificultad) => {
    return await PlantaModel.find({
      dificultad: dificultad,
      disponible: true
    }).sort({ nombre_comun: 1 });
  }
};

module.exports = Planta;
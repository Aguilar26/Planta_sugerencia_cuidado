import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:1250/api';

// Configuración global de axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// ============================================
// USUARIOS - CRUD Completo (Requisito 2.1)
// ============================================

export const usuariosAPI = {
  obtenerTodos: async () => {
    const response = await axios.get('/usuarios');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await axios.get(`/usuarios/${id}`);
    return response.data;
  },

  obtenerPorEmail: async (email) => {
    try {
      const response = await axios.get('/usuarios');
      const usuarios = response.data.datos || [];
      const usuario = usuarios.find(u => 
        (u.email_usuario === email || u.emailUsuario === email)
      );
      if (usuario) {
        return { exito: true, datos: usuario };
      }
      return { exito: false, mensaje: 'Usuario no encontrado' };
    } catch (error) {
      return { exito: false, mensaje: error.message };
    }
  },

  crear: async (usuario) => {
    const response = await axios.post('/usuarios', usuario);
    return response.data;
  },

  actualizar: async (id, usuario) => {
    const response = await axios.put(`/usuarios/${id}`, usuario);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await axios.delete(`/usuarios/${id}`);
    return response.data;
  }
};

// ============================================
// PLANTAS - CRUD Completo (Requisito 2.1)
// ============================================

// ============================================
// PLANTAS - CRUD Completo
// ============================================

export const plantasAPI = {
  obtenerTodas: async () => {
    const response = await axios.get('/plantas');
    return response.data;
  },

  obtenerPorId: async (id) => {
    const response = await axios.get(`/plantas/${id}`);
    return response.data;
  },

  buscarPorCriterios: async (criterios) => {
    const response = await axios.post('/plantas/buscar', criterios);
    return response.data;
  },

  crear: async (planta) => {
    console.log('📤 API enviando al backend:', planta);
    const response = await axios.post('/plantas', planta);
    console.log('📥 API respuesta del backend:', response.data);
    return response.data;
  },

  actualizar: async (id, planta) => {
    const response = await axios.put(`/plantas/${id}`, planta);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await axios.delete(`/plantas/${id}`);
    return response.data;
  }
};
// ============================================
// RECOMENDACIONES
// ============================================

export const recomendacionesAPI = {
  obtenerTodas: async () => {
    const response = await axios.get('/recomendaciones');
    return response.data;
  },

  obtenerPorUsuario: async (idUsuario) => {
    const response = await axios.get(`/recomendaciones/usuario/${idUsuario}`);
    return response.data;
  },

  crear: async (recomendacion) => {
    const response = await axios.post('/recomendaciones', recomendacion);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await axios.delete(`/recomendaciones/${id}`);
    return response.data;
  }
};

// ============================================
// ALERTAS
// ============================================

export const alertasAPI = {
  obtenerTodas: async () => {
    const response = await axios.get('/alertas');
    return response.data;
  },

  obtenerPorUsuario: async (idUsuario) => {
    const response = await axios.get(`/alertas/usuario/${idUsuario}`);
    return response.data;
  },

  crear: async (alerta) => {
    const response = await axios.post('/alertas', alerta);
    return response.data;
  },

  completar: async (id) => {
    const response = await axios.put(`/alertas/${id}/completar`);
    return response.data;
  },

  eliminar: async (id) => {
    const response = await axios.delete(`/alertas/${id}`);
    return response.data;
  }
};

// ============================================
// REPORTES Y ESTADÍSTICAS
// ============================================

export const reportesAPI = {
  obtenerEstadisticas: async () => {
    const response = await axios.get('/reportes/estadisticas');
    return response.data;
  },

  obtenerPlantasMasRecomendadas: async () => {
    const response = await axios.get('/reportes/plantas-mas-recomendadas');
    return response.data;
  },

  obtenerUsuariosActivos: async () => {
    const response = await axios.get('/reportes/usuarios-activos');
    return response.data;
  },

  obtenerAlertasProximas: async () => {
    const response = await axios.get('/reportes/alertas-proximas');
    return response.data;
  }
};

// ============================================
// MANEJO DE ERRORES GLOBAL
// ============================================

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('Error de respuesta:', error.response.data);
    } else if (error.request) {
      console.error('Error de red:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const apiServices = {
  usuariosAPI,
  plantasAPI,
  recomendacionesAPI,
  alertasAPI,
  reportesAPI
};

export default apiServices;
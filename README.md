# 🌱 Planta Cuidado - Sistema de Recomendación de Plantas

## 📋 Descripción del Proyecto

Sistema web completo de recomendación de plantas con panel administrativo. Los usuarios se registran, definen sus preferencias (experiencia, luz, espacio, presupuesto) y reciben recomendaciones personalizadas de plantas. Los administradores gestionan el catálogo, usuarios, alertas y reportes.

**Stack Tecnológico:**
- **Frontend:** React 18 + Axios + CSS personalizado
- **Backend:** Node.js + Express
- **Bases de Datos:** SQL Server (usuarios) + MongoDB (plantas)
- **Autenticación:** localStorage con roles (admin/usuario)

---

## 📦 Requisitos Previos

Antes de instalar, asegúrate de tener:

### Requerimientos del Sistema
- **Node.js:** v18.0 o superior ([descargar](https://nodejs.org/))
- **npm:** viene con Node.js (verificar: `npm -v`)
- **SQL Server:** Local o remoto conectado
- **MongoDB:** Local o Atlas ([crear cuenta gratuita](https://www.mongodb.com/cloud/atlas))

### Verificar Instalaciones
```bash
node --version      # Debe ser v18.0+
npm --version       # Debe ser 9.0+
```

---

## 🚀 Instalación Paso a Paso

### 1. Clonar/Descargar el Proyecto
```bash
# Si tienes Git
git clone <url-del-repositorio>
cd planta_cuidado_sugerencia

# Si descargaste ZIP, extrae y abre la carpeta en terminal
cd planta_cuidado_sugerencia
```

### 2. Instalar Dependencias (TODOS los módulos)
```bash
# Desde la raíz del proyecto
npm run install:all
```

**¿Qué hace?**
- Instala dependencias de la raíz
- Instala dependencias del backend (`backend/node_modules`)
- Instala dependencias del frontend (`frontend/node_modules`)

**Si falla** alguno, ejecuta manualmente:
```bash
# Backend
cd backend && npm install && cd ..

# Frontend
cd frontend && npm install && cd ..
```

---

## ⚙️ Configuración de Variables de Entorno

### Paso 1: Crear archivo `.env` en la carpeta `backend/`

```bash
# backend/.env
```

### Paso 2: Copiar y completar las siguientes variables

```env
# SQL SERVER (Usuarios, Alertas, Recomendaciones)
DB_SERVER=localhost
DB_USER=sa
DB_PASSWORD=tu_contraseña_sql
DB_NAME=planta_cuidado
DB_PORT=1433

# MONGODB (Plantas)
MONGODB_URI=mongodb://localhost:27017/plantas
# O si usas MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/plantas?retryWrites=true&w=majority

# Puertos
PORT_BACKEND=1250
NODE_ENV=development
```

### Paso 3: Verificar Conexiones

**Para SQL Server:**
```bash
# Abre SQL Server Management Studio y verifica que el servidor esté running
# Intenta conectarte con las credenciales del .env
```

**Para MongoDB (local):**
```bash
# Si instalaste MongoDB localmente, asegúrate que el servicio esté activo
# Windows: Services → MongoDB Server
# Mac/Linux: mongod en terminal
```

**Para MongoDB Atlas (nube):**
```bash
# Copia la connection string desde tu cluster de Atlas
# Formato: mongodb+srv://usuario:password@cluster.mongodb.net/database
```

---

## ▶️ Ejecutar el Proyecto

### Opción 1: Modo Recomendado (Backend + Frontend Simultáneo)
```bash
# Desde la RAÍZ del proyecto
npm start
```

Esto ejecuta:
- Backend en `http://localhost:1250`
- Frontend en `http://localhost:3000` (dev) o ya compilado en 1250

**Si todo funciona, deberías ver:**
```
✅ Conexión exitosa a SQL Server
📡 MongoDB conectado correctamente
✅ Aplicación completa corriendo en: http://localhost:1250
```

### Opción 2: Ejecutar por Separado (Mayor Control)

**Terminal 1 - Backend (desarrollo con nodemon):**
```bash
cd backend
npm run dev
# Esperado: "✅ Aplicación completa corriendo en: http://localhost:1250"
```

**Terminal 2 - Frontend (desarrollo con webpack):**
```bash
cd frontend
npm start
# Se abrirá en http://localhost:3000
```

### Opción 3: Modo Producción (compilado)
```bash
cd frontend
npm run build    # Genera carpeta 'build/'

cd ../backend
npm start        # Sirve el frontend compilado en /build
```

Accede a: `http://localhost:1250`

---

## 🔐 Credenciales de Prueba

### Admin (Acceso Completo)
```
Email/Usuario: admin
Contraseña: 123456789
```

**⚠️ IMPORTANTE:** Estas credenciales están HARDCODEADAS en `frontend/src/components/Login.jsx` línea 21.

**Para cambiar credenciales de admin:**

1. **Opción A - Cambiar en el código (desarrollo):**
   ```javascript
   // frontend/src/components/Login.jsx línea 21-24
   if (email === 'admin' && password === '123456789') {  // ← Cambiar aquí
   ```
   Cambiar a:
   ```javascript
   if (email === 'tu_email@admin.com' && password === 'tu_nueva_contraseña') {
   ```

2. **Opción B - Crear usuario admin en la BD (recomendado):**

   **Para SQL Server:**
   ```sql
   USE planta_cuidado;
   
   INSERT INTO usuarios (nombre_usuario, email_usuario, password_hash, experiencia, rol, activo)
   VALUES ('Administrador', 'admin@tuempresa.com', '123456789', 'Avanzado', 'admin', 1);
   ```

   **Para MongoDB:**
   ```javascript
   // Ejecutar en MongoDB Compass o mongosh:
   db.usuarios.insertOne({
     nombre_usuario: "Administrador",
     email_usuario: "admin@tuempresa.com",
     password_hash: "123456789",
     experiencia: "Avanzado",
     rol: "admin",
     activo: true
   });
   ```

3. **Después de cambiar, reconstruir:**
   ```bash
   cd frontend && npm run build
   ```

### Usuario Normal (Acceso Limitado)
```
Email: usuario_prueba@gmail.com
Contraseña: 123456789
```

**Permisos:**
- Completar preferencias (experiencia, luz, espacio, presupuesto, mascotas)
- Ver plantas recomendadas filtradas por preferencias
- Ver catálogo completo

**¿Cómo crear un usuario nuevo?**
1. Haz clic en "Regístrate" en el login
2. Completa nombre, email, contraseña
3. Se guardará en la BD automáticamente
4. Completa el formulario de preferencias
5. ¡Listo! Recibirás recomendaciones

---

## 🔧 Cómo el Sistema Reconoce al Admin

**Actualmente:**
- El admin está hardcodeado en `frontend/src/components/Login.jsx`
- Cuando detecta email=`admin` y password=`123456789`, automáticamente asigna rol `admin`

**En otra máquina con BD diferente:**
1. El admin DEFAULT sigue siendo `admin` / `123456789`
2. **Si quieres otro admin**, hay 2 opciones:

### Opción 1: Cambiar credenciales en el código
```javascript
// frontend/src/components/Login.jsx línea 21-24

// ANTES:
if (email === 'admin' && password === '123456789') {

// DESPUÉS:
if (email === 'mi_email@empresa.com' && password === 'mi_contraseña_segura') {
```

Luego reconstruir:
```bash
cd frontend && npm run build
cd ../backend && npm start
```

### Opción 2: Crear múltiples admins en la BD (mejor práctica)
Para el futuro, se podría:
1. Agregar columna `rol` a tabla `usuarios`
2. Cambiar Login.jsx para validar contra BD
3. Asignar rol `admin` al crear usuario

**Ejemplo de cómo sería:**
```javascript
// Login.jsx - futuro mejorado
const usuario = await usuariosAPI.obtenerPorEmail(email);
if (usuario && usuario.password_hash === password) {
  setRolUsuario(usuario.rol);  // ← Desde BD, no hardcodeado
}
```

---

## 📁 Estructura del Proyecto

```
planta_cuidado_sugerencia/
├── backend/                      # API Node.js + Express
│   ├── controllers/              # Lógica de plantas, usuarios, alertas
│   ├── models/                   # Esquemas Mongoose (plantas) y SQL (usuarios)
│   ├── routes/                   # Endpoints de la API
│   ├── config/                   # Conexiones a BD
│   ├── middlewares/              # Auth, validación, errores
│   ├── .env                      # Variables de entorno (crear manualmente)
│   ├── server.js                 # Entrada principal
│   └── package.json
│
├── frontend/                     # React app
│   ├── src/
│   │   ├── components/           # Componentes React
│   │   │   ├── Login.jsx         # Autenticación
│   │   │   ├── UserForm.jsx      # Formulario de usuarios
│   │   │   ├── PlantForm.jsx     # Formulario de plantas
│   │   │   ├── PlantList.jsx     # Catálogo de plantas
│   │   │   ├── PreferenciasFormulario.jsx  # Preferencias post-registro
│   │   │   ├── Recomendaciones.jsx         # Motor de recomendaciones
│   │   │   └── ... (otros componentes)
│   │   ├── services/
│   │   │   └── api.js            # Llamadas HTTP a backend
│   │   ├── styles/
│   │   │   └── styles.css        # Estilos globales
│   │   └── App.jsx               # Ruteo principal
│   ├── build/                    # Compilado (generado con npm run build)
│   ├── package.json
│   └── public/
│
├── package.json                  # Scripts para ejecutar todo
└── README.md                      # Este archivo
```

---

## 🔍 Troubleshooting - Solución de Problemas

### ❌ "Error: listen EADDRINUSE: address already in use :::1250"

**Problema:** El puerto 1250 ya está en uso.

**Solución 1 (Rápida):**
```bash
# Windows
netstat -aon | findstr :1250
taskkill /F /PID <PID>

# Mac/Linux
lsof -i :1250
kill -9 <PID>
```

**Solución 2:** Cambiar puerto en `backend/server.js` línea 13:
```javascript
const PUERTO = 1251;  // Cambiar a otro puerto
```

---

### ❌ "Error: connect ECONNREFUSED 127.0.0.1:1433"

**Problema:** SQL Server no está conectado.

**Verificar:**
1. Abre **SQL Server Management Studio**
2. Verifica que el servidor esté running (verde ✅)
3. Verifica credenciales en `.env`
4. Prueba la conexión en SSMS

**Si sigue fallando:**
- Verifica que el **SQL Server Service** esté activo en Services (Windows)
- Reinicia el servicio SQL Server
- Comprueba firewall (puerto 1433 abierto)

---

### ❌ "Error: connect ECONNREFUSED 127.0.0.1:27017"

**Problema:** MongoDB no está ejecutándose.

**Para MongoDB Local:**
```bash
# Windows
# Busca "Services" → "MongoDB Server" → verifica que esté "Running"

# Mac (si instalaste con Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Para MongoDB Atlas (nube):**
1. Verifica que la string en `.env` sea correcta
2. Verifica que tu IP esté en "Network Access" en Atlas
3. Verifica credenciales (usuario/password de Atlas)

---

### ❌ "Cannot find module 'react-scripts'"

**Problema:** Frontend dependencies no instaladas.

**Solución:**
```bash
cd frontend
npm install
npm run build
```

---

### ❌ "Login no funciona / credenciales rechazadas"

**Verificar:**
1. Abre DevTools (F12) → Console
2. Ejecuta: `localStorage.clear()`
3. Recarga página (Ctrl+Shift+R)
4. Intenta login con: `admin` / `123456789`

---

### ❌ "Las plantas no se filtran por preferencias"

**Verificar:**
1. Completa TODO el formulario de preferencias
2. Asegúrate de que hiciste clic en "Continuar a Recomendaciones"
3. Si aún falla, revisa la consola (F12) por errores
4. Verifica que las plantas estén en la BD (panel admin)

---

## 📡 Endpoints de la API (Backend)

### Autenticación (Frontend maneja esto)
- **POST** `/api/usuarios/crear` - Crear nuevo usuario
- **GET** `/api/usuarios` - Obtener todos los usuarios
- **GET** `/api/usuarios/:id` - Obtener usuario por ID

### Plantas
- **GET** `/api/plantas` - Obtener todas las plantas
- **POST** `/api/plantas` - Crear planta (admin)
- **PUT** `/api/plantas/:id` - Editar planta (admin)
- **DELETE** `/api/plantas/:id` - Eliminar planta (admin)

### Alertas
- **GET** `/api/alertas` - Obtener alertas
- **POST** `/api/alertas` - Crear alerta
- **PUT** `/api/alertas/:id` - Actualizar alerta

### Recomendaciones
- **GET** `/api/recomendaciones` - Obtener recomendaciones personalizadas

**Nota:** Los endpoints usan variables de entorno. No necesitas memorizar URLs; frontend los usa automáticamente.

---

## 🎯 Flujo de Uso Completo

### Para Usuario Normal:
1. Abre `http://localhost:1250`
2. Haz clic en "Regístrate"
3. Completa: nombre, email, contraseña
4. **Verá formulario de preferencias** automáticamente
5. Completa: experiencia, luz, espacio, presupuesto, mascotas
6. ✅ Verá **plantas recomendadas** filtradas

### Para Admin:
1. Abre `http://localhost:1250`
2. Login: `admin` / `123456789`
3. Acceso a:
   - 📊 **Estadísticas** - Números generales
   - 👥 **Usuarios** - Crear/editar/eliminar usuarios
   - 🌿 **Plantas** - Crear/editar/eliminar plantas (botón ➕ Nueva Planta)
   - 🔔 **Alertas** - Ver alertas de riego pendientes

---

## 🛠️ Comandos Útiles

```bash
# Instalar todas las dependencias
npm run install:all

# Ejecutar frontend + backend simultáneamente
npm start

# Build del frontend (genera carpeta 'build/')
cd frontend && npm run build

# Backend solo (desarrollo con nodemon)
cd backend && npm run dev

# Backend solo (modo producción)
cd backend && npm start

# Limpiar node_modules y reinstalar
rm -r node_modules backend/node_modules frontend/node_modules
npm run install:all
```

---

## 📝 Notas Importantes

✅ **Funcionalidades Implementadas:**
- Autenticación con roles (admin/usuario)
- Panel admin con CRUD completo
- Formulario de preferencias post-registro
- Motor de recomendaciones con filtros
- Persistencia en localStorage + BD
- Diferenciación clara de permisos

⚠️ **Limitaciones Actuales:**
- Contraseñas en TEXTO PLANO (usar bcrypt en producción)
- Sin JWT (usar en producción)
- localStorage solo (sin sincronización con BD)
- Sin reset de contraseña por email

📌 **Próximas Mejoras (Opcionales):**
- Guardar preferencias en BD
- Hash de contraseñas con bcrypt
- Autenticación JWT
- Notificaciones por email
- Exportar reportes en PDF
- Optimizar filtros de recomendaciones

---

## 🆘 ¿Sigue sin funcionar?

1. **Verifica los 3 requisitos críticos:**
   - ✅ Node.js instalado (`node -v`)
   - ✅ SQL Server conectado y activo
   - ✅ MongoDB conectado (local o Atlas)

2. **Limpia y reinstala:**
   ```bash
   rm -r node_modules backend/node_modules frontend/node_modules package-lock.json
   npm run install:all
   ```

3. **Revisa los logs:**
   - Consola del backend (terminal de Node)
   - Consola del navegador (F12)
   - DevTools → Console → busca errores rojos

4. **Reinicia todo:**
   ```bash
   taskkill /F /IM node.exe  # Windows
   npm start
   ```

---

## 📞 Soporte Técnico

Si tienes dudas sobre:
- **Instalación:** Verifica paso a paso la sección "Instalación"
- **Configuración:** Revisa "Configuración de Variables de Entorno"
- **Errores:** Consulta "Troubleshooting"
- **Cómo usar:** Mira "Flujo de Uso Completo"

**Credenciales de prueba siempre disponibles:**
- Admin: `admin` / `123456789`
- Usuario: Crea uno con email/contraseña cualquiera

---

## 📄 Licencia

MIT - Siéntete libre de usar, modificar y distribuir.

---

**Última actualización:** 4 Enero 2026  
**Versión:** 1.0.0 (MVP Completo)

🌱 **¡Disfruta cuidando plantas!**

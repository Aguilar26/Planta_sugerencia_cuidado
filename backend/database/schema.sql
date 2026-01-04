USE planta_cuidado_db;
GO

-- ============================================
-- TABLA: usuarios
-- ============================================
CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre_usuario NVARCHAR(100) NOT NULL,
    email_usuario NVARCHAR(150) NOT NULL UNIQUE,
    password_hash NVARCHAR(255) NOT NULL,
    experiencia NVARCHAR(50) CHECK (experiencia IN ('Principiante', 'Intermedio', 'Avanzado')),
    espacio_disponible NVARCHAR(50),
    condiciones_luz NVARCHAR(50),
    objetivos NVARCHAR(255),
    fecha_registro DATETIME DEFAULT GETDATE(),
    activo BIT DEFAULT 1,
    CONSTRAINT CK_email_formato CHECK (email_usuario LIKE '%@%.%')
);
GO

-- ============================================
-- TABLA: recomendaciones
-- AHORA guarda id_planta_mongo (string) en vez de FK
-- ============================================
CREATE TABLE recomendaciones (
    id_recomendacion INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_planta_mongo NVARCHAR(100) NOT NULL, -- ID de MongoDB
    nombre_planta NVARCHAR(100) NOT NULL, -- Para facilitar queries
    puntuacion INT CHECK (puntuacion BETWEEN 0 AND 100),
    razon_recomendacion NVARCHAR(500),
    fecha_recomendacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
GO

-- ============================================
-- TABLA: alertas
-- AHORA guarda id_planta_mongo (string) en vez de FK
-- ============================================
CREATE TABLE alertas (
    id_alerta INT IDENTITY(1,1) PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_planta_mongo NVARCHAR(100) NOT NULL, -- ID de MongoDB
    nombre_planta NVARCHAR(100) NOT NULL, -- Para facilitar queries
    tipo_alerta NVARCHAR(50) CHECK (tipo_alerta IN ('Riego', 'Poda', 'Fertilizante', 'Otro')),
    fecha_alerta DATETIME NOT NULL,
    completada BIT DEFAULT 0,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    fecha_completado DATETIME NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT CK_fecha_alerta_futura CHECK (fecha_alerta >= fecha_creacion)
);
GO

-- ============================================
-- TABLA: auditoria
-- ============================================
CREATE TABLE auditoria (
    id_auditoria INT IDENTITY(1,1) PRIMARY KEY,
    tabla_afectada NVARCHAR(50) NOT NULL,
    operacion NVARCHAR(20) CHECK (operacion IN ('INSERT', 'UPDATE', 'DELETE')),
    id_registro INT,
    usuario_bd NVARCHAR(100) DEFAULT SYSTEM_USER,
    fecha_operacion DATETIME DEFAULT GETDATE(),
    datos_anteriores NVARCHAR(MAX),
    datos_nuevos NVARCHAR(MAX),
    ip_cliente NVARCHAR(50)
);
GO

-- ============================================
-- ÍNDICES
-- ============================================
CREATE INDEX IX_usuarios_email ON usuarios(email_usuario);
CREATE INDEX IX_recomendaciones_usuario ON recomendaciones(id_usuario);
CREATE INDEX IX_recomendaciones_planta_mongo ON recomendaciones(id_planta_mongo);
CREATE INDEX IX_alertas_usuario ON alertas(id_usuario);
CREATE INDEX IX_alertas_planta_mongo ON alertas(id_planta_mongo);
CREATE INDEX IX_alertas_completada ON alertas(completada);
CREATE INDEX IX_auditoria_fecha ON auditoria(fecha_operacion);
GO
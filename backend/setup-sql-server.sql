-- ============================================
-- SCRIPT COMPLETO PARA CONFIGURAR SQL SERVER
-- PEGA ESTO EN SQL SERVER MANAGEMENT STUDIO
-- ============================================

USE master;
GO

-- 1. CREAR BASE DE DATOS SI NO EXISTE
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'planta_cuidado_db')
BEGIN
    CREATE DATABASE planta_cuidado_db;
    PRINT '✅ Base de datos "planta_cuidado_db" creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️  Base de datos "planta_cuidado_db" ya existe';
END
GO

-- 2. CREAR LOGIN A NIVEL DE SERVIDOR
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'planta_user')
BEGIN
    CREATE LOGIN planta_user WITH PASSWORD = 'Planta2024!';
    PRINT '✅ Login "planta_user" creado exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️  Login "planta_user" ya existe';
    ALTER LOGIN planta_user WITH PASSWORD = 'Planta2024!';
    PRINT '✅ Contraseña de "planta_user" actualizada';
END
GO

-- 3. CAMBIAR A LA BASE DE DATOS ESPECÍFICA
USE planta_cuidado_db;
GO

-- 4. CREAR USUARIO EN LA BASE DE DATOS
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'planta_user')
BEGIN
    CREATE USER planta_user FOR LOGIN planta_user;
    PRINT '✅ Usuario "planta_user" creado en la base de datos';
END
ELSE
BEGIN
    PRINT '⚠️  Usuario "planta_user" ya existe en la base de datos';
END
GO

-- 5. OTORGAR PERMISOS CRUD
GRANT SELECT, INSERT, UPDATE, DELETE ON SCHEMA::dbo TO planta_user;
GRANT EXECUTE ON SCHEMA::dbo TO planta_user;
GRANT VIEW DEFINITION ON SCHEMA::dbo TO planta_user;
PRINT '✅ Permisos CRUD otorgados correctamente';
GO

-- 6. CREAR TABLAS BÁSICAS
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'plantas')
BEGIN
    CREATE TABLE plantas (
        id_planta INT PRIMARY KEY IDENTITY(1,1),
        nombre_planta VARCHAR(100) NOT NULL,
        nombre_cientifico VARCHAR(100),
        dificultad VARCHAR(50),
        espacio_requerido VARCHAR(50),
        nivel_luz VARCHAR(100),
        frecuencia_riego VARCHAR(100),
        descripcion TEXT,
        cuidados_riego TEXT,
        cuidados_luz TEXT,
        temperatura VARCHAR(50),
        humedad VARCHAR(50),
        toxicidad VARCHAR(50),
        precio_planta DECIMAL(10,2),
        disponible BIT DEFAULT 1,
        fecha_creacion DATETIME DEFAULT GETDATE()
    );
    PRINT '✅ Tabla "plantas" creada exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️  Tabla "plantas" ya existe';
END
GO

-- 7. VERIFICACIÓN FINAL
PRINT '';
PRINT '═══════════════════════════════════════════';
PRINT '✅ CONFIGURACIÓN COMPLETADA EXITOSAMENTE';
PRINT '═══════════════════════════════════════════';
PRINT '';
PRINT '📝 CREDENCIALES PARA LA APLICACIÓN:';
PRINT '   Servidor: localhost';
PRINT '   Base de datos: planta_cuidado_db';
PRINT '   Usuario: planta_user';
PRINT '   Contraseña: Planta2024!';
PRINT '   Puerto: 1433';
PRINT '';
PRINT '✅ La aplicación Node.js ya puede conectarse';
PRINT '';
GO

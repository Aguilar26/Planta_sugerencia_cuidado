USE planta_cuidado_db;
GO

-- ============================================
-- INSERTAR USUARIOS DE PRUEBA
-- ============================================
INSERT INTO usuarios (nombre_usuario, email_usuario, password_hash, experiencia, espacio_disponible, condiciones_luz, objetivos) VALUES
('Juan Pérez', 'juan@email.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Principiante', 'Balcón pequeño', 'Luz indirecta', 'Decoración'),
('María García', 'maria@email.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Intermedio', 'Jardín mediano', 'Mucha luz', 'Purificación del aire'),
('Carlos López', 'carlos@email.com', '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890', 'Avanzado', 'Huerto grande', 'Sol directo', 'Cultivo comestible');
GO

-- ============================================
-- INSERTAR RECOMENDACIONES DE PRUEBA
-- Nota: Los id_planta_mongo serán IDs reales de MongoDB después
-- ============================================
INSERT INTO recomendaciones (id_usuario, id_planta_mongo, nombre_planta, puntuacion, razon_recomendacion) VALUES
(1, 'mongo_id_pothos', 'Pothos', 95, 'Perfecta para principiantes, requiere poca luz'),
(1, 'mongo_id_sansevieria', 'Sansevieria', 90, 'Muy resistente, ideal para espacios pequeños'),
(2, 'mongo_id_monstera', 'Monstera', 85, 'Excelente purificadora de aire'),
(2, 'mongo_id_ficus', 'Ficus', 80, 'Requiere luz indirecta abundante'),
(3, 'mongo_id_tomate', 'Tomate', 95, 'Excelente para cultivo comestible'),
(3, 'mongo_id_albahaca', 'Albahaca', 90, 'Fácil de cultivar en huertos');
GO

-- ============================================
-- INSERTAR ALERTAS DE PRUEBA
-- ============================================
INSERT INTO alertas (id_usuario, id_planta_mongo, nombre_planta, tipo_alerta, fecha_alerta, completada) VALUES
(1, 'mongo_id_pothos', 'Pothos', 'Riego', DATEADD(day, 2, GETDATE()), 0),
(1, 'mongo_id_sansevieria', 'Sansevieria', 'Poda', DATEADD(day, 7, GETDATE()), 0),
(2, 'mongo_id_monstera', 'Monstera', 'Riego', DATEADD(day, 3, GETDATE()), 0),
(2, 'mongo_id_ficus', 'Ficus', 'Fertilizante', DATEADD(day, 10, GETDATE()), 0),
(3, 'mongo_id_tomate', 'Tomate', 'Riego', DATEADD(day, 1, GETDATE()), 0),
(3, 'mongo_id_albahaca', 'Albahaca', 'Poda', DATEADD(day, 5, GETDATE()), 0);
GO

PRINT '✅ Datos de prueba insertados correctamente';
PRINT '📝 Usuarios: 3';
PRINT '📝 Recomendaciones: 6';
PRINT '📝 Alertas: 6';
GO
USE planta_cuidado_db;
GO

CREATE VIEW vw_plantas_mas_recomendadas AS
SELECT 
    p.id_planta,
    p.nombre_planta,
    p.nombre_cientifico,
    p.dificultad,
    p.precio_planta,
    COUNT(r.id_recomendacion) AS total_recomendaciones,
    AVG(CAST(r.puntuacion AS FLOAT)) AS puntuacion_promedio,
    MAX(r.fecha_recomendacion) AS ultima_recomendacion
FROM plantas p
LEFT JOIN recomendaciones r ON p.id_planta = r.id_planta
GROUP BY 
    p.id_planta, 
    p.nombre_planta, 
    p.nombre_cientifico, 
    p.dificultad, 
    p.precio_planta;
GO

CREATE VIEW vw_usuarios_activos AS
SELECT 
    u.id_usuario,
    u.nombre_usuario,
    u.email_usuario,
    u.experiencia,
    u.fecha_registro,
    COUNT(DISTINCT r.id_recomendacion) AS total_recomendaciones,
    COUNT(DISTINCT a.id_alerta) AS total_alertas,
    COUNT(DISTINCT CASE WHEN a.completada = 0 THEN a.id_alerta END) AS alertas_pendientes,
    DATEDIFF(DAY, u.fecha_registro, GETDATE()) AS dias_desde_registro
FROM usuarios u
LEFT JOIN recomendaciones r ON u.id_usuario = r.id_usuario
LEFT JOIN alertas a ON u.id_usuario = a.id_usuario
WHERE u.activo = 1
GROUP BY 
    u.id_usuario,
    u.nombre_usuario,
    u.email_usuario,
    u.experiencia,
    u.fecha_registro;
GO

CREATE VIEW vw_estadisticas_generales AS
SELECT 
    (SELECT COUNT(*) FROM plantas) AS total_plantas,
    (SELECT COUNT(*) FROM plantas WHERE disponible = 1) AS plantas_disponibles,
    (SELECT COUNT(*) FROM plantas WHERE disponible = 0) AS plantas_no_disponibles,
    (SELECT SUM(precio_planta) FROM plantas) AS valor_total_inventario,
    (SELECT AVG(precio_planta) FROM plantas) AS precio_promedio,
    (SELECT COUNT(*) FROM usuarios WHERE activo = 1) AS usuarios_activos,
    (SELECT COUNT(*) FROM recomendaciones) AS total_recomendaciones,
    (SELECT COUNT(*) FROM alertas WHERE completada = 0) AS alertas_pendientes,
    (SELECT COUNT(*) FROM alertas WHERE completada = 1) AS alertas_completadas;
GO

CREATE VIEW vw_plantas_por_dificultad AS
SELECT 
    p.dificultad,
    COUNT(p.id_planta) AS cantidad_plantas,
    AVG(p.precio_planta) AS precio_promedio,
    MIN(p.precio_planta) AS precio_minimo,
    MAX(p.precio_planta) AS precio_maximo,
    SUM(CASE WHEN p.disponible = 1 THEN 1 ELSE 0 END) AS disponibles,
    COUNT(r.id_recomendacion) AS total_recomendaciones
FROM plantas p
LEFT JOIN recomendaciones r ON p.id_planta = r.id_planta
GROUP BY p.dificultad;
GO

CREATE VIEW vw_alertas_proximas AS
SELECT 
    a.id_alerta,
    a.tipo_alerta,
    a.fecha_alerta,
    a.completada,
    u.nombre_usuario,
    u.email_usuario,
    p.nombre_planta,
    p.nombre_cientifico,
    DATEDIFF(DAY, GETDATE(), a.fecha_alerta) AS dias_restantes
FROM alertas a
INNER JOIN usuarios u ON a.id_usuario = u.id_usuario
INNER JOIN plantas p ON a.id_planta = p.id_planta
WHERE a.completada = 0 
  AND a.fecha_alerta >= GETDATE()
  AND DATEDIFF(DAY, GETDATE(), a.fecha_alerta) <= 7;
GO

CREATE VIEW vw_auditoria_reciente AS
SELECT 
    au.id_auditoria,
    au.tabla_afectada,
    au.operacion,
    au.id_registro,
    au.usuario_bd,
    au.fecha_operacion,
    au.datos_anteriores,
    au.datos_nuevos,
    DATEDIFF(HOUR, au.fecha_operacion, GETDATE()) AS horas_desde_operacion
FROM auditoria au
WHERE au.fecha_operacion >= DATEADD(DAY, -30, GETDATE());
GO

CREATE VIEW vw_recomendaciones_detalladas AS
SELECT 
    r.id_recomendacion,
    r.fecha_recomendacion,
    r.puntuacion,
    r.razon_recomendacion,
    u.nombre_usuario,
    u.email_usuario,
    u.experiencia AS experiencia_usuario,
    p.nombre_planta,
    p.nombre_cientifico,
    p.dificultad AS dificultad_planta,
    p.precio_planta,
    p.disponible
FROM recomendaciones r
INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
INNER JOIN plantas p ON r.id_planta = p.id_planta;
GO
USE planta_cuidado_db;
GO

CREATE TRIGGER trg_auditoria_plantas_insert
ON plantas
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_nuevos)
    SELECT 
        'plantas',
        'INSERT',
        i.id_planta,
        CONCAT(
            'nombre_planta: ', i.nombre_planta, 
            ', dificultad: ', i.dificultad,
            ', precio_planta: ', i.precio_planta,
            ', disponible: ', i.disponible
        )
    FROM inserted i;
END;
GO

CREATE TRIGGER trg_auditoria_plantas_update
ON plantas
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    SELECT 
        'plantas',
        'UPDATE',
        i.id_planta,
        CONCAT(
            'nombre_planta: ', d.nombre_planta,
            ', dificultad: ', d.dificultad,
            ', precio_planta: ', d.precio_planta,
            ', disponible: ', d.disponible
        ),
        CONCAT(
            'nombre_planta: ', i.nombre_planta,
            ', dificultad: ', i.dificultad,
            ', precio_planta: ', i.precio_planta,
            ', disponible: ', i.disponible
        )
    FROM inserted i
    INNER JOIN deleted d ON i.id_planta = d.id_planta;
END;
GO

CREATE TRIGGER trg_auditoria_plantas_delete
ON plantas
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores)
    SELECT 
        'plantas',
        'DELETE',
        d.id_planta,
        CONCAT(
            'nombre_planta: ', d.nombre_planta,
            ', dificultad: ', d.dificultad,
            ', precio_planta: ', d.precio_planta
        )
    FROM deleted d;
END;
GO

CREATE TRIGGER trg_auditoria_usuarios_insert
ON usuarios
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_nuevos)
    SELECT 
        'usuarios',
        'INSERT',
        i.id_usuario,
        CONCAT(
            'nombre_usuario: ', i.nombre_usuario,
            ', email_usuario: ', i.email_usuario,
            ', experiencia: ', i.experiencia
        )
    FROM inserted i;
END;
GO

CREATE TRIGGER trg_auditoria_usuarios_update
ON usuarios
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores, datos_nuevos)
    SELECT 
        'usuarios',
        'UPDATE',
        i.id_usuario,
        CONCAT(
            'nombre_usuario: ', d.nombre_usuario,
            ', email_usuario: ', d.email_usuario,
            ', experiencia: ', d.experiencia
        ),
        CONCAT(
            'nombre_usuario: ', i.nombre_usuario,
            ', email_usuario: ', i.email_usuario,
            ', experiencia: ', i.experiencia
        )
    FROM inserted i
    INNER JOIN deleted d ON i.id_usuario = d.id_usuario;
END;
GO

CREATE TRIGGER trg_auditoria_usuarios_delete
ON usuarios
AFTER DELETE
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO auditoria (tabla_afectada, operacion, id_registro, datos_anteriores)
    SELECT 
        'usuarios',
        'DELETE',
        d.id_usuario,
        CONCAT(
            'nombre_usuario: ', d.nombre_usuario,
            ', email_usuario: ', d.email_usuario
        )
    FROM deleted d;
END;
GO

CREATE TRIGGER trg_actualizar_fecha_completado_alerta
ON alertas
AFTER UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE a
    SET fecha_completado = GETDATE()
    FROM alertas a
    INNER JOIN inserted i ON a.id_alerta = i.id_alerta
    WHERE i.completada = 1 AND a.fecha_completado IS NULL;
END;
GO
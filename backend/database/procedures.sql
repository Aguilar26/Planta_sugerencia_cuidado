USE planta_cuidado_db;
GO

CREATE PROCEDURE sp_crear_planta
    @nombre_planta NVARCHAR(100),
    @nombre_cientifico NVARCHAR(150),
    @dificultad NVARCHAR(50),
    @espacio_requerido NVARCHAR(50),
    @nivel_luz NVARCHAR(50),
    @frecuencia_riego INT,
    @descripcion NVARCHAR(MAX),
    @cuidados_riego NVARCHAR(500),
    @cuidados_luz NVARCHAR(500),
    @temperatura NVARCHAR(50),
    @humedad NVARCHAR(50),
    @toxicidad NVARCHAR(100),
    @precio_planta DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        IF @precio_planta < 0
        BEGIN
            RAISERROR('El precio no puede ser negativo', 16, 1);
            RETURN;
        END
        
        IF @frecuencia_riego <= 0
        BEGIN
            RAISERROR('La frecuencia de riego debe ser mayor a 0', 16, 1);
            RETURN;
        END
        
        IF LEN(TRIM(@nombre_planta)) = 0
        BEGIN
            RAISERROR('El nombre de la planta no puede estar vacío', 16, 1);
            RETURN;
        END
        
        INSERT INTO plantas (
            nombre_planta, nombre_cientifico, dificultad, espacio_requerido,
            nivel_luz, frecuencia_riego, descripcion, cuidados_riego,
            cuidados_luz, temperatura, humedad, toxicidad, precio_planta
        )
        VALUES (
            @nombre_planta, @nombre_cientifico, @dificultad, @espacio_requerido,
            @nivel_luz, @frecuencia_riego, @descripcion, @cuidados_riego,
            @cuidados_luz, @temperatura, @humedad, @toxicidad, @precio_planta
        );
        
        COMMIT TRANSACTION;
        SELECT SCOPE_IDENTITY() AS id_planta;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE sp_actualizar_planta
    @id_planta INT,
    @nombre_planta NVARCHAR(100),
    @precio_planta DECIMAL(10,2),
    @disponible BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM plantas WHERE id_planta = @id_planta)
        BEGIN
            RAISERROR('La planta no existe', 16, 1);
            RETURN;
        END
        
        IF @precio_planta < 0
        BEGIN
            RAISERROR('El precio no puede ser negativo', 16, 1);
            RETURN;
        END
        
        UPDATE plantas
        SET nombre_planta = @nombre_planta,
            precio_planta = @precio_planta,
            disponible = @disponible
        WHERE id_planta = @id_planta;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE sp_eliminar_planta
    @id_planta INT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM plantas WHERE id_planta = @id_planta)
        BEGIN
            RAISERROR('La planta no existe', 16, 1);
            RETURN;
        END
        
        DELETE FROM plantas WHERE id_planta = @id_planta;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE sp_crear_usuario
    @nombre_usuario NVARCHAR(100),
    @email_usuario NVARCHAR(150),
    @password_hash NVARCHAR(255),
    @experiencia NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        IF EXISTS (SELECT 1 FROM usuarios WHERE email_usuario = @email_usuario)
        BEGIN
            RAISERROR('El email ya está registrado', 16, 1);
            RETURN;
        END
        
        IF @email_usuario NOT LIKE '%@%.%'
        BEGIN
            RAISERROR('Formato de email inválido', 16, 1);
            RETURN;
        END
        
        INSERT INTO usuarios (nombre_usuario, email_usuario, password_hash, experiencia)
        VALUES (@nombre_usuario, @email_usuario, @password_hash, @experiencia);
        
        COMMIT TRANSACTION;
        SELECT SCOPE_IDENTITY() AS id_usuario;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE sp_crear_recomendacion
    @id_usuario INT,
    @id_planta INT,
    @puntuacion INT,
    @razon_recomendacion NVARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = @id_usuario)
        BEGIN
            RAISERROR('El usuario no existe', 16, 1);
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM plantas WHERE id_planta = @id_planta)
        BEGIN
            RAISERROR('La planta no existe', 16, 1);
            RETURN;
        END
        
        IF @puntuacion < 0 OR @puntuacion > 100
        BEGIN
            RAISERROR('La puntuación debe estar entre 0 y 100', 16, 1);
            RETURN;
        END
        
        INSERT INTO recomendaciones (id_usuario, id_planta, puntuacion, razon_recomendacion)
        VALUES (@id_usuario, @id_planta, @puntuacion, @razon_recomendacion);
        
        COMMIT TRANSACTION;
        SELECT SCOPE_IDENTITY() AS id_recomendacion;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

CREATE PROCEDURE sp_crear_alerta
    @id_usuario INT,
    @id_planta INT,
    @tipo_alerta NVARCHAR(50),
    @fecha_alerta DATETIME
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRANSACTION;
    
    BEGIN TRY
        IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id_usuario = @id_usuario)
        BEGIN
            RAISERROR('El usuario no existe', 16, 1);
            RETURN;
        END
        
        IF NOT EXISTS (SELECT 1 FROM plantas WHERE id_planta = @id_planta)
        BEGIN
            RAISERROR('La planta no existe', 16, 1);
            RETURN;
        END
        
        IF @fecha_alerta < GETDATE()
        BEGIN
            RAISERROR('La fecha de alerta debe ser futura', 16, 1);
            RETURN;
        END
        
        INSERT INTO alertas (id_usuario, id_planta, tipo_alerta, fecha_alerta)
        VALUES (@id_usuario, @id_planta, @tipo_alerta, @fecha_alerta);
        
        COMMIT TRANSACTION;
        SELECT SCOPE_IDENTITY() AS id_alerta;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO
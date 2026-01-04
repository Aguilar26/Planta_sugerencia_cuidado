@echo off
REM Habilitar TCP/IP en SQL Server
REM Este script debe ejecutarse como Administrador

echo Habilitando TCP/IP en SQL Server...

reg add "HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQLServer\SuperSocketNetLib\Tcp" /v Enabled /t REG_DWORD /d 1 /f

if %ERRORLEVEL% EQU 0 (
    echo ✅ TCP/IP habilitado exitosamente
    echo.
    echo Reiniciando servicio SQL Server...
    net stop "SQL Server (MSSQLSERVER)" /y
    timeout /t 3 /nobreak
    net start "SQL Server (MSSQLSERVER)"
    timeout /t 3 /nobreak
    echo ✅ Servicio reiniciado
) else (
    echo ❌ Error al habilitar TCP/IP. Ejecuta este script como Administrador.
    pause
)

pause

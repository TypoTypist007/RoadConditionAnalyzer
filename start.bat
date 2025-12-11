@echo off
REM Road Condition Analyzer - Quick Start Script for Windows
REM This script helps Windows users get started quickly

setlocal enabledelayedexpansion

echo.
echo ===================================================
echo   🚗 Road Condition Analyzer - Quick Start Setup
echo ===================================================
echo.

REM Check if Docker is installed
echo [INFO] Checking Docker installation...

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop.
    pause
    exit /b 1
)

where docker-compose >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose v2.
    pause
    exit /b 1
)

echo [SUCCESS] Docker and Docker Compose are installed

REM Check if ports are available
echo [INFO] Checking if required ports are available...

set PORTS=80 5432 6379 9000 9001
set CONFLICTS=

for %%p in (%PORTS%) do (
    netstat -an | find "%%p" | find "LISTENING" >nul
    if !errorlevel! equ 0 (
        set CONFLICTS=!CONFLICTS! %%p
    )
)

if defined CONFLICTS (
    echo [WARNING] The following ports are in use: %CONFLICTS%
    echo You may need to stop other services or modify docker-compose.yml
    echo Press Enter to continue anyway, or close this window to exit...
    pause >nul
) else (
    echo [SUCCESS] All required ports are available
)

REM Start the application
echo.
echo [INFO] Starting Road Condition Analyzer...
echo.
echo This will start:
echo   • Frontend (React + Vite) on http://localhost
echo   • Backend (FastAPI) on http://localhost:8000
echo   • Worker (Celery) for background tasks
echo   • PostgreSQL database
echo   • Redis cache
echo   • MinIO file storage on http://localhost:9000
echo   • Nginx reverse proxy
echo.
echo The first startup may take a few minutes to build containers...
echo Press Enter to continue or close this window to cancel...
pause >nul

docker compose up --build

REM Show completion message (this will only show if docker compose starts successfully)
echo.
echo [SUCCESS] Road Condition Analyzer is now running!
echo.
echo Access the application:
echo   🌐 Web Interface: http://localhost
echo   📚 API Docs: http://localhost/docs
echo   💾 File Storage: http://localhost:9001 (minioadmin/minioadmin)
echo.
echo To stop the application:
echo   docker compose down
echo.
echo To view logs:
echo   docker compose logs -f
echo.
pause
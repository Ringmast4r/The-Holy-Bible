@echo off
REM Bible Visualizer Desktop - Windows Launcher
REM Double-click this file to run the application

echo.
echo ======================================
echo  Bible Cross-Reference Visualizer
echo  Desktop Application
echo ======================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
echo Checking dependencies...
python -c "import PyQt5" >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing dependencies...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
)

echo.
echo [OK] Starting Bible Visualizer...
echo.

REM Launch application
python visualizer_app.py

REM If application crashed, show error
if errorlevel 1 (
    echo.
    echo [ERROR] Application exited with error code %errorlevel%
    echo.
    pause
)

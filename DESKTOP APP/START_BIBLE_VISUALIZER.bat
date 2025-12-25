@echo off
::=================================================================
:: Bible Cross-Reference Visualizer - Desktop GUI Launcher
:: Created by @Ringmast4r
:: Checks dependencies and launches the PyQt5 application
::=================================================================

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║   Bible Cross-Reference Visualizer - Desktop GUI              ║
echo ║   Created by @Ringmast4r                                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

:: Check if Python is installed
echo [1/3] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo.
    echo Please install Python 3.8+ from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    pause
    exit /b 1
)
echo [OK] Python found

:: Check if required packages are installed
echo [2/3] Checking dependencies...
python -c "import PyQt5" >nul 2>&1
if errorlevel 1 (
    echo [WARN] PyQt5 not found - Installing dependencies...
    echo.
    echo Installing required packages (this may take a few minutes)...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo [OK] All dependencies installed
)

:: Check if data files exist
echo [3/3] Checking data files...
if not exist "..\shared-data\processed\graph_data.json" (
    echo [ERROR] Data files not found!
    echo.
    echo Expected location: ..\shared-data\processed\graph_data.json
    echo.
    echo Please ensure the shared-data folder is in the parent directory
    pause
    exit /b 1
)
echo [OK] Data files found

:: Launch the application
echo.
echo ✓ All checks passed! Launching Bible Visualizer...
echo.
python visualizer_app.py

:: If the application crashes, show error
if errorlevel 1 (
    echo.
    echo [ERROR] Application crashed
    echo.
    pause
)

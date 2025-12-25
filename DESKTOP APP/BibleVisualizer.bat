@echo off
title Bible Visualizer - Desktop GUI
echo.
echo ========================================
echo   Bible Cross-Reference Visualizer
echo   Desktop GUI - Loading...
echo ========================================
echo.

cd /d "%~dp0"
python visualizer_app.py

if errorlevel 1 (
    echo.
    echo ERROR: Failed to launch!
    echo Make sure Python is installed and requirements are met.
    echo.
    pause
)

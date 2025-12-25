@echo off
REM ===================================================
REM Bible CMD Reader Launcher
REM Ensures proper UTF-8 encoding for box characters
REM ===================================================

REM Set window title
title Bible Analysis Tool

REM Set UTF-8 code page (CP 65001) for proper Unicode display
chcp 65001 >nul 2>&1

REM Set console to use TrueType font (better Unicode support)
REM This registry setting helps but requires admin rights
REM reg add "HKCU\Console" /v FaceName /t REG_SZ /d "Consolas" /f >nul 2>&1

REM Navigate to the script directory
cd /d "%~dp0"

REM Clear screen for clean display
cls

REM Run Bible Reader
python bible_reader.py

REM Keep window open if there's an error
if errorlevel 1 (
    echo.
    echo An error occurred. Press any key to exit...
    pause >nul
)

@echo off
REM Set UTF-8 encoding for proper box drawing characters
chcp 65001 >nul 2>&1

REM Navigate to script directory
cd /d "%~dp0"

REM Run Bible Reader
python bible_reader.py

pause

@echo off
REM Bible Web Visualizer - Local Server Launcher
REM This script starts a local HTTP server to view visualizations

echo.
echo ==========================================
echo  Bible Web Visualizer - Server Launcher
echo ==========================================
echo.
echo Starting local web server...
echo.
echo [INFO] Server will run at: http://localhost:8000
echo [INFO] Opening browser automatically...
echo.
echo Press Ctrl+C to stop the server when done.
echo.

REM Start Python HTTP server and open browser
start http://localhost:8000/index.html
python -m http.server 8000

pause

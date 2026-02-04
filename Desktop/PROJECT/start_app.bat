@echo off
setlocal
cd /d "%~dp0"

echo ==================================================
echo   Starting YellowShield System...
echo ==================================================

:: Check if Node Modules exist
if not exist "server\node_modules" (
    echo [!] Server node_modules missing. Installing...
    cd server && call npm install && cd ..
)
if not exist "client\node_modules" (
    echo [!] Client node_modules missing. Installing...
    cd client && call npm install && cd ..
)

:: Start Server (Backend)
echo [+] Starting Backend Server...
start "YellowShield Backend" /D "server" cmd /k "npm run dev"

:: Start Client (Frontend)
echo [+] Starting Frontend Client...
start "YellowShield Frontend" /D "client" cmd /k "npm run dev"

echo.
echo Waiting 5 seconds for services to initialize...
timeout /t 5 >nul

echo.
echo [+] Opening Application...
start http://localhost:5173

echo.
echo ==================================================
echo   YellowShield is Live!
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:5000
echo ==================================================
echo   Do not close the popup windows.
pause

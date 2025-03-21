@echo off
echo Starting Stock Prophet development server...

:: Change to the directory containing this batch file
cd /d "%~dp0"

:: Check if node_modules exists, if not run npm install
if not exist node_modules (
    echo Node modules not found. Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error installing dependencies. Please check the output above.
        pause
        exit /b 1
    )
)

:: Start the development server
echo Starting Next.js development server...
call npm run dev

:: This will only execute if the npm command exits
echo Server stopped.
pause 
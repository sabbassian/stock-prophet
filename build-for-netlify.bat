@echo off
echo Building Stock Prophet for Netlify deployment...
echo.

:: Change to the project directory
cd /d "%~dp0"

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed or not in the PATH.
    echo Please install Node.js from https://nodejs.org/ and try again.
    pause
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed or not in the PATH.
    echo Please check your Node.js installation.
    pause
    exit /b 1
)

:: Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install dependencies.
        pause
        exit /b 1
    )
    echo Dependencies installed successfully.
    echo.
)

:: Run the build command
echo Building the application...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo Build failed.
    pause
    exit /b 1
)
echo Build completed successfully.
echo.

echo Build for Netlify completed!
echo The application is now ready for deployment to Netlify.
echo.
echo You can deploy to Netlify by:
echo 1. Pushing your code to GitHub and connecting Netlify to your repository.
echo 2. Configuring Netlify to use the @netlify/plugin-nextjs plugin.
echo.
echo For more information, see the GITHUB.md file.
pause 
@echo off
echo Opening Stock Prophet launcher in your default browser...

:: Get the absolute path to the index.html file
set "HTML_FILE=%~dp0index.html"

:: Open the HTML file in the default browser
start "" "%HTML_FILE%"

:: Also start the server in the background
cd /d "%~dp0"
start /B cmd /c "call start-app.bat"

echo Stock Prophet launcher opened in your browser.
echo The application server is starting in the background.
echo.
echo You can close this window. 
@echo off
echo Creating desktop shortcut for Stock Prophet...

:: Get the absolute paths
set "CURRENT_DIR=%~dp0"
set "CURRENT_DIR=%CURRENT_DIR:~0,-1%"
set "START_SCRIPT=%CURRENT_DIR%\start-app.bat"
set "DESKTOP_PATH=%USERPROFILE%\Desktop"

echo Current directory: %CURRENT_DIR%
echo Start script path: %START_SCRIPT%
echo Desktop path: %DESKTOP_PATH%

:: Create the shortcut using PowerShell with explicit absolute paths
powershell -ExecutionPolicy Bypass -Command ^
"$WshShell = New-Object -ComObject WScript.Shell; ^
$Shortcut = $WshShell.CreateShortcut('%DESKTOP_PATH%\Stock Prophet.lnk'); ^
$Shortcut.TargetPath = '%START_SCRIPT%'; ^
$Shortcut.IconLocation = 'C:\Windows\System32\shell32.dll,23'; ^
$Shortcut.Description = 'Launch Stock Prophet App'; ^
$Shortcut.WorkingDirectory = '%CURRENT_DIR%'; ^
$Shortcut.Save()"

if exist "%DESKTOP_PATH%\Stock Prophet.lnk" (
    echo Desktop shortcut created successfully!
    echo You can now run the app by double-clicking the "Stock Prophet" shortcut on your desktop.
) else (
    echo Failed to create shortcut. Please try running this script as administrator.
)

pause 
@echo off
echo Creating desktop shortcut for Stock Prophet using alternative method...

:: Run the VBS script
cscript //nologo "%~dp0create-shortcut-alt.vbs"

echo.
echo If the shortcut was successfully created, you can now run the app by double-clicking the "Stock Prophet" shortcut on your desktop.
echo If you're still having issues, please try running this script as administrator.
pause 
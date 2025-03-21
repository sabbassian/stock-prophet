' Alternative shortcut creation script using VBScript
Option Explicit

' Get the current directory
Dim fso, currentDir, desktopPath, startScript
Set fso = CreateObject("Scripting.FileSystemObject")
currentDir = fso.GetAbsolutePathName(".")
startScript = currentDir & "\start-app.bat"

' Get the desktop path
Set WshShell = CreateObject("WScript.Shell")
desktopPath = WshShell.SpecialFolders("Desktop")

' Create the shortcut
Set shortcut = WshShell.CreateShortcut(desktopPath & "\Stock Prophet.lnk")
shortcut.TargetPath = startScript
shortcut.WorkingDirectory = currentDir
shortcut.Description = "Launch Stock Prophet App"
shortcut.IconLocation = "C:\Windows\System32\shell32.dll,23"
shortcut.Save

WScript.Echo "Shortcut created successfully at: " & desktopPath & "\Stock Prophet.lnk" 
@echo off
echo Initializing Git repository for Stock Prophet...
echo.

:: Change to the project directory
cd /d "%~dp0"

:: Check if Git is installed
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Git is not installed or not in the PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    pause
    exit /b 1
)

:: Initialize repository if .git folder doesn't exist
if not exist .git (
    echo Initializing new Git repository...
    git init
    echo.
) else (
    echo Git repository already initialized.
    echo.
)

:: Add files to staging
echo Adding files to Git staging area...
git add .
echo.

:: Commit changes
echo Committing changes...
set /p COMMIT_MSG="Enter commit message (default: Initial commit): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG=Initial commit
git commit -m "%COMMIT_MSG%"
echo.

:: Determine the current branch name
for /f "tokens=*" %%a in ('git branch --show-current 2^>nul') do set BRANCH_NAME=%%a
if "%BRANCH_NAME%"=="" set BRANCH_NAME=main
echo Detected branch name: %BRANCH_NAME%
echo.

:: Ask for GitHub username and repository name
set /p GITHUB_USER="Enter your GitHub username: "
set /p REPO_NAME="Enter repository name (default: stock-prophet): "
if "%REPO_NAME%"=="" set REPO_NAME=stock-prophet

:: Add remote if provided
if not "%GITHUB_USER%"=="" (
    echo Setting up remote repository...
    git remote add origin https://github.com/%GITHUB_USER%/%REPO_NAME%.git
    echo.
    
    :: Ask if user wants to push
    set /p PUSH_NOW="Push to GitHub now? (y/n): "
    if /i "%PUSH_NOW%"=="y" (
        echo Pushing to GitHub...
        git push -u origin %BRANCH_NAME%
        
        if %ERRORLEVEL% NEQ 0 (
            echo First push failed. This might be because your branch is named differently on GitHub.
            echo Trying with "main" branch...
            git push -u origin main
            
            if %ERRORLEVEL% NEQ 0 (
                echo Push to "main" failed. Trying with "master" branch...
                git push -u origin master
                
                if %ERRORLEVEL% NEQ 0 (
                    echo Push failed. Please push manually with the correct branch name.
                    echo Use: git push -u origin YOUR_BRANCH_NAME
                )
            )
        )
        
        echo.
        echo Repository pushed to GitHub.
        echo You can now deploy to Netlify by following the instructions in GITHUB.md
    ) else (
        echo.
        echo To push to GitHub later, use: git push -u origin %BRANCH_NAME%
        echo.
        echo Please see GITHUB.md for more information on deploying to Netlify.
    )
) else (
    echo.
    echo No GitHub username provided. Skipping remote setup.
    echo Please see GITHUB.md for more information on setting up GitHub and deploying to Netlify.
)

echo.
echo Git initialization complete!
pause 
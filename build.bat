@echo off
REM Build script for creating Windows executable
REM This script automates the process of building the .exe file

echo ========================================
echo Murrkan - Windows Executable Builder
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.7 or higher from https://www.python.org/
    pause
    exit /b 1
)

echo [1/4] Checking Python installation...
python --version

REM Check if virtual environment exists
if not exist "venv\" (
    echo.
    echo [2/4] Creating virtual environment...
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
) else (
    echo.
    echo [2/4] Virtual environment already exists
)

REM Activate virtual environment and install dependencies
echo.
echo [3/4] Installing dependencies...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

REM Build the executable
echo.
echo [4/4] Building Windows executable...
echo This may take a few minutes...
echo.

REM Create output directory if it doesn't exist
if not exist "dist\" mkdir dist

REM Run PyInstaller with configuration
pyinstaller --clean --noconfirm ^
    --onefile ^
    --windowed ^
    --name Murrkan ^
    --icon=NONE ^
    --add-data "README.md;." ^
    app.py

if errorlevel 1 (
    echo.
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo The executable has been created at:
echo   dist\Murrkan.exe
echo.
echo You can now distribute this file to other Windows computers.
echo No Python installation is required on the target machine.
echo.
pause

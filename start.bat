@echo off
echo ========================================
echo   Restoran Yonetim Sistemi - Murrkan
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Python bulunamadi! Lutfen Python 3.8 veya uzeri yukleyin.
    echo Python indirmek icin: https://www.python.org/downloads/
    pause
    exit /b 1
)

REM Check if virtual environment exists
if not exist "venv\" (
    echo Sanal ortam olusturuluyor...
    python -m venv venv
    if errorlevel 1 (
        echo Sanal ortam olusturulamadi!
        pause
        exit /b 1
    )
)

REM Activate virtual environment
echo Sanal ortam aktif ediliyor...
call venv\Scripts\activate.bat

REM Install/update dependencies
echo.
echo Bagimliliklar kontrol ediliyor...
pip install -r requirements.txt --quiet
if errorlevel 1 (
    echo Bagimliliklar yuklenirken hata olustu!
    pause
    exit /b 1
)

REM Start the application
echo.
echo ========================================
echo   Sistem baslatiliyor...
echo ========================================
echo.
echo Ana Sayfa: http://localhost:8000
echo Admin Panel: http://localhost:8000/admin
echo Tablet Gorunumu: http://localhost:8000/tablet
echo.
echo API Dokumantasyonu: http://localhost:8000/docs
echo.
echo Durdurmak icin Ctrl+C basin
echo ========================================
echo.

python start.py

pause

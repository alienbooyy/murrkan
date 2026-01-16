#!/bin/bash

echo "========================================"
echo "  Restoran Yönetim Sistemi - Murrkan"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null
then
    echo "Python bulunamadı! Lütfen Python 3.8 veya üzeri yükleyin."
    exit 1
fi

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Sanal ortam oluşturuluyor..."
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "Sanal ortam oluşturulamadı!"
        exit 1
    fi
fi

# Activate virtual environment
echo "Sanal ortam aktif ediliyor..."
source venv/bin/activate

# Install/update dependencies
echo ""
echo "Bağımlılıklar kontrol ediliyor..."
pip install -r requirements.txt --quiet
if [ $? -ne 0 ]; then
    echo "Bağımlılıklar yüklenirken hata oluştu!"
    exit 1
fi

# Start the application
echo ""
echo "========================================"
echo "  Sistem başlatılıyor..."
echo "========================================"
echo ""
echo "Ana Sayfa: http://localhost:8000"
echo "Admin Panel: http://localhost:8000/admin"
echo "Tablet Görünümü: http://localhost:8000/tablet"
echo ""
echo "API Dokümantasyonu: http://localhost:8000/docs"
echo ""
echo "Durdurmak için Ctrl+C basın"
echo "========================================"
echo ""

python3 start.py

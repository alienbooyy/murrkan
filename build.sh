#!/bin/bash
# Build script for creating Windows executable (Linux/Mac version)
# This script can be used on Linux or Mac with wine/pyinstaller

set -e

echo "========================================"
echo "Murrkan - Windows Executable Builder"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo "Please install Python 3.7 or higher"
    exit 1
fi

echo "[1/4] Checking Python installation..."
python3 --version

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo ""
    echo "[2/4] Creating virtual environment..."
    python3 -m venv venv
else
    echo ""
    echo "[2/4] Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
echo ""
echo "[3/4] Installing dependencies..."
source venv/bin/activate
python3 -m pip install --upgrade pip
pip3 install -r requirements.txt

# Build the executable
echo ""
echo "[4/4] Building Windows executable..."
echo "This may take a few minutes..."
echo ""

# Create output directory if it doesn't exist
mkdir -p dist

# Run PyInstaller with the spec file
pyinstaller --clean --noconfirm Murrkan.spec

echo ""
echo "========================================"
echo "Build completed successfully!"
echo "========================================"
echo ""
echo "The executable has been created at:"
echo "  dist/Murrkan.exe"
echo ""
echo "You can now distribute this file to Windows computers."
echo "No Python installation is required on the target machine."
echo ""

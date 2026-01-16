# Murrkan - Windows Executable Application

A Python application packaged as a standalone Windows executable (.exe) that can run on any Windows computer without requiring Python installation.

## 📋 Table of Contents

- [Overview](#overview)
- [System Requirements](#system-requirements)
- [For End Users](#for-end-users)
- [For Developers](#for-developers)
- [Building the Executable](#building-the-executable)
- [Distribution](#distribution)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project demonstrates how to convert a Python application into a standalone Windows executable using PyInstaller. The resulting `.exe` file can be distributed to users who don't have Python installed on their systems.

## 💻 System Requirements

### For End Users (Running the .exe)
- **Operating System**: Windows 7 or higher (64-bit recommended)
- **RAM**: Minimum 512 MB
- **Disk Space**: ~20 MB for the application
- **No Python installation required!**

### For Developers (Building the .exe)
- **Operating System**: Windows, Linux, or macOS
- **Python**: Version 3.7 or higher
- **pip**: Python package manager
- **Disk Space**: ~500 MB (for Python environment and build tools)

## 🚀 For End Users

### Running the Application

1. **Download** the `Murrkan.exe` file from the releases section
2. **Double-click** the `Murrkan.exe` file to run the application
3. The application will display system information and a welcome message
4. Press **Enter** to exit the application

**Note**: Windows may show a security warning when running the executable for the first time. This is normal for unsigned applications. Click "More info" and then "Run anyway" to proceed.

### No Installation Required

The executable is completely self-contained. Simply download and run - no installation, no dependencies, no Python required!

## 👨‍💻 For Developers

### Project Structure

```
murrkan/
├── app.py              # Main application source code
├── requirements.txt    # Python dependencies
├── build.bat          # Windows build script
├── build.sh           # Linux/Mac build script
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

### Setting Up Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/alienbooyy/murrkan.git
   cd murrkan
   ```

2. **Create a virtual environment** (optional but recommended):
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate

   # Linux/Mac
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application directly**:
   ```bash
   python app.py
   ```

## 🔨 Building the Executable

### Automatic Build (Recommended)

#### On Windows:
Simply double-click the `build.bat` file or run from command prompt:
```cmd
build.bat
```

#### On Linux/Mac:
Make the script executable and run it:
```bash
chmod +x build.sh
./build.sh
```

The build script will:
1. Check Python installation
2. Create a virtual environment (if needed)
3. Install required dependencies
4. Build the executable using PyInstaller
5. Output the `.exe` file to the `dist/` directory

### Manual Build

If you prefer to build manually:

```bash
# Install PyInstaller
pip install pyinstaller

# Build using the spec file (recommended)
pyinstaller --clean --noconfirm Murrkan.spec

# Or build with command-line options
pyinstaller --clean --noconfirm \
    --onefile \
    --console \
    --name Murrkan \
    --add-data "README.md:." \
    app.py
```

**Note**: Use `--console` for console applications (like this one). Only use `--windowed` for GUI applications.

### Build Options Explained

- `--onefile`: Package everything into a single .exe file
- `--console`: Show console window (required for console apps with user input)
- `--windowed`: Don't show console window (use for GUI apps only, **not for console apps**)
- `--name Murrkan`: Name of the output executable
- `--add-data`: Include additional files in the bundle
- `--clean`: Clean PyInstaller cache before building
- `--noconfirm`: Replace output directory without confirmation

**Note**: This application uses `--console` because it requires user input. Only use `--windowed` for GUI applications that don't need a console.

### Output Location

After a successful build, you'll find:
- **Executable**: `dist/Murrkan.exe` - This is the file to distribute
- **Build files**: `build/` - Temporary build artifacts (can be deleted)
- **Spec file**: `Murrkan.spec` - PyInstaller configuration (auto-generated)

## 📦 Distribution

### Distributing the Application

1. **Locate the executable**: After building, find `dist/Murrkan.exe`
2. **Test the executable**: Run it on your development machine first
3. **Test on a clean system**: Copy to a Windows computer without Python installed
4. **Create a release package** (optional):
   - Create a ZIP file containing the .exe and README
   - Include any additional assets or documentation
   - Upload to GitHub Releases or your preferred distribution method

### Creating a Release Package

```bash
# Create a distribution folder
mkdir release
cp dist/Murrkan.exe release/
cp README.md release/

# Create a ZIP archive (Linux/Mac)
zip -r Murrkan-v1.0-Windows.zip release/

# Or use PowerShell on Windows
Compress-Archive -Path release\* -DestinationPath Murrkan-v1.0-Windows.zip
```

### File Size Considerations

- The executable will be approximately 10-20 MB in size
- This includes the Python interpreter and all dependencies
- Size can be reduced by:
  - Using `--exclude-module` to remove unused modules
  - Using UPX compression (add `--upx-dir` flag)
  - Minimizing dependencies in `requirements.txt`

## 🔧 Troubleshooting

### Build Issues

**Problem**: `pyinstaller: command not found`
- **Solution**: Make sure PyInstaller is installed: `pip install pyinstaller`

**Problem**: Build fails with "module not found" error
- **Solution**: Ensure all dependencies are in `requirements.txt` and installed

**Problem**: The .exe file is too large
- **Solution**: Use `--exclude-module` to remove unnecessary modules or enable UPX compression

### Runtime Issues

**Problem**: Antivirus software blocks the executable
- **Solution**: This is common with PyInstaller executables. Add an exception in your antivirus or sign the executable with a code signing certificate

**Problem**: Application crashes on startup
- **Solution**: Run from command prompt to see error messages: Remove `--windowed` flag from build script to show console output

**Problem**: Missing DLL errors on target machine
- **Solution**: Ensure the target Windows version is supported (Windows 7+) and all required Visual C++ redistributables are installed

### Development Issues

**Problem**: Changes to `app.py` don't appear in the executable
- **Solution**: Rebuild the executable after making changes: `pyinstaller --clean ...`

**Problem**: Virtual environment activation fails
- **Solution**: Check Python installation and recreate venv: `python -m venv venv --clear`

## 📝 Customization

### Adding Your Own Features

1. Edit `app.py` to add your functionality
2. Add new Python dependencies to `requirements.txt`
3. Rebuild the executable using `build.bat` or `build.sh`
4. Test thoroughly before distribution

### Adding an Icon

1. Create or download a `.ico` file
2. Save it in the project directory (e.g., `icon.ico`)
3. Modify the build command:
   ```bash
   --icon=icon.ico
   ```

### Adding Data Files

To include additional files (images, config files, etc.):

```bash
--add-data "path/to/file;destination/folder"
```

Multiple files:
```bash
--add-data "data/*;data" --add-data "config.ini;."
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is provided as-is for educational and commercial use.

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: [GitHub Repository](https://github.com/alienbooyy/murrkan)

---

**Built with ❤️ using Python and PyInstaller**
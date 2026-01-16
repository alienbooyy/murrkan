# Troubleshooting Guide - Murrkan Application

This guide helps you resolve common issues when building or running the Murrkan Windows executable.

## Table of Contents

- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [PyInstaller Issues](#pyinstaller-issues)
- [Windows-Specific Issues](#windows-specific-issues)
- [Development Issues](#development-issues)

---

## Build Issues

### Problem: `python: command not found` or `python3: command not found`

**Cause**: Python is not installed or not in PATH

**Solution**:
1. Download Python from https://www.python.org/downloads/
2. During installation, check "Add Python to PATH"
3. Restart terminal/command prompt
4. Verify: `python --version` or `python3 --version`

### Problem: `pip: command not found`

**Cause**: pip is not installed or not in PATH

**Solution**:
```bash
# Windows
python -m ensurepip --upgrade

# Linux/Mac
python3 -m ensurepip --upgrade

# Or install manually
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python get-pip.py
```

### Problem: `pyinstaller: command not found`

**Cause**: PyInstaller not installed in current environment

**Solution**:
```bash
pip install pyinstaller

# Or if using virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate.bat  # Windows
pip install pyinstaller
```

### Problem: `ModuleNotFoundError` during build

**Cause**: Missing dependency in requirements.txt

**Solution**:
1. Identify missing module from error message
2. Add to requirements.txt:
   ```
   missing-module-name>=version
   ```
3. Reinstall requirements:
   ```bash
   pip install -r requirements.txt
   ```
4. Rebuild

### Problem: Build takes forever or freezes

**Cause**: Large dependencies or system resource constraints

**Solution**:
1. Close other applications
2. Use `--clean` flag to clear cache:
   ```bash
   pyinstaller --clean Murrkan.spec
   ```
3. Exclude unused modules in Murrkan.spec:
   ```python
   excludes=['tkinter', 'matplotlib', 'numpy', 'pandas']
   ```

### Problem: `.exe` file is too large (>100 MB)

**Cause**: Includes unnecessary dependencies

**Solution**:
1. Check what's included:
   ```bash
   pyinstaller --log-level=DEBUG Murrkan.spec
   ```
2. Add exclusions in Murrkan.spec:
   ```python
   excludes=[
       'tkinter',
       'matplotlib',
       'PyQt5',
       'PIL',
       'numpy',
       'pandas',
       'scipy',
       'notebook',
       'IPython',
   ]
   ```
3. Enable UPX compression in Murrkan.spec:
   ```python
   upx=True
   ```
4. Rebuild

### Problem: Virtual environment creation fails

**Cause**: Insufficient permissions or corrupted Python installation

**Solution**:
```bash
# Try with --clear flag
python -m venv venv --clear

# Or use virtualenv package
pip install virtualenv
virtualenv venv

# Check permissions
# Windows: Run as Administrator
# Linux/Mac: Check folder permissions
ls -la
```

---

## Runtime Issues

### Problem: `.exe` crashes on startup (no error message)

**Cause**: Missing runtime dependencies or console hidden

**Solution**:
1. Run from command prompt to see errors:
   ```cmd
   cd dist
   Murrkan.exe
   ```
2. Build with console visible:
   - In Murrkan.spec, set: `console=True`
   - Rebuild
3. Check Windows Event Viewer:
   - Windows Logs → Application
   - Look for application crashes

### Problem: `Failed to execute script` error

**Cause**: PyInstaller bootloader issue or corrupted build

**Solution**:
1. Rebuild with clean cache:
   ```bash
   pyinstaller --clean --noconfirm Murrkan.spec
   ```
2. Check antivirus isn't blocking:
   - Temporarily disable antivirus
   - Add exception for dist folder
3. Run as administrator (right-click → Run as administrator)

### Problem: Application shows error about missing DLL

**Cause**: Required system libraries not included

**Solution**:
1. Identify missing DLL from error message
2. Install Visual C++ Redistributable:
   - Download from Microsoft
   - Includes common DLLs (msvcr120.dll, etc.)
3. Add DLL to Murrkan.spec:
   ```python
   binaries=[('path/to/missing.dll', '.')],
   ```

### Problem: `Import Error: No module named 'encodings'`

**Cause**: Python installation issue or incomplete build

**Solution**:
1. Verify Python installation:
   ```bash
   python -c "import encodings; print('OK')"
   ```
2. Rebuild with --clean:
   ```bash
   pyinstaller --clean Murrkan.spec
   ```
3. Check Python version compatibility (3.7+)

### Problem: Application works on dev machine but not on others

**Cause**: Missing runtime dependencies on target machine

**Solution**:
1. Test on clean Windows VM or computer
2. Check target has:
   - Visual C++ Redistributable
   - .NET Framework (if needed)
   - DirectX (if using graphics)
3. Use dependency walker to find missing DLLs:
   - Download Dependency Walker
   - Open Murrkan.exe
   - Check for red items

### Problem: Antivirus deletes or blocks the `.exe`

**Cause**: False positive detection (common with PyInstaller)

**Solution**:
1. Submit to antivirus vendor as false positive
2. Add exception in antivirus software
3. Build with different settings:
   ```bash
   pyinstaller --noupx Murrkan.spec
   ```
4. Consider code signing (see DISTRIBUTION.md)

---

## PyInstaller Issues

### Problem: `FileNotFoundError` for data files

**Cause**: Data files not bundled correctly

**Solution**:
1. Check Murrkan.spec datas:
   ```python
   datas=[
       ('README.md', '.'),
       ('config/*', 'config'),
       ('images/*', 'images'),
   ],
   ```
2. Access files using correct path in code:
   ```python
   import sys
   import os
   
   if getattr(sys, 'frozen', False):
       # Running as compiled
       base_path = sys._MEIPASS
   else:
       # Running as script
       base_path = os.path.dirname(__file__)
   
   config_path = os.path.join(base_path, 'config.ini')
   ```

### Problem: Hidden imports not found

**Cause**: Dynamic imports not detected by PyInstaller

**Solution**:
Add to Murrkan.spec:
```python
hiddenimports=[
    'pkg_resources.py2_warn',
    'your.dynamic.module',
],
```

### Problem: `RecursionError: maximum recursion depth exceeded`

**Cause**: Complex imports or circular dependencies

**Solution**:
1. Increase recursion limit in app.py:
   ```python
   import sys
   sys.setrecursionlimit(5000)
   ```
2. Or before PyInstaller build:
   ```bash
   export PYTHONRECURSIONLIMIT=5000  # Linux/Mac
   set PYTHONRECURSIONLIMIT=5000     # Windows
   ```

### Problem: Build warnings about missing modules

**Cause**: Optional dependencies or false positives

**Solution**:
- Review warnings in `build/Murrkan/warn-Murrkan.txt`
- If module is truly unused, ignore warning
- If needed, add to hiddenimports in Murrkan.spec

---

## Windows-Specific Issues

### Problem: "Windows protected your PC" SmartScreen warning

**Cause**: Unsigned executable without reputation

**Solution**:
1. User clicks "More info" → "Run anyway"
2. Developer: Consider code signing (see DISTRIBUTION.md)
3. Build reputation through downloads over time

### Problem: Application doesn't have an icon

**Cause**: No icon specified in build

**Solution**:
1. Create or obtain .ico file (e.g., icon.ico)
2. Update Murrkan.spec:
   ```python
   icon='icon.ico'
   ```
3. Rebuild

### Problem: Console window flashes when running

**Cause**: Console setting in build

**Solution**:
In Murrkan.spec:
```python
console=False  # Hide console
```

### Problem: High DPI scaling issues

**Cause**: Windows DPI scaling not handled

**Solution**:
Add to app.py:
```python
import ctypes
try:
    ctypes.windll.shcore.SetProcessDpiAwareness(1)
except:
    pass
```

### Problem: Application blocked by Windows Firewall

**Cause**: Network access without proper configuration

**Solution**:
1. User: Allow through firewall when prompted
2. Developer: Add to documentation if app needs network access

---

## Development Issues

### Problem: Changes to code don't appear in `.exe`

**Cause**: Using old build without rebuilding

**Solution**:
```bash
# Always rebuild after code changes
pyinstaller --clean Murrkan.spec
```

### Problem: Can't debug the `.exe`

**Cause**: Executables are harder to debug

**Solution**:
1. Run Python script directly for debugging:
   ```bash
   python app.py
   ```
2. Build with debug mode:
   ```python
   # In Murrkan.spec
   debug=True
   ```
3. Use logging extensively:
   ```python
   import logging
   logging.basicConfig(filename='app.log', level=logging.DEBUG)
   ```

### Problem: Need to test on Windows but developing on Linux/Mac

**Solution**:
1. Use Wine on Linux/Mac:
   ```bash
   wine python.exe -m PyInstaller Murrkan.spec
   ```
2. Use Windows VM (VirtualBox, VMware)
3. Use Docker with Windows container
4. Use CI/CD (GitHub Actions) with Windows runner

### Problem: Git tracks build artifacts

**Cause**: Missing or incorrect .gitignore

**Solution**:
Ensure .gitignore contains:
```
__pycache__/
*.pyc
dist/
build/
venv/
*.egg-info/
```

---

## Performance Issues

### Problem: Application starts slowly

**Cause**: Large executable or many dependencies

**Solution**:
1. Profile startup time
2. Remove unnecessary imports
3. Lazy load heavy modules
4. Consider `--onedir` instead of `--onefile`:
   - Faster startup
   - Larger distribution size
   - Multiple files instead of single .exe

### Problem: Application uses too much memory

**Cause**: Python overhead or memory leaks

**Solution**:
1. Profile memory usage:
   ```python
   import tracemalloc
   tracemalloc.start()
   # ... your code ...
   print(tracemalloc.get_traced_memory())
   ```
2. Fix memory leaks in code
3. Use generator expressions instead of lists
4. Close file handles and connections properly

---

## Getting Help

### Before Asking for Help

1. **Check this guide** for similar issues
2. **Read error messages** carefully
3. **Review build warnings** in `build/Murrkan/warn-Murrkan.txt`
4. **Test with Python directly** to isolate PyInstaller issues
5. **Search online** for specific error messages

### When Asking for Help

Include:
- **Python version**: `python --version`
- **PyInstaller version**: `pyinstaller --version`
- **Operating system**: Windows version, Linux distro, macOS version
- **Full error message**: Copy entire error output
- **Build command**: What command you used
- **spec file**: Contents of Murrkan.spec
- **What you tried**: Steps to reproduce the issue

### Where to Get Help

1. **PyInstaller Documentation**: https://pyinstaller.org/
2. **PyInstaller GitHub Issues**: https://github.com/pyinstaller/pyinstaller/issues
3. **Stack Overflow**: Tag your question with `pyinstaller`
4. **This Project's Issues**: GitHub Issues for Murrkan-specific problems
5. **Python Discord/Reddit**: Community help

---

## Preventive Measures

### Best Practices to Avoid Issues

1. **Always use virtual environments**
   ```bash
   python -m venv venv
   ```

2. **Pin dependency versions** in requirements.txt
   ```
   pyinstaller==6.18.0
   ```

3. **Test builds regularly**, not just at the end

4. **Keep dependencies minimal** - only include what you need

5. **Use version control** (Git) - commit working builds

6. **Document custom build steps** if you deviate from standard process

7. **Test on clean systems** before distributing

8. **Keep backups** of working builds

---

## Still Having Issues?

If you've tried everything in this guide:

1. **Simplify**: Create minimal reproducible example
2. **Clean build**: Delete venv, build, dist folders and start fresh
3. **Update tools**: Upgrade Python, PyInstaller, pip
4. **Check compatibility**: Verify all versions are compatible
5. **Ask for help**: Post detailed issue on GitHub

---

**Remember**: Most issues are solvable! Take your time, read error messages carefully, and don't hesitate to ask for help.

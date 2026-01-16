# Quick Start Guide - Murrkan Application

## For Users (Running the Application)

### Windows Users
1. Download `Murrkan.exe` from the releases
2. Double-click the file to run
3. If Windows shows a security warning:
   - Click "More info"
   - Click "Run anyway"
4. The application will start and display system information
5. Press Enter to exit

**That's it! No installation required.**

## For Developers (Building from Source)

### Quick Build

#### On Windows:
```cmd
# Step 1: Double-click build.bat
OR
# Step 1: Open Command Prompt in project folder
build.bat

# Step 2: Find your executable in dist/Murrkan.exe
```

#### On Linux/Mac:
```bash
# Step 1: Open Terminal in project folder
chmod +x build.sh
./build.sh

# Step 2: Find your executable in dist/Murrkan.exe
```

### What Gets Created?

After building, you'll have:
- `dist/Murrkan.exe` - **This is your distributable file!**
- `build/` folder - Temporary files (can be deleted)
- `Murrkan.spec` - Build configuration (can be customized)

### Customization Quick Tips

**Change the application behavior:**
- Edit `app.py` and rebuild

**Add an icon:**
- Place `icon.ico` in the project folder
- Update `Murrkan.spec` line with: `icon='icon.ico'`
- Rebuild using: `pyinstaller Murrkan.spec`

**Hide the console window:**
- Change `console=True` to `console=False` in `Murrkan.spec`
- Rebuild

**Add more files to bundle:**
- Add to `datas` list in `Murrkan.spec`
- Example: `datas=[('config.ini', '.'), ('images', 'images')]`

## Testing Your Executable

### Test Locally
1. Build the executable
2. Run `dist/Murrkan.exe` 
3. Verify it works as expected

### Test on Clean System
1. Copy `dist/Murrkan.exe` to a USB drive
2. Run on a Windows PC without Python installed
3. Verify it runs without errors

## Distribution Checklist

- [ ] Application tested and working
- [ ] Executable built successfully
- [ ] Tested on development machine
- [ ] Tested on a clean Windows PC
- [ ] README.md updated with any changes
- [ ] Version number updated (if applicable)
- [ ] Release notes prepared
- [ ] Files packaged for distribution
- [ ] Uploaded to distribution platform

## Need Help?

- Check README.md for detailed documentation
- Review the Troubleshooting section
- Open an issue on GitHub

---

**Ready to distribute?** Just share the `dist/Murrkan.exe` file with your users!

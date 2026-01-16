# Changelog

All notable changes to the Murrkan project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Nothing yet

### Changed
- Nothing yet

### Deprecated
- Nothing yet

### Removed
- Nothing yet

### Fixed
- Nothing yet

### Security
- Nothing yet

## [1.0.0] - 2026-01-16

### Added
- Initial release of Murrkan application
- Simple Python application demonstrating Windows executable conversion
- PyInstaller configuration for building Windows .exe
- Build scripts for Windows (build.bat) and Linux/Mac (build.sh)
- Comprehensive documentation:
  - README.md with full project documentation
  - QUICKSTART.md for quick reference
  - DISTRIBUTION.md for distribution guidelines
  - TROUBLESHOOTING.md for common issues
- System information display feature
- User-friendly console interface
- .gitignore for build artifacts
- requirements.txt with dependencies

### Technical Details
- Python 3.7+ support
- PyInstaller 6.0.0+ for executable creation
- Single-file executable output
- Cross-platform build scripts
- Modular architecture for easy customization

---

## How to Use This Changelog

### For Developers

When making changes, add them under the `[Unreleased]` section in the appropriate category:

- **Added**: New features
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security fixes

When releasing a new version:
1. Change `[Unreleased]` to the new version number and date
2. Add a new `[Unreleased]` section at the top
3. Update version in app.py if applicable

### For Users

This changelog helps you understand:
- What's new in each release
- What bugs have been fixed
- What features have been added or removed
- Security updates

### Version Number Guide

- **Major** (1.x.x): Breaking changes, major new features
- **Minor** (x.1.x): New features, backward compatible
- **Patch** (x.x.1): Bug fixes, minor improvements

---

## Links

[Unreleased]: https://github.com/alienbooyy/murrkan/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/alienbooyy/murrkan/releases/tag/v1.0.0

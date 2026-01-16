#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Murrkan - Simple Python Application
This is a sample application that demonstrates the Windows executable conversion.
"""

import sys
import platform
from datetime import datetime


def print_banner():
    """Print application banner"""
    banner = """
    ╔═══════════════════════════════════════╗
    ║          MURRKAN APPLICATION          ║
    ║     Windows Executable Demo v1.0      ║
    ╚═══════════════════════════════════════╝
    """
    print(banner)


def get_system_info():
    """Get and display system information"""
    info = {
        "Platform": platform.system(),
        "Platform Version": platform.version(),
        "Architecture": platform.machine(),
        "Python Version": platform.python_version(),
        "Current Time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    return info


def main():
    """Main application entry point"""
    print_banner()
    
    print("Welcome to Murrkan Application!\n")
    print("System Information:")
    print("-" * 50)
    
    system_info = get_system_info()
    for key, value in system_info.items():
        print(f"{key:20s}: {value}")
    
    print("-" * 50)
    print("\nThis application has been successfully packaged as a Windows executable!")
    print("\nPress Enter to exit...")
    
    try:
        input()
    except (KeyboardInterrupt, EOFError):
        pass
    
    print("\nThank you for using Murrkan!")
    return 0


if __name__ == "__main__":
    sys.exit(main())

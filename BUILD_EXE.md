# Windows .exe Paketi Oluşturma Kılavuzu

Bu dosya, Murrkan Restoran Yönetim Sistemi için Windows .exe paketi oluşturma adımlarını içerir.

## Gereksinimler

- Python 3.8 veya üzeri
- PyInstaller kütüphanesi
- Windows işletim sistemi (önerilir)

## Kurulum

### 1. PyInstaller Kurulumu

```bash
pip install pyinstaller
```

### 2. Tüm Bağımlılıkları Yükleyin

```bash
pip install -r requirements.txt
```

## .exe Oluşturma

### Yöntem 1: Spec Dosyası ile (Önerilen)

```bash
pyinstaller murrkan.spec
```

Bu komut, `dist/Murrkan_Restaurant/` klasöründe çalıştırılabilir dosyayı oluşturacaktır.

### Yöntem 2: Manuel Komut

```bash
pyinstaller --name "Murrkan_Restaurant" ^
    --add-data "frontend;frontend" ^
    --add-data "static;static" ^
    --add-data "backend;backend" ^
    --add-data "README.md;." ^
    --add-data "KULLANICI_KILAVUZU.md;." ^
    --hidden-import uvicorn.logging ^
    --hidden-import uvicorn.loops ^
    --hidden-import uvicorn.loops.auto ^
    --hidden-import uvicorn.protocols ^
    --hidden-import uvicorn.protocols.http ^
    --hidden-import uvicorn.protocols.http.auto ^
    --hidden-import uvicorn.protocols.websockets ^
    --hidden-import uvicorn.protocols.websockets.auto ^
    --hidden-import uvicorn.lifespan ^
    --hidden-import uvicorn.lifespan.on ^
    start.py
```

**Not**: Linux/Mac için `;` yerine `:` kullanın.

## Çıktı Konumu

Derlenmiş uygulama şu konumda olacaktır:

```
dist/
└── Murrkan_Restaurant/
    ├── Murrkan_Restaurant.exe  # Ana çalıştırılabilir dosya
    ├── frontend/               # HTML dosyaları
    ├── static/                 # CSS ve JavaScript dosyaları
    ├── backend/                # Python modülleri
    └── ... (diğer bağımlılıklar)
```

## Çalıştırma

1. `dist/Murrkan_Restaurant/` klasörüne gidin
2. `Murrkan_Restaurant.exe` dosyasını çift tıklayın
3. Sistem otomatik olarak başlar ve tarayıcınızda açılır

## Dağıtım

### Klasör Olarak Dağıtım

Tüm `dist/Murrkan_Restaurant/` klasörünü kopyalayın ve dağıtın.

### ZIP Arşivi Oluşturma

```bash
# Windows
powershell Compress-Archive -Path dist\Murrkan_Restaurant -DestinationPath Murrkan_Restaurant.zip

# Linux/Mac
cd dist
zip -r ../Murrkan_Restaurant.zip Murrkan_Restaurant/
```

### Tek Dosya Olarak (Alternatif)

Tek bir exe dosyası oluşturmak için (daha yavaş başlatma):

```bash
pyinstaller --onefile --add-data "frontend;frontend" --add-data "static;static" start.py
```

**Not**: Bu yöntem önerilmez çünkü dosyalar her çalıştırmada geçici dizine çıkarılır.

## İmzalama (Opsiyonel)

Uygulamanızı dijital olarak imzalamak için:

1. Kod imzalama sertifikası edinin
2. `signtool` kullanın:

```bash
signtool sign /f mycert.pfx /p password /t http://timestamp.digicert.com dist\Murrkan_Restaurant\Murrkan_Restaurant.exe
```

## Yükleyici Oluşturma (Opsiyonel)

### Inno Setup ile

1. Inno Setup indirin: https://jrsoftware.org/isinfo.php
2. Aşağıdaki script'i kullanın:

```pascal
[Setup]
AppName=Murrkan Restaurant
AppVersion=1.0
DefaultDirName={pf}\Murrkan
DefaultGroupName=Murrkan Restaurant
OutputBaseFilename=Murrkan_Setup
Compression=lzma2
SolidCompression=yes

[Files]
Source: "dist\Murrkan_Restaurant\*"; DestDir: "{app}"; Flags: ignoreversion recursesubdirs

[Icons]
Name: "{group}\Murrkan Restaurant"; Filename: "{app}\Murrkan_Restaurant.exe"
Name: "{commondesktop}\Murrkan Restaurant"; Filename: "{app}\Murrkan_Restaurant.exe"

[Run]
Filename: "{app}\Murrkan_Restaurant.exe"; Description: "Launch Murrkan Restaurant"; Flags: postinstall nowait skipifsilent
```

### NSIS ile

1. NSIS indirin: https://nsis.sourceforge.io/
2. Script oluşturun ve derleyin

## Sorun Giderme

### "DLL not found" Hatası

Visual C++ Redistributable yükleyin:
https://aka.ms/vs/17/release/vc_redist.x64.exe

### "Failed to execute script" Hatası

Console modunda çalıştırarak hatayı görün:
```bash
pyinstaller --console start.py
```

### Eksik Modül Hatası

`--hidden-import` parametresi ile ekleyin:
```bash
pyinstaller --hidden-import module_name start.py
```

### Büyük Dosya Boyutu

Gereksiz modülleri hariç tutun:
```bash
pyinstaller --exclude-module matplotlib --exclude-module pandas start.py
```

## Test

Üretim öncesi test checklist:

- [ ] .exe dosyası çift tıklama ile çalışıyor
- [ ] Ana sayfa yükleniyor (http://localhost:8000)
- [ ] Admin paneli erişilebilir
- [ ] Tablet görünümü erişilebilir
- [ ] Veritabanı oluşturuluyor
- [ ] Örnek veriler yükleniyor
- [ ] Tüm API endpoint'leri çalışıyor
- [ ] Masa işlemleri yapılabiliyor
- [ ] Sipariş oluşturulabiliyor
- [ ] Ödeme alınabiliyor
- [ ] Raporlar oluşturulabiliyor

## Performans İpuçları

1. **UPX Sıkıştırma**: Dosya boyutunu küçültür
   ```bash
   pyinstaller --upx-dir=/path/to/upx start.py
   ```

2. **Lazy Import**: İhtiyaç duyulana kadar modül yüklemeyin

3. **Optimize Python**: -O bayrağı ile
   ```bash
   pyinstaller -O start.py
   ```

## Lisanslama

Üretim dağıtımı için tüm bağımlılıkların lisanslarını kontrol edin:
- FastAPI: MIT
- SQLAlchemy: MIT
- Uvicorn: BSD
- Pydantic: MIT
- Python-escpos: MIT
- Openpyxl: MIT

## Destek

Sorunlar için:
- GitHub Issues: https://github.com/alienbooyy/murrkan/issues
- README.md dosyasını okuyun
- KULLANICI_KILAVUZU.md dosyasını okuyun

---

**İyi şanslar!** 🎉

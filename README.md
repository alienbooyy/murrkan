# Murrkan - Restoran Yönetim Sistemi

Modern, dokunmatik ekran uyumlu restoran otomasyon sistemi. Python FastAPI backend ve vanilla JavaScript frontend ile geliştirilmiştir.

## 🎯 Özellikler

### 📋 Ana Özellikler
- **Masa Yönetimi**: Masaların boş/dolu durumu, masa taşıma ve birleştirme
- **Adisyon Yönetimi**: Ürün ekleme/silme, ödeme işlemleri, Alman usulü ödeme
- **Ürün Yönetimi**: Ürün ekleme, düzenleme, silme, fiyat belirleme
- **Hammadde ve Stok Takibi**: Stok yönetimi, minimum stok uyarıları
- **Reçete Yönetimi**: Ürünler için hammadde reçeteleri
- **Raporlama**: Günlük ve tarih aralığı raporları, Excel çıktısı
- **Tablet Entegrasyonu**: Dokunmatik uyumlu sipariş alma ekranı
- **Yazıcı Entegrasyonu**: Mutfak ve fırın için ayrı yazıcı desteği

### 💼 Admin Panel
- Gün sonu raporları ve Excel dışa aktarma
- Tarih aralığı seçerek geçmiş raporları görüntüleme
- En çok satan ürünler listesi
- Kar-zarar hesaplamaları
- Ürün, hammadde ve reçete yönetimi

### 📱 Tablet Görünümü
- Dokunmatik ekran uyumlu arayüz
- Hızlı sipariş alma
- Masa bazlı sipariş yönetimi
- Otomatik mutfak/fırın yazıcı yönlendirmesi

## 🚀 Kurulum

### Gereksinimler
- Python 3.8 veya üzeri
- pip (Python paket yöneticisi)

### Adım Adım Kurulum

1. **Depoyu klonlayın**
```bash
git clone https://github.com/alienbooyy/murrkan.git
cd murrkan
```

2. **Sanal ortam oluşturun (önerilir)**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Bağımlılıkları yükleyin**
```bash
pip install -r requirements.txt
```

4. **Sunucuyu başlatın**
```bash
python -m backend.main
```

5. **Tarayıcıda açın**
```
http://localhost:8000
```

## 📖 Kullanım

### Ana Sayfa (Masa Yönetimi)
1. Masalara tıklayarak adisyon ekranını açın
2. Ürün kategorilerinden seçim yaparak sipariş ekleyin
3. Ödeme seçenekleri:
   - **Kapat**: Masayı kapatır
   - **Alman Usulü**: Seçilen ürünlerin ödemesini alır
   - **Ödeme Al**: Tüm adisyonu öder
   - **Yazdır**: Adisyonu yazdırır

### Tablet Görünümü
1. Masa seçin
2. Ürünleri seçerek sipariş oluşturun
3. "Siparişi Gönder" ile mutfağa/fırına gönderin

### Admin Panel
1. **Raporlar**: Günlük ve dönemsel raporları görüntüleyin
2. **Ürünler**: Menü ürünlerini yönetin
3. **Hammaddeler**: Stok takibi yapın
4. **Reçeteler**: Ürün reçetelerini tanımlayın

## 🌐 Lokal Ağ Üzerinden Erişim

### Router Üzerinden Bağlantı

1. **Sunucu IP adresini öğrenin**
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

2. **Sunucuyu tüm ağlara açık başlatın**
```bash
# main.py dosyasında zaten 0.0.0.0 olarak ayarlanmıştır
python -m backend.main
```

3. **Diğer cihazlardan erişin**
```
http://[SUNUCU-IP]:8000
```
Örnek: `http://192.168.1.100:8000`

### Router Ayarları
- Sabit IP adresi atayın (önerilir)
- Port yönlendirmesi gerekmez (aynı ağdaysanız)
- Firewall'da 8000 portunu açın

## 🖨️ Yazıcı Entegrasyonu

### Termal Yazıcı Kurulumu

1. **Yazıcı bağlantı bilgilerini edinin**
   - Network yazıcı için IP adresi
   - USB yazıcı için vendor/product ID

2. **printer.py dosyasını düzenleyin**
```python
# Network yazıcı
from escpos.printer import Network
printer = Network("192.168.1.100")

# USB yazıcı
from escpos.printer import Usb
printer = Usb(0x04b8, 0x0e28)  # Vendor ID, Product ID
```

3. **Ürün yazıcı hedefini ayarlayın**
   - Admin Panel > Ürünler > Yazıcı: Mutfak veya Fırın

## 📁 Proje Yapısı

```
murrkan/
├── backend/              # Backend kaynak kodları
│   ├── main.py          # FastAPI ana dosyası
│   ├── models.py        # Veritabanı modelleri
│   ├── schemas.py       # Pydantic şemaları
│   ├── crud.py          # CRUD işlemleri
│   ├── database.py      # Veritabanı bağlantısı
│   └── printer.py       # Yazıcı entegrasyonu
├── frontend/            # HTML sayfaları
│   ├── index.html       # Ana sayfa
│   ├── admin.html       # Admin paneli
│   └── tablet.html      # Tablet görünümü
├── static/              # Statik dosyalar
│   ├── css/
│   │   └── main.css    # Stil dosyası
│   └── js/
│       ├── main.js      # Ana sayfa JS
│       ├── admin.js     # Admin panel JS
│       └── tablet.js    # Tablet JS
├── reports/             # Rapor çıktıları
├── requirements.txt     # Python bağımlılıkları
└── README.md           # Bu dosya
```

## 🔧 Yapılandırma

### Veritabanı
- SQLite veritabanı otomatik oluşturulur: `restaurant.db`
- İlk başlatmada 10 masa otomatik eklenir

### Örnek Veri Ekleme

Python konsolunda:
```python
from backend.database import SessionLocal
from backend import models

db = SessionLocal()

# Örnek ürün ekle
product = models.Product(
    name="Lahmacun",
    price=25.0,
    category="Yemek",
    printer_destination="oven"
)
db.add(product)
db.commit()
```

## 📦 Windows .exe Paketi Oluşturma

PyInstaller kullanarak standalone .exe oluşturun:

1. **PyInstaller yükleyin**
```bash
pip install pyinstaller
```

2. **Exe dosyası oluşturun**
```bash
pyinstaller --onefile --add-data "frontend;frontend" --add-data "static;static" backend/main.py
```

3. **Çalıştırın**
```bash
dist/main.exe
```

## 🛠️ Geliştirme

### API Dokümantasyonu
FastAPI otomatik dokümantasyon:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Yeni Özellik Ekleme
1. `backend/models.py` - Gerekirse yeni modeller ekleyin
2. `backend/schemas.py` - Pydantic şemaları tanımlayın
3. `backend/crud.py` - CRUD fonksiyonları ekleyin
4. `backend/main.py` - API endpoint'leri oluşturun
5. Frontend'de ilgili JavaScript ve HTML güncellemelerini yapın

## 🐛 Sorun Giderme

### Veritabanı Hataları
```bash
# Veritabanını sıfırla
rm restaurant.db
python -m backend.main
```

### Port Zaten Kullanımda
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:8000 | xargs kill -9
```

### Yazıcı Bağlantı Sorunları
- Yazıcı IP adresini kontrol edin
- Firewall ayarlarını kontrol edin
- USB yazıcı için driver yüklü olmalı

## 🔐 Güvenlik

- Üretim ortamında güvenli parolalar kullanın
- HTTPS kullanımı önerilir
- Firewall kurallarını düzenleyin
- Düzenli yedekleme yapın

## 📝 Lisans

Bu proje özel kullanım için geliştirilmiştir.

## 👥 Destek

Sorularınız için:
- GitHub Issues: https://github.com/alienbooyy/murrkan/issues
- E-posta: [İletişim bilgisi eklenecek]

## 🎉 Teşekkürler

Bu sistemi kullandığınız için teşekkür ederiz!
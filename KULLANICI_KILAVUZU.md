# Murrkan - Kullanıcı Kılavuzu

## İçindekiler
1. [Hızlı Başlangıç](#hızlı-başlangıç)
2. [Masa Yönetimi](#masa-yönetimi)
3. [Sipariş Alma](#sipariş-alma)
4. [Ödeme İşlemleri](#ödeme-işlemleri)
5. [Admin Panel](#admin-panel)
6. [Tablet Kullanımı](#tablet-kullanımı)
7. [Sık Sorulan Sorular](#sık-sorulan-sorular)

## Hızlı Başlangıç

### Sistemi Başlatma

**Windows:**
```
start.bat dosyasına çift tıklayın
```

**Linux/Mac:**
```bash
./start.sh
```

### İlk Giriş
1. Tarayıcınızda `http://localhost:8000` adresini açın
2. Sistem otomatik olarak 10 masa ile başlar
3. Örnek ürünler ve hammaddeler yüklenmiş olarak gelir

## Masa Yönetimi

### Masa Durumları
- **Yeşil (Boş)**: Masa müsait
- **Kırmızı (Dolu)**: Masada aktif sipariş var
- **Turuncu (Rezerve)**: Masa rezerve edilmiş

### Masa İşlemleri

#### Sipariş Almak
1. Masaya tıklayın
2. Adisyon ekranı açılır
3. Kategori butonlarından seçim yapın
4. Ürünlere tıklayarak sipariş ekleyin

#### Masa Birleştirme
1. Admin panelden masa ayarlarını kullanın
2. API üzerinden birleştirme yapılabilir

## Sipariş Alma

### Ürün Ekleme
1. Masayı açın
2. Kategori seçin (Yemek, İçecek, Tatlı)
3. Ürüne tıklayın
4. Sipariş otomatik olarak eklenir

### Ürün Silme
1. Sipariş listesinde "Sil" butonuna tıklayın
2. Ürün siparişten çıkarılır
3. Stok otomatik güncellenir

### Miktar Değiştirme
1. Sipariş listesinde + ve - butonlarını kullanın
2. Fiyat otomatik hesaplanır

## Ödeme İşlemleri

### Tam Ödeme
1. "Ödeme Al" butonuna tıklayın
2. Nakit veya Kredi Kartı seçin
3. Masa otomatik kapanır

### Alman Usulü Ödeme
1. "Alman Usulü" butonuna tıklayın
2. Ödenecek ürünleri seçin
3. Ödeme yöntemini seçin
4. Seçilen ürünler işaretlenir
5. Tüm ürünler ödenince masa kapanır

### Yazdırma
1. "Yazdır" butonuna tıklayın
2. Adisyon dosya olarak kaydedilir
3. Yazıcı ayarlandıysa termal yazıcıdan çıkar

### Masayı Kapatma
1. "Kapat" butonuna tıklayın
2. Ödenmemiş sipariş varsa uyarı verir
3. Onayladığınızda masa boşalır

## Admin Panel

### Erişim
`http://localhost:8000/admin`

### Raporlar

#### Günlük Rapor
1. "Raporlar" sekmesine gidin
2. Tarih seçin
3. "Rapor Görüntüle" butonuna tıklayın
4. Görüntülenen raporda:
   - Toplam ciro
   - Toplam sipariş sayısı
   - Toplam maliyet
   - Kar
   - Ürün bazlı satış detayları

#### Excel'e Aktarma
1. Günlük raporu görüntüleyin
2. "Excel'e Aktar" butonuna tıklayın
3. Dosya `reports/` klasörüne kaydedilir

#### Tarih Aralığı Raporu
1. Başlangıç ve bitiş tarihlerini seçin
2. "Rapor Görüntüle" butonuna tıklayın
3. Günlük dağılımları görüntüleyin

#### En Çok Satan Ürünler
- Otomatik olarak en çok satan 10 ürünü gösterir
- Satış miktarı ve toplam gelir bilgilerini içerir

### Ürün Yönetimi

#### Yeni Ürün Ekleme
1. "Ürünler" sekmesine gidin
2. "Yeni Ürün Ekle" butonuna tıklayın
3. Bilgileri doldurun:
   - Ürün Adı
   - Fiyat
   - Kategori (Yemek, İçecek, Tatlı, Diğer)
   - Yazıcı (Mutfak veya Fırın)
   - Açıklama (opsiyonel)
4. "Kaydet" butonuna tıklayın

#### Ürün Düzenleme
1. Ürün listesinde "Düzenle" butonuna tıklayın
2. Bilgileri güncelleyin
3. "Kaydet" butonuna tıklayın

#### Ürün Silme
1. "Sil" butonuna tıklayın
2. Onaylayın
3. Ürün pasif duruma geçer (kalıcı silinmez)

### Hammadde Yönetimi

#### Yeni Hammadde Ekleme
1. "Hammaddeler" sekmesine gidin
2. "Yeni Hammadde Ekle" butonuna tıklayın
3. Bilgileri doldurun:
   - Hammadde Adı
   - Birim (gr, kg, adet, lt, ml)
   - Stok Miktarı
   - Minimum Stok (uyarı için)
   - Birim Maliyet
4. "Kaydet" butonuna tıklayın

#### Stok Güncelleme
1. Hammadde listesinde "Düzenle" butonuna tıklayın
2. Stok miktarını güncelleyin
3. "Kaydet" butonuna tıklayın

#### Düşük Stok Uyarısı
- Stok minimum seviyenin altına düşerse kırmızı arka plan ile gösterilir
- ⚠️ işareti görünür

### Reçete Yönetimi

#### Reçete Oluşturma
1. "Reçeteler" sekmesine gidin
2. Ürün seçin
3. "Malzeme Ekle" butonuna tıklayın
4. Hammadde ve miktarı girin
5. "Ekle" butonuna tıklayın

#### Reçete Düzenleme
- Mevcut malzemeyi silip yenisini ekleyin

#### Maliyet Hesaplama
- Sistem otomatik olarak:
  - Ürün maliyetini hesaplar
  - Stoktan düşer
  - Kar-zarar raporlarında kullanır

## Tablet Kullanımı

### Erişim
`http://[SUNUCU-IP]:8000/tablet`

Örnek: `http://192.168.1.100:8000/tablet`

### Tablet Sipariş Alma

#### Başlangıç
1. Tablet görünümünü açın
2. Masa seçin (üst kısımda)
3. Mevcut siparişler otomatik yüklenir

#### Sipariş Ekleme
1. Kategori seçin
2. Ürünlere dokunun
3. Alt kısımda sipariş özeti görünür

#### Sipariş Gönderme
1. Siparişi kontrol edin
2. "Siparişi Gönder" butonuna tıklayın
3. Sipariş mutfağa/fırına gönderilir
4. Yazıcıdan otomatik çıkar

#### Sipariş Temizleme
- "Temizle" butonu ile gönderilmemiş siparişler silinir

### Dokunmatik Optimizasyon
- Tüm butonlar en az 44x44 piksel
- Kolay dokunma için büyük alanlar
- Kaydırma ve yakınlaştırma devre dışı
- Hızlı tepki süresi

## Sık Sorulan Sorular

### Sistem İle İlgili

**S: Sunucu başlamıyor?**
C: 
- Python yüklü mü kontrol edin
- Port 8000 kullanımda mı kontrol edin
- Terminal/komut satırında hata mesajlarını okuyun

**S: Veritabanı hatası alıyorum?**
C:
- `restaurant.db` dosyasını silin
- Sistemi yeniden başlatın
- Veritabanı otomatik oluşturulacak

**S: Tablet bağlanamıyor?**
C:
- Aynı ağda mı kontrol edin
- Firewall ayarlarını kontrol edin
- IP adresini doğru girdiğinizden emin olun

### Yazıcı İle İlgili

**S: Yazıcı çalışmıyor?**
C:
- Yazıcı IP adresini `backend/printer.py`'de kontrol edin
- Yazıcı aynı ağda mı kontrol edin
- USB yazıcı için driver kurulu mu kontrol edin

**S: Siparişler yazıcıdan çıkmıyor?**
C:
- `backend/printer.py` dosyasında printer kodlarının yorumunu kaldırın
- Printer kütüphanesi yüklü mü: `pip install python-escpos`

### Kullanım İle İlgili

**S: Ürün stoktan düşmüyor?**
C:
- Ürün için reçete tanımlandı mı kontrol edin
- Reçetede hammaddeler var mı kontrol edin

**S: Rapor boş görünüyor?**
C:
- Seçilen tarihte tamamlanmış sipariş var mı kontrol edin
- Sadece "completed" durumundaki siparişler rapora dahil edilir

**S: Alman usulü ödeme nasıl çalışır?**
C:
- Aynı masada birden fazla kişi ayrı ödemek istediğinde kullanılır
- Her kişi kendi ürünlerini seçer ve öder
- Tüm ürünler ödenince masa kapanır

### Performans

**S: Sistem yavaş çalışıyor?**
C:
- Veritabanı boyutunu kontrol edin
- Eski siparişleri arşivleyin
- Tarayıcı önbelleğini temizleyin

**S: Birden fazla cihaz kullanabilir miyim?**
C:
- Evet, sınırsız cihaz bağlanabilir
- Aynı anda birden fazla kullanıcı çalışabilir
- Masa durumları gerçek zamanlı güncellenmez (sayfa yenileme gerekir)

## İletişim ve Destek

Sorunlarınız için:
- GitHub Issues: https://github.com/alienbooyy/murrkan/issues
- Dokümantasyon: README.md dosyasını okuyun
- API Dokümantasyonu: http://localhost:8000/docs

---

**Not**: Bu kılavuz sürekli güncellenmektedir. En son versiyonu için GitHub deposunu ziyaret edin.

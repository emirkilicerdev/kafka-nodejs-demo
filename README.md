# Kafka + Redis Demo

Bu proje, Node.js ile basit bir Kafka üretici/ tüketici (producer/consumer) akışı oluşturup
Redis kullanarak ürün stokunu yöneten örnek bir demo uygulamasıdır. Amaç, Kafka ile
mesajlaşma (örneğin sipariş iletimi) ve Redis ile hızlı anahtar-değer tabanlı
stok takibinin nasıl entegre edilebileceğini göstermektir.

**Kısa Özet:**
- `producer.js`: `siparisler` topic'ine örnek bir sipariş mesajı gönderir.
- `consumer.js`: `siparisler` topic'ini dinler, gelen siparişe göre Redis'teki
	`stok:<urun>` anahtarını kontrol eder ve stok varsa 1 azaltır.
- `stok-yukle.js`: Redis'e başlangıç stoğu yüklemek için örnek bir betiktir (`stok:Laptop` = 5).

**Kafka nedir?**
Kafka dağıtılmış, yüksek performanslı bir mesajlaşma (event streaming) platformudur.
Uygulamalar arasında veriyi güvenilir ve sıralı şekilde iletmek için kullanılır. Örneğin
bir e-ticaret sisteminde siparişler, ödeme işlemleri veya log verileri Kafka üzerinden yayınlanabilir.

**Redis nedir?**
Redis, bellek içi (in-memory) çalışan anahtar-değer veri deposudur. Çok hızlıdır ve
sıklıkla önbellekleme, sayaçlar veya kısa süreli veri saklama için kullanılır. Bu projede
Redis, ürün stok sayılarını tutmak için kullanılmıştır.

Gereksinimler
- Node.js (14+ önerilir)
- Çalışan bir Kafka broker'ı (varsayılan bu demo için `localhost:9092` olarak ayarlanmıştır)
- Çalışan bir Redis sunucusu (varsayılan `localhost:6379`)

Kurulum
1. Bağımlılıkları yükleyin:

```powershell
npm install
```

2. Kafka başlatma (Docker kullanıyorsanız örnek):

```powershell
docker-compose up -d
```

3. Redis başlatma (lokalde yüklüyse):

```powershell
redis-server
```

Alternatif olarak Redis'i Docker ile çalıştırmak için:

```powershell
docker run -d --name redis -p 6379:6379 redis
```

Nasıl çalıştırılır (örnek akış)
1. Önce Redis'e başlangıç stoğunu yükleyin:

```powershell
node stok-yukle.js
```

2. Tüketiciyi (consumer) başlatın — bu komut sürekli çalışır ve `siparisler` topic'ini dinler:

```powershell
node consumer.js
```

3. Ayrı bir terminalde üreticiyi (producer) çalıştırarak bir sipariş gönderin:

```powershell
node producer.js
```

Beklenen davranış
- `producer.js` `siparisler` topic'ine bir JSON mesajı gönderir (örnek: `{ siparis_id:1001, urun: "Kasa" }`).
- `consumer.js` bu mesajı alır, Redis'te `stok:<urun>` anahtarını okur. Eğer stok > 0 ise
	`decr` ile stoğu azaltır ve siparişi onaylar; aksi halde stok tükenmiş uyarısı verir.

Notlar / İpuçları
- `kafkajs` bağlantı ayarları `producer.js` ve `consumer.js` içinde `localhost:9092` şeklindedir.
	Eğer Kafka'yı Docker içinde çalıştırıyorsanız ve farklı bir host/port kullanıyorsanız
	bu adresleri güncelleyin.
- `package.json` içindeki bağımlılıklar: `kafkajs`, `redis`.
- Topic yoksa `kafkajs` üretici/ tüketici ile otomatik oluşturma davranışı Kafka sunucusu
	ayarlarına bağlıdır; gerekirse Docker içindeki Kafka için `kafka-topics.sh` ile topic oluşturun.

Sorun giderme
- Redis bağlantı hatası: Redis'in çalıştığından ve `6379` portunun dinlendiğinden emin olun.
- Kafka bağlantı hatası: Broker adresini ve Docker ağ ayarlarını kontrol edin.

const { Kafka } = require('kafkajs')
const { createClient } = require('redis')

const run = async () => {
  // 1. Bağlantıları Yap
  const kafka = new Kafka({ clientId: 'stok-servisi', brokers: ['localhost:9092'] })
  const consumer = kafka.consumer({ groupId: 'stok-grubu' })
  const redisClient = createClient() // Redis'e bağlan

  await consumer.connect()
  await redisClient.connect()
  console.log("🤖 Stok Servisi Hazır! Sipariş bekleniyor...")

  await consumer.subscribe({ topic: 'siparisler', fromBeginning: false })

  // 2. Mesaj Gelince Çalışacak Mantık
  await consumer.run({
    eachMessage: async ({ message }) => {
      const veri = JSON.parse(message.value.toString())
      const urunAdi = veri.urun
      
      // Redis'ten stoğu kontrol et
      // "stok:Laptop" anahtarını okuyoruz
      const mevcutStok = await redisClient.get(`stok:${urunAdi}`) 

      if (parseInt(mevcutStok) > 0) {
        // Stok var, 1 azalt (DECR komutu)
        await redisClient.decr(`stok:${urunAdi}`)
        console.log(`✅ Sipariş Onaylandı: ${urunAdi}. Kalan Stok: ${mevcutStok - 1}`)
      } else {
        // Stok yok
        console.log(`❌ HATA: ${urunAdi} stoğu tükenmiş! Sipariş reddedildi.`)
      }
    },
  })
}

run().catch(console.error)
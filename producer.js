const { Kafka } = require('kafkajs')

// 1. Kafka'ya Bağlanma Ayarları
const kafka = new Kafka({
  clientId: 'siparis-servisi',
  brokers: ['localhost:9092'] // Docker'daki Kafka adresi
})

const producer = kafka.producer()

const run = async () => {
  // 2. Producer'ı Başlat
  await producer.connect()
  console.log("✅ Producer Kafka'ya bağlandı!")

  // 3. Mesajı Gönder
  // Sanki 1001 numaralı sipariş gelmiş gibi bir JSON atalım.
  const siparisVerisi = JSON.stringify({ siparis_id: 1001, urun: "Kasa", fiyat: 25000 })

  await producer.send({
    topic: 'siparisler', // Mesajın gideceği kanal (Topic)
    messages: [
      { value: siparisVerisi },
    ],
  })

  console.log("📨 Mesaj gönderildi:", siparisVerisi)

  // 4. Bağlantıyı Kes
  await producer.disconnect()
}

run()
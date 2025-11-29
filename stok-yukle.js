const { createClient } = require('redis');

const run = async () => {
  const client = createClient();
  
  await client.connect();

  // "stok:Laptop" anahtarına 5 adet stok giriyoruz
  await client.set('stok:Laptop', 5);
  
  console.log("✅ Depoya 5 adet Laptop girişi yapıldı!");
  await client.disconnect();
}

run();
const express = require('express');
const projectRoutes = require('./routes/projectRoutes'); // Proje rotaları
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // .env dosyasını yükler

const authRoutes = require('./routes/auth'); // Auth rotaları

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB bağlantısı başarılı'))
.catch((err) => console.error('❌ MongoDB bağlantı hatası:', err));

// Basit test endpoint
app.get('/', (req, res) => {
  res.send('Backend çalışıyor!');
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API çalışıyor' });
});

// Auth rotalarını ekle
app.use('/api/auth', authRoutes); 


// Project rotalarını ekle (sadece bu satırı ekle)
app.use('/api/projects', projectRoutes);

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`🚀 Sunucu http://localhost:${port} adresinde çalışıyor`);
});

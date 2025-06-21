const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config(); // .env dosyasını yükler

// Rotalar
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projectRoutes');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload'); // ✅ dosya yükleme rotası

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// 📂 uploads klasörünü public olarak aç
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// API Rotaları
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes); // ✅ dosya upload endpoint

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`🚀 Sunucu http://localhost:${port} adresinde çalışıyor`);
});

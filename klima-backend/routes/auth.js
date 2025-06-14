const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');  // Modeli sonra oluşturacağız

// Kullanıcı kayıt endpoint'i
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basit validasyon
    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre zorunludur.' });
    }

    // Aynı email var mı kontrolü
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });
    }

    // Şifreyi hash'le
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Yeni kullanıcı oluştur
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'Kayıt başarılı.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Kullanıcı giriş endpoint'i
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Kullanıcı var mı kontrol et
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'E-posta veya şifre yanlış.' });
    }

    // Şifre kontrolü
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'E-posta veya şifre yanlış.' });
    }

    // JWT Token üret (örnek, gizli anahtarı .env'den okuyacağız)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Giriş başarılı.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

module.exports = router;

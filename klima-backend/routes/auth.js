const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/verifyToken');
const User = require('../models/User');  // Modelin doğru yerde olduğundan emin ol

// Kullanıcı kayıt endpoint'i
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Basit validasyon
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Kullanıcı adı, e-posta ve şifre zorunludur.' });
    }

    // Aynı email veya kullanıcı adı var mı kontrolü
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı.' });
    }

    if (existingUsername) {
      return res.status(400).json({ message: 'Bu kullanıcı adı alınmış.' });
    }

    // Şifreyi hash'le
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Yeni kullanıcı oluştur
    const newUser = new User({ username, email, password: hashedPassword });
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

    // JWT Token üret (kullanıcı adı da dahil)
const token = jwt.sign(
  { userId: user._id, username: user.username, email: user.email }, // ✅ email eklendi
  process.env.JWT_SECRET,
  { expiresIn: '1h' }
);



    res.json({ token, message: 'Giriş başarılı.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
});

// Kullanıcı adı güncelle
router.put('/update-username', verifyToken, async (req, res) => {
  const { newUsername } = req.body;
  if (!newUsername) return res.status(400).json({ message: 'Yeni kullanıcı adı gerekli.' });

  try {
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { username: newUsername },
      { new: true }
    );
    res.json({ message: 'Kullanıcı adı güncellendi', username: user.username });
  } catch (err) {
    res.status(500).json({ message: 'Kullanıcı adı güncellenemedi', error: err.message });
  }
});

// Şifre güncelle
router.put('/update-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Mevcut ve yeni şifre gereklidir.' });
  }

  try {
    const user = await User.findById(req.user.id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Mevcut şifre hatalı.' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Şifre başarıyla güncellendi' });
  } catch (err) {
    res.status(500).json({ message: 'Şifre güncellenemedi', error: err.message });
  }
});


module.exports = router;

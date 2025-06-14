const jwt = require('jsonwebtoken');

// Giriş yapmış kullanıcıları doğrulayan middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization başlığı yoksa
  if (!authHeader) {
    return res.status(401).json({ message: 'Yetkilendirme başarısız: Token bulunamadı.' });
  }

  // Bearer token formatı: "Bearer eyJhbGciOi..."
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token geçersiz.' });
  }

  try {
    // Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded içindeki bilgileri req.user olarak aktarıyoruz
    next(); // middleware zincirine devam
  } catch (err) {
    return res.status(403).json({ message: 'Token doğrulanamadı.' });
  }
};

module.exports = verifyToken;

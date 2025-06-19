const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Yetkilendirme başarısız: Token bulunamadı.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token geçersiz.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 👇 username'i de ekle!
    req.user = {
      id: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token doğrulanamadı.' });
  }
};

module.exports = verifyToken;

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// ✅ Maksimum tek dosya boyutu: 5 MB
const MAX_SIZE = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_SIZE },
});

router.post('/', upload.array('files'), (req, res) => {
  const filenames = req.files.map(f => f.filename);
  res.json({ uploadedFiles: filenames });
});

module.exports = router;

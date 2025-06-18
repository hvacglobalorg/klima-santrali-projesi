const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/verifyToken');

// ✅ Tüm projeleri getir (sadece giriş yapan kullanıcıya ait)
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('GET /api/projects çağrıldı');
    console.log('Kullanıcı ID:', req.user?.id);

    const projects = await Project.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Projeler alınamadı:', err);
    res.status(500).json({ message: 'Projeler alınamadı', error: err.message });
  }
});

// ✅ Yeni proje oluştur
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('POST /api/projects çağrıldı');
    console.log('JWT kullanıcı bilgisi:', req.user);
    console.log('Gönderilen body:', req.body);

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: 'Kullanıcı kimliği doğrulanamadı.' });
    }

    const {
      projectName,
      location,
      altitude,
      winterDryTemp,
      summerDryTemp,
      summerWetTemp,
      units,
    } = req.body;

    // Zorunlu alan kontrolü kaldırıldı,
    // eksik ya da hatalı alanlarda default değer atanıyor:

    const newProject = new Project({
      userId: req.user.id,
      projectName: typeof projectName === 'string' && projectName.trim() !== '' ? projectName.trim() : 'Yeni Proje',
      location: typeof location === 'string' && location.trim() !== '' ? location.trim() : 'Belirtilmedi',
      altitude: altitude !== undefined && altitude !== null && !isNaN(Number(altitude)) ? Number(altitude) : null,
      winterDryTemp: winterDryTemp !== undefined && winterDryTemp !== null && !isNaN(Number(winterDryTemp)) ? Number(winterDryTemp) : null,
      summerDryTemp: summerDryTemp !== undefined && summerDryTemp !== null && !isNaN(Number(summerDryTemp)) ? Number(summerDryTemp) : null,
      summerWetTemp: summerWetTemp !== undefined && summerWetTemp !== null && !isNaN(Number(summerWetTemp)) ? Number(summerWetTemp) : null,
      units: Array.isArray(units) ? units : [],
    });

    await newProject.save();
    console.log('✅ Yeni proje kaydedildi:', newProject._id);

    res.status(201).json({ message: 'Proje başarıyla kaydedildi', project: newProject });
  } catch (err) {
    console.error('❌ Proje kaydedilirken hata oluştu:', err);
    res.status(500).json({ message: 'Proje kaydedilemedi', error: err.message });
  }
});

// ✅ Projeyi sil
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: 'Proje bulunamadı veya yetkisiz erişim' });
    }

    await project.deleteOne();
    res.json({ message: 'Proje silindi' });
  } catch (err) {
    console.error('❌ Proje silinirken hata oluştu:', err);
    res.status(500).json({ message: 'Proje silinemedi', error: err.message });
  }
});

module.exports = router;

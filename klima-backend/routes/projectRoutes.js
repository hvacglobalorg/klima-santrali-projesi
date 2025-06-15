const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const verifyToken = require('../middleware/verifyToken');

// ✅ Tüm projeleri getir (sadece giriş yapan kullanıcıya ait)
router.get('/', verifyToken, async (req, res) => {
  try {
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
    console.log('Gönderilen body:', req.body);

    const {
      projectName,
      location,
      climateData,
      units,
    } = req.body;

    // Validasyon kontrolleri
    if (
      !projectName || typeof projectName !== 'string' ||
      !location || typeof location !== 'string' ||
      !climateData || typeof climateData !== 'object' ||
      climateData.altitude === undefined || climateData.altitude === null || isNaN(Number(climateData.altitude)) ||
      climateData.winterDB === undefined || climateData.winterDB === null || isNaN(Number(climateData.winterDB)) ||
      climateData.summerDB === undefined || climateData.summerDB === null || isNaN(Number(climateData.summerDB)) ||
      climateData.summerWB === undefined || climateData.summerWB === null || isNaN(Number(climateData.summerWB)) ||
      !Array.isArray(units)
    ) {
      return res.status(400).json({ message: 'Eksik veya hatalı veri gönderildi' });
    }

    const newProject = new Project({
      userId: req.user.id,
      projectName,
      location,
      altitude: Number(climateData.altitude),
      winterDryTemp: Number(climateData.winterDB),
      summerDryTemp: Number(climateData.summerDB),
      summerWetTemp: Number(climateData.summerWB),
      units,
    });

    await newProject.save();
    console.log('Yeni proje başarıyla kaydedildi:', newProject._id);

    res.status(201).json({ message: 'Proje başarıyla kaydedildi', project: newProject });
  } catch (err) {
    console.error('Proje kaydedilirken hata oluştu:', err);
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
    console.error('Proje silinirken hata oluştu:', err);
    res.status(500).json({ message: 'Proje silinemedi', error: err.message });
  }
});

module.exports = router;
